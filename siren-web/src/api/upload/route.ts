import { NextRequest, NextResponse } from "next/server";
import { Client } from "@bnb-chain/greenfield-js-sdk";

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
  "5600"
);

const MAX_RETRIES = 6;
const RETRY_DELAY = 2000; // 2 seconds

async function retryOperation(
  operation: () => Promise<any>,
  retries = MAX_RETRIES
): Promise<any> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.log(
        `Operation failed, retrying... (${
          MAX_RETRIES - retries + 1
        }/${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

function safeStringify(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

export async function POST(request: NextRequest) {
  try {
    const { bucketName, objectName, fileData, txnHash, address } =
      await request.json();

    if (!bucketName || !objectName || !fileData || !txnHash) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(fileData, "base64");

    console.log("Uploading object:", {
      bucketName,
      objectName,
      size: buffer.length,
    });

    const uploadRes = await retryOperation(() =>
      client.object.uploadObject(
        {
          bucketName: bucketName,
          objectName: objectName,
          body: {
            name: objectName,
            type: "json",
            size: buffer.length,
            content: buffer,
          },
          txnHash: txnHash,
        },
        {
          type: "ECDSA",
          privateKey: `0x${process.env.ADMIN_ACCOUNT_PRIVATEKEY!}`,
        }
      )
    );

    return NextResponse.json(JSON.parse(safeStringify(uploadRes)));
  } catch (error: any) {
    console.error("Failed to upload object:", error);

    let errorMessage = "Failed to upload object";
    let statusCode = 500;

    if (error.message && error.message.includes("already exists")) {
      errorMessage = "Object already exists";
      statusCode = 409; // Conflict
    } else if (error.message && error.message.includes("timeout")) {
      errorMessage = "Upload operation timed out";
      statusCode = 504; // Gateway Timeout
    } else if (error.message && error.message.includes("bucket not found")) {
      errorMessage = "Bucket not found";
      statusCode = 404; // Not Found
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}

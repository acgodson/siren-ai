import { NextRequest, NextResponse } from "next/server";
import {
  bytesFromBase64,
  Client,
  Long,
  RedundancyType,
} from "@bnb-chain/greenfield-js-sdk";

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
  "5600"
);

const MAX_RETRIES = 7;
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
    typeof value === "bigint" || value instanceof Long
      ? value.toString()
      : value
  );
}

export async function POST(request: NextRequest) {
  try {
    const { txData, operationType, operationData } = await request.json();

    console.log("Operation Type:", operationType);

    let tx: any;

    switch (operationType) {
      case "createBucket":
        tx = await client.bucket.createBucket({
          ...operationData,
          paymentAddress: `${process.env.ADMIN_ACCOUNT_ADDRESS!}`,
          creator: `${process.env.ADMIN_ACCOUNT_ADDRESS!}`,
          chargedReadQuota: Long.fromString("0"),
        });
        break;
      case "createObject":
        console.log("check");
        tx = await client.object.createObject({
          ...operationData,
          contentType: "json",
          payloadSize: Long.fromInt(operationData.payloadSize),
          redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
          expectChecksums: operationData.expectChecksums.map((x: any) =>
            bytesFromBase64(x)
          ),
          creator: `${process.env.ADMIN_ACCOUNT_ADDRESS!}`,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported operation type" },
          { status: 400 }
        );
    }

    const simulateInfo = await retryOperation(() =>
      tx.simulate({ denom: "BNB" })
    );

    console.log("Simulate Info:", safeStringify(simulateInfo));

    console.log(simulateInfo.gasLimit, simulateInfo.gasPrice);

    const response: any = await retryOperation(() =>
      tx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || "5000000000",
        payer: process.env.ADMIN_ACCOUNT_ADDRESS as string,
        granter: "",
        privateKey: `0x${process.env.ADMIN_ACCOUNT_PRIVATEKEY!}`,
      })
    );

    return NextResponse.json(JSON.parse(safeStringify(response)));
  } catch (error: any) {
    console.error("Failed to process transaction:", error);

    let errorMessage = "Failed to process transaction";
    let statusCode = 500;

    if (error.message && error.message.includes("already exists")) {
      errorMessage = error.message.includes("Bucket")
        ? "Bucket already exists"
        : "Object already exists";
      statusCode = 409; // Conflict
    } else if (error.message && error.message.includes("timeout")) {
      errorMessage = "Operation timed out";
      statusCode = 504; // Gateway Timeout
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}

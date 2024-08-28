import { NextRequest, NextResponse } from "next/server";
import { Client } from "@bnb-chain/greenfield-js-sdk";

export async function POST(req: NextRequest) {
  try {
    const { bucketName, objectName, fileData, txnHash, address } =
      await req.json();

    const client = Client.create(
      "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
      "5600"
    );

    const buffer = Buffer.from(fileData, "base64");

    const uploadRes = await client.object.uploadObject(
      {
        bucketName: bucketName,
        objectName: objectName,
        body: {
          name: objectName,
          type: "", // TODO: pass this from the frontend if needed
          size: buffer.length,
          content: buffer,
        },
        txnHash: txnHash,
      },
      {
        type: "ECDSA",
        privateKey: process.env.ACCOUNT_PRIVATEKEY!,
      }
    );

    return NextResponse.json(uploadRes);
  } catch (error) {
    console.error("Failed to upload object:", error);
    return new NextResponse("Failed to upload object", { status: 500 });
  }
}

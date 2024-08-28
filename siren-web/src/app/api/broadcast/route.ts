import { NextRequest, NextResponse } from "next/server";
import { Client } from "@bnb-chain/greenfield-js-sdk";

export async function POST(req: NextRequest) {
  try {
    const { txData, operationType, operationData } = await req.json();

    const client = Client.create(
      "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
      "5600"
    );

    let tx;

    switch (operationType) {
      case "createBucket":
        tx = await client.bucket.createBucket(operationData);
        break;
      case "createObject":
        tx = await client.object.createObject(operationData);
        break;
      // Add other operation types as needed
      default:
        return new NextResponse("Unsupported operation type", { status: 400 });
    }

    // Simulate the transaction
    const simulateInfo = await tx.simulate({ denom: "BNB" });

    // Broadcast the transaction
    const response: any = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: process.env.ADMIN_ACCOUNT_ADDRESS as string,
      granter: "",
      privateKey: process.env.ACCOUNT_PRIVATEKEY!,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to broadcast transaction:", error);
    return new NextResponse("Failed to broadcast transaction", { status: 500 });
  }
}

export async function GET() {
  return new NextResponse("This endpoint only accepts POST requests", {
    status: 405,
  });
}

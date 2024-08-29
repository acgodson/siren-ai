import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, createWalletClient } from "viem";
import { bscTestnet } from "viem/chains";
import RewardsManagerABI from "@/evm/RewardsManagerABI.json";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(request: NextRequest) {
  try {
    const { method, args } = await request.json();

    const publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: bscTestnet,
      transport: http(),
    });

    const account = privateKeyToAccount(
      `0x${process.env.ADMIN_ACCOUNT_PRIVATEKEY}` as `0x${string}`
    );

    const { request: contractRequest } = await publicClient.simulateContract({
      address: process.env.CONTRACT as `0x${string}`,
      abi: RewardsManagerABI,
      functionName: method,
      args: args,
      account,
    });
    const txn = await walletClient.writeContract(contractRequest);

    // Here we would typically send the transaction
    // For this example, we're just returning the request
    return NextResponse.json({ success: true, txn: txn });
  } catch (error) {
    console.error("Error in contract interaction:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

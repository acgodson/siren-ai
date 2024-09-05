import { fetchQueryResponse } from "@/evm/queries";

import { NextRequest, NextResponse } from "next/server";

function generateRandomFourDigitNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export async function POST(request: NextRequest) {
  try {
    const req: any = await request.json();

    const randomNumber = generateRandomFourDigitNumber();

    const context = `Ignore previous messages on highfeast foodfolio. Your're an AI assistant on Siren, an onchain noise mapping platform that saves road traffic noise measurements crowdsourced by citizens on BnB greenfield, and rewards contributors with points on chain. At the end of a weekly campaign period, these points can be converted into shares to claim SRN tokens. A contributors is assigned points when his or her distance travelled is verified using zk-proof to check that the distance is at least 1km. We calculate the differences between the starting coordinates and the ending coordinates tracked by the mobile GPS. ${req.context}`;

    const result: any = await fetchQueryResponse(
      req.prompt,
      process.env.OPENAI_API_KEY as string,
      randomNumber,
      req.prompt.length > 5 ? context : ""
    );

    const responseBody = `re: ${result.text}\n`;
    console.log(responseBody);

    return NextResponse.json(result.text, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error", e },
      { status: 500 }
    );
  }
}

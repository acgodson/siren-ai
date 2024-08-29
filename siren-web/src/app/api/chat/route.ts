import { fetchQueryResponse } from "@/evm/queries";

import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

function generateRandomFourDigitNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export async function POST(request: NextRequest) {
  try {
    const req: any = await request.json();

    const randomNumber = generateRandomFourDigitNumber();

    const result: any = await fetchQueryResponse(
      req.prompt,
      process.env.OPENAI_API_KEY as string,
      randomNumber
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

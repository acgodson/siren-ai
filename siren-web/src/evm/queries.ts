
import axios from "axios";
import { keccak256, toHex } from "viem";
import lighthouse from "@lighthouse-web3/sdk";



export async function fetchQueryResponse(
  sms: any,
  apiKey: string,
  nounce: any
) {

  // Generate the idempotency key
  const KeyTx = nounce.toString()

  try {
    //generate new dempotency key with hash of request
    let headersList = {
      "idempotency-key": KeyTx,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      prompt: sms,
      context: "",
    });

    let response = await fetch("https://blueband-db-442d8.web.app/api/query", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function recordChat(
  agentRecord: string,
  smsBody: string,
  smsResponse: string
) {
  try {
    const allKeys = await lighthouse.getAllKeys(
      process.env.LIGHTHOUSE_API_KEY as string
    );
    const filter = allKeys.data.find(
      (x) => x.ipnsId === agentRecord.toString()
    );
    // const filter = allKeys.data[allKeys.data.length - 2];
    const ipnsKey = filter?.ipnsName;
    let history = [];

    const url = `https://gateway.lighthouse.storage/ipns/${agentRecord.toString()}`;
    const response = await axios.get(url);
    const data = await response.data;
    if (data) {
      console.log("Exisitng session retrieved from: ", url);
      history = data.data;
    }

    console.log("ipnsKey", ipnsKey);

    const messages = [
      ...history,
      { human_message: smsBody, ai_message: smsResponse },
    ];

    const response2 = await lighthouse.uploadText(
      JSON.stringify({ data: [...messages] }),
      process.env.LIGHTHOUSE_API_KEY as string
    );

    const pubResponse2 = await lighthouse.publishRecord(
      response2.data.Hash,
      ipnsKey as string,
      process.env.LIGHTHOUSE_API_KEY as string
    );

    return pubResponse2;
  } catch (error: any) {
    console.log(error);
  }
}

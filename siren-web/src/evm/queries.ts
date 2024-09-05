export async function fetchQueryResponse(
  sms: any,
  apiKey: string,
  nounce: any,
  context: string
) {
  // Generate the idempotency key
  const KeyTx = nounce.toString();

  try {
    //generate new dempotency key with hash of request
    let headersList = {
      "idempotency-key": KeyTx,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      prompt: sms,
      context: context,
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

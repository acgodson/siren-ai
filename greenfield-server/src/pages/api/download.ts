import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@bnb-chain/greenfield-js-sdk";

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
  "5600"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { bucketName, objectName } = req.query;

    if (
      !bucketName ||
      !objectName ||
      Array.isArray(bucketName) ||
      Array.isArray(objectName)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid bucketName or objectName" });
    }

    console.log(`Attempting to download: ${bucketName}/${objectName}`);

    const objectData = await client.object.getObject(
      {
        bucketName: bucketName,
        objectName: objectName,
      },
      {
        type: "ECDSA",
        privateKey: `0x${process.env.ADMIN_ACCOUNT_PRIVATEKEY!}`,
      }
    );

    if (!objectData.body) {
      return res.status(404).json({ error: "Object not found or empty" });
    }

    // Assuming objectData.body is a Blob
    const arrayBuffer = await objectData.body.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const jsonContent = JSON.parse(buffer.toString());
      res.status(200).json(jsonContent);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      res.status(422).json({ error: "Retrieved content is not valid JSON" });
    }

    // Set appropriate headers
    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename="${objectName}"`
    // );
    // res.setHeader(
    //   "Content-Type",
    //   objectData.body.type || "application/octet-stream"
    // );
    // res.setHeader("Content-Length", buffer.length);
    // Send the file
    // res.send(buffer);
  } catch (error: any) {
    console.error("Failed to retrieve  object:", error);

    let errorMessage = "Failed to retrieve  object";
    let statusCode = 500;

    if (error.message && error.message.includes("not found")) {
      errorMessage = "Object not found";
      statusCode = 404;
    } else if (error.message && error.message.includes("permission denied")) {
      errorMessage = "Permission denied";
      statusCode = 403;
    }

    res
      .status(statusCode)
      .json({ error: errorMessage, details: error.message });
  }
}

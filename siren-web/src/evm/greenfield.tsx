import {
  Client,
  VisibilityType,
  RedundancyType,
  ISp,
  TxResponse,
  Long,
  bytesFromBase64,
} from "@bnb-chain/greenfield-js-sdk";
import { ReedSolomon } from "@bnb-chain/reed-solomon";
import { bscGreenfield } from "viem/chains";
import axios from "axios";

type Provider = any;

interface StorageProvider {
  operatorAddress: string;
  endpoint: string;
}

interface GreenFieldOptions {
  useBackendBroadcast?: boolean;
  backendUrl?: string;
}

interface FileData {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}

type OffChainAuthData =
  | {
      seedString: string;
    }
  | any;

class Greenfield {
  private client: Client;
  private provider: Provider;
  private rs: ReedSolomon;
  private sp?: StorageProvider;
  private offChainData?: OffChainAuthData;
  private useBackendBroadcast: boolean;
  private backendUrl: string;

  constructor(provider: Provider, options: GreenFieldOptions = {}) {
    this.client = Client.create(
      "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
      "5600"
    );
    this.provider = provider;
    this.rs = new ReedSolomon();
    this.useBackendBroadcast = options.useBackendBroadcast || false;
    this.backendUrl = options.backendUrl || "/api/broadcast";
  }

  async initialize(): Promise<void> {
    const spList = await this.client.sp.getStorageProviders();
    this.sp = {
      operatorAddress: spList[0].operatorAddress,
      endpoint: spList[0].endpoint,
    };
  }

  private jsonToFileData(json: object, filename: string): FileData {
    const jsonString = JSON.stringify(json);
    const buffer = Buffer.from(jsonString, "utf-8");

    return {
      name: filename,
      type: "application/json",
      size: buffer.length,
      buffer: buffer,
    };
  }

  async authenticate(address: string): Promise<any> {
    if (!this.sp) {
      throw new Error(
        "Storage provider not initialized. Call initialize() first."
      );
    }

    const offchainAuthRes =
      await this.client.offchainauth.genOffChainAuthKeyPairAndUpload(
        {
          sps: [
            {
              address: this.sp.operatorAddress as any,
              endpoint: this.sp.endpoint,
            } as ISp,
          ],
          chainId: bscGreenfield.id,
          expirationMs: 5 * 24 * 60 * 60 * 1000,
          domain: window.location.origin,
          address: address,
        },
        this.provider
      );
    this.offChainData = offchainAuthRes as any;
    return offchainAuthRes;
  }

  private async broadcastTx(
    operationType: string,
    operationData: any,
    address: string
  ): Promise<any> {
    const txData = {
      payer: address,
    };

    if (this.useBackendBroadcast) {
      // Send to backend for broadcasting
      const response = await axios.post(this.backendUrl, {
        txData,
        operationType,
        operationData,
      });
      return response.data;
    } else {
      // Broadcast directly from frontend
      let tx;
      switch (operationType) {
        case "createBucket":
          tx = await this.client.bucket.createBucket(operationData);
          break;
        case "createObject":
          tx = await this.client.object.createObject({
            ...operationData,
            folder: "",
          });
          break;
        // Add other operation types as needed
        default:
          throw new Error("Unsupported operation type");
      }
      const simulateInfo = await tx.simulate({ denom: "BNB" });
      return await tx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo?.gasLimit),
        gasPrice: simulateInfo?.gasPrice || "5000000000",
        payer: address,
        granter: "",
      });
    }
  }

  async createBucket(
    bucketName: string,
    address: string,
    isPublic: boolean = true
  ): Promise<TxResponse | any> {
    if (!this.sp) {
      throw new Error(
        "Storage provider not initialized. Call initialize() first."
      );
    }

    const visibility = isPublic
      ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
      : VisibilityType.VISIBILITY_TYPE_PRIVATE;

    const operationData = {
      bucketName: bucketName,
      creator: address,
      visibility: visibility,
      chargedReadQuota: "0",
      primarySpAddress: this.sp.operatorAddress,
      paymentAddress: address,
    };
    return this.broadcastTx("createBucket", operationData, address);
  }

  async createAndUploadJsonObject(
    bucketName: string,
    objectName: string,
    jsonData: object,
    address: string,
    isPublic: boolean = true
  ): Promise<any> {
    const fileData = this.jsonToFileData(jsonData, objectName);
    return this.createAndUploadObject(
      bucketName,
      objectName,
      fileData,
      address,
      isPublic
    );
  }

  async createAndUploadObject(
    bucketName: string,
    objectName: string,
    fileData: FileData,
    address: string,
    isPublic: boolean = true
  ): Promise<TxResponse | any> {
    if (!this.offChainData) {
      throw new Error("Not authenticated. Call authenticate() first.");
    }

    const visibility = isPublic
      ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
      : VisibilityType.VISIBILITY_TYPE_PRIVATE;

    // const fileBytes = await file.arrayBuffer();
    const expectCheckSums = this.rs.encode(fileData.buffer);

    const operationData = {
      bucketName: bucketName,
      objectName: objectName,
      creator: address,
      visibility: visibility,
      contentType: fileData.type,
      redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
      payloadSize: Long.fromString(fileData.size.toString()),
      expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
    };

    const res = await this.broadcastTx("createObject", operationData, address);

    if (this.useBackendBroadcast) {
      // If using backend broadcast, send file data to backend for upload
      const uploadResponse = await axios.post(`${this.backendUrl}/upload`, {
        bucketName,
        objectName,
        fileData: fileData.buffer.toString("base64"), // Convert buffer to base64 for transmission
        txnHash: res.transactionHash,
        address,
      });
      return uploadResponse.data;
    } else {
      // If not using backend broadcast, upload directly
      const uploadRes = await this.client.object.uploadObject(
        {
          bucketName: bucketName,
          objectName: objectName,
          body: {
            name: fileData.name,
            type: fileData.type,
            size: fileData.size,
            content: fileData.buffer,
          },
          txnHash: res.transactionHash,
        },
        {
          type: "EDDSA",
          domain: window.location.origin,
          seed: this.offChainData.seedString,
          address,
        }
      );
      return uploadRes;
    }
  }

  async downloadObject(
    bucketName: string,
    objectName: string,
    address: string
  ): Promise<TxResponse | any> {
    if (!this.offChainData) {
      throw new Error("Not authenticated. Call authenticate() first.");
    }

    const res = await this.client.object.downloadFile(
      {
        bucketName: bucketName,
        objectName: objectName,
      },
      {
        type: "EDDSA",
        address,
        domain: window.location.origin,
        seed: this.offChainData.seedString,
      }
    );

    return res;
  }
}

export default Greenfield;

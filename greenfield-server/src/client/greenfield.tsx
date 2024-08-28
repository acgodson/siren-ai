import {
  Client,
  VisibilityType,
  ISp,
  TxResponse,
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
    this.backendUrl = options.backendUrl || "";
  }

  async initialize(): Promise<any> {
    const spList = await this.client.sp.getStorageProviders();
    this.sp = {
      operatorAddress: spList[0].operatorAddress,
      endpoint: spList[0].endpoint,
    };

    return this.sp;
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

  async authenticate(address: string): Promise<OffChainAuthData> {
    if (!this.sp) {
      throw new Error(
        "Storage provider not initialized. Call initialize() first."
      );
    }

    const storageKey = `greenfield_auth_${address}`;
    const storedAuthData = localStorage.getItem(storageKey);

    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData) as OffChainAuthData;
      if (parsedAuthData.expirationTime > Date.now()) {
        this.offChainData = parsedAuthData;
        return parsedAuthData;
      }
      // If expired, remove it and generate a new one
      localStorage.removeItem(storageKey);
    }

    // Generate new off-chain auth data
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

    if (offchainAuthRes.code !== 0 || !offchainAuthRes.body) {
      throw new Error("Failed to generate off-chain auth key pair");
    }

    this.offChainData = offchainAuthRes.body;
    localStorage.setItem(storageKey, JSON.stringify(this.offChainData));
    return this.offChainData;
  }

  private async broadcastTx(
    operationType: string,
    operationData: any,
    address: string
  ): Promise<any> {
    const txData = {
      payer: address,
    };

    let endpoint = "api/broadcast";

    if (this.useBackendBroadcast) {
      console.log(operationData);

      // Send to backend for broadcasting
      const response = await axios.post(`${this.backendUrl}/${endpoint}`, {
        txData,
        operationType,
        operationData,
      });
      return response.data;
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
      // chargedReadQuota: Long.fromString("0"),
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
    console.log(fileData);
    const expectCheckSums = this.rs.encode(fileData.buffer);

    const visibility = isPublic
      ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
      : VisibilityType.VISIBILITY_TYPE_PRIVATE;

    const operationData = {
      bucketName: bucketName,
      objectName: objectName,
      creator: address,
      visibility: visibility,
      // redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
      payloadSize: fileData.size,
      expectChecksums: expectCheckSums,
    };

    console.log("0", operationData);

    //Create Object
    const res = await this.broadcastTx("createObject", operationData, address);
    //Upload Object
    const uploadResponse = await axios.post(`${this.backendUrl}/api/upload`, {
      bucketName,
      objectName,
      fileData: fileData.buffer.toString("base64"),
      txnHash: res.transactionHash, // "0x8e0c814f45b034ee23e87403f94c6ce4451241566e9e397716c6061784078e91",
    });
    return uploadResponse.data;
  }
}

export default Greenfield;

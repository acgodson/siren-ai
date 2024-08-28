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
    tx: any,
    simulateInfo: any,
    address: string
  ): Promise<any> {
    const txData = {
      denom: "BNB",
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || "5000000000",
      payer: address,
      granter: "",
    };

    if (this.useBackendBroadcast) {
      // Send to backend for broadcasting
      const response = await axios.post(this.backendUrl, {
        tx: tx.toString(),
        txData,
      });
      return response.data;
    } else {
      // Broadcast directly from frontend
      return await tx.broadcast(txData);
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

    const createBucketTx = await this.client.bucket.createBucket({
      bucketName: bucketName,
      creator: address,
      visibility: visibility,
      chargedReadQuota: Long.fromString("0"),
      primarySpAddress: this.sp.operatorAddress,
      paymentAddress: address,
    });

    const simulateInfo = await createBucketTx.simulate({ denom: "BNB" });

    return this.broadcastTx(createBucketTx, simulateInfo, address);
  }

  async createAndUploadObject(
    bucketName: string,
    objectName: string,
    file: File,
    address: string,
    isPublic: boolean = true
  ): Promise<TxResponse | any> {
    if (!this.offChainData) {
      throw new Error("Not authenticated. Call authenticate() first.");
    }

    const visibility = isPublic
      ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ
      : VisibilityType.VISIBILITY_TYPE_PRIVATE;

    const fileBytes = await file.arrayBuffer();
    const expectCheckSums = this.rs.encode(new Uint8Array(fileBytes));

    const createObjectTx = await this.client.object.createObject({
      bucketName: bucketName,
      objectName: objectName,
      creator: address,
      visibility: visibility,
      contentType: file.type,
      redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
      payloadSize: Long.fromString(file.size.toString()),
      expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
    });

    const simulateInfo = await createObjectTx.simulate({ denom: "BNB" });

    const res = await this.broadcastTx(createObjectTx, simulateInfo, address);

    const uploadRes = await this.client.object.uploadObject(
      {
        bucketName: bucketName,
        objectName: objectName,
        body: file,
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

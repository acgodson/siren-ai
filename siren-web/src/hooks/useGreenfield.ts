import { useState, useEffect, useCallback } from "react";
import Greenfield from "@/evm/greenfield";
import { useWallets } from "@privy-io/react-auth";

const BUCKET_NAME = "bnb-demo01";

export const useGreenfield = () => {
  const { wallets } = useWallets();
  const address = wallets && wallets.length > 0 ? wallets[0].address : "";
  const [client, setClient] = useState<Greenfield | null>(null);
  const [sProvider, setSProvider] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const init = useCallback(async () => {
    if (wallets.length > 0) {
      const provider = await wallets[0]?.getEthereumProvider();
      const _client = new Greenfield(provider, {
        useBackendBroadcast: true,
        backendUrl: "",
      });
      setClient(_client);
      const sP = await _client.initialize();
      setSProvider(sP);
      setLoading(false);
    }
  }, [wallets]);

  useEffect(() => {
    if (wallets.length > 0 && !client) {
      init();
    }
  }, [client, wallets, init]);

  const createBucket = useCallback(async () => {
    if (!client || !address) return;
    console.log("storage provider found: ", sProvider);
    await client.authenticate(address);
    try {
      const result = await client.createBucket(BUCKET_NAME, address, false);
      console.log(result);
      return result;
    } catch (e) {
      console.log("error creating bucket", e);
      throw e;
    }
  }, [client, address, sProvider]);

  const uploadJsonObject = useCallback(
    async (objectName: string, jsonData: object) => {
      if (!client || !address) return;
      try {
        await client.authenticate(address);
        const result = await client.createAndUploadJsonObject(
          BUCKET_NAME,
          objectName,
          jsonData,
          address
        );
        console.log(result);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [client, address]
  );

  const downloadJsonObject = useCallback(
    async (objectName: string) => {
      if (!address) return;
      try {
        const response = await fetch(
          `/api/download?bucketName=${BUCKET_NAME}&objectName=${objectName}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to download");
        }
        const jsonData = await response.json();
        console.log("Retrieved JSON data:", jsonData);
        return jsonData;
      } catch (error) {
        console.error("Download failed:", error);
        throw error;
      }
    },
    [address]
  );

  return {
    client,
    sProvider,
    loading,
    address,
    createBucket,
    uploadJsonObject,
    downloadJsonObject,
    BUCKET_NAME,
  };
};

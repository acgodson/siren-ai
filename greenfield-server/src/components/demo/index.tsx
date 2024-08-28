
import { useState, useEffect } from "react";
import Greenfield from "@/client/greenfield";


import { useWallets } from "@privy-io/react-auth";

export const Demo = () => {
  const { wallets } = useWallets();
  const address = wallets && wallets.length > 0 ? wallets[0].address : "";
  const [client, setClient] = useState<any | null>(null);
  const [sProvider, setSProvider] = useState<null | any>(null);
  const [info, setInfo] = useState<{
    bucketName: string;
    objectName: string;
    file: File | null;
  }>({
    bucketName: "",
    objectName: "",
    file: null,
  });
  const [loading, setLoading] = useState(true);

  //  File info
  const jsonData = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
  };
  const bucketName = "my-bucket83775";
  const objectName = "your-data.json";

  const init = async () => {
    const provider = await wallets[0]?.getEthereumProvider();
    const _client = new Greenfield(provider, {
      useBackendBroadcast: true,
      backendUrl: "",
    });
    setClient(_client);
    const sP = await _client.initialize();
    setSProvider(sP);
    setLoading(false);
  };

  useEffect(() => {
    if (wallets.length > 0 && !client) {
      init();
    }
  }, [client, wallets]);

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Greenfield JSON Storage Demo</h1>
          <p className="subtitle">
            Create Bucket / Create Object / Upload JSON / Download JSON
          </p>
        </div>
      </section>

      <div className="box">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Bucket</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.bucketName}
                  placeholder="bucket name"
                  onChange={(e) => {
                    setInfo({ ...info, bucketName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="field">
            <button
              className={"button is-primary"}
              onClick={async () => {
                if (!address) return;
                console.log("storage provider found: ", sProvider);
                await client.authenticate(address);
                try {
                  const x = await client.createBucket(
                    bucketName,
                    address,
                    false
                  );
                  console.log(x);
                } catch (e) {
                  console.log("error creating bucket", e);
                }
              }}
            >
              Create Bucket Tx
            </button>
          </div>
        )}
      </div>

      <div className="box">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Object Name</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.objectName}
                  placeholder="object name"
                  onChange={(e) => {
                    setInfo({ ...info, objectName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* upload */}
        <div className="field">
          {/* Create and Upload */}
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;
              try {
                await client.authenticate(address);
                const x = await client.createAndUploadJsonObject(
                  bucketName,
                  objectName,
                  jsonData,
                  address
                );
                console.log(x);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            Upload
          </button>
        </div>

        {/* Download */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;

              try {
                const response = await fetch(
                  `/api/download?bucketName=${bucketName}&objectName=${objectName}`
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || "Failed to download");
                }
                // const blob = await response.blob();
                const jsonData = await response.json();
                console.log("Retrieved JSON data:", jsonData);

                // console.log(blob);
                // const url = window.URL.createObjectURL(blob);
                // const a = document.createElement("a");
                // a.style.display = "none";
                // a.href = url;
                // a.download = objectName;
                // document.body.appendChild(a);
                // a.click();
                // window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error("Download failed:", error);
                // Handle error (e.g., show message to user)
              }
            }}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

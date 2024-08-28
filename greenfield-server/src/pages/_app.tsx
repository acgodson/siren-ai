import "@/styles/globals.css";

import { /*wagmiConfig,*/ privyConfig } from "@/config/config";
import { PrivyProvider } from "@privy-io/react-auth";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PrivyProvider
        appId={"cm09c0kux05vl7269wln6qrff"}
        config={privyConfig as any}
      >
        <Component {...pageProps} />
      </PrivyProvider>
    </>
  );
}

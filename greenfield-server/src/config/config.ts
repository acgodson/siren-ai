import { bscTestnet, bscGreenfield } from "viem/chains";

export const privyConfig = {
  loginMethods: ["google", "email"],
  defaultChain: bscTestnet,
  supportedChains: [bscTestnet, bscGreenfield],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    logo: `https://siren-ai.vercel.app/vercel.png`,
  },
  embeddedWallets: {
    createOnLogin: "all-users",
    noPromptOnSignature: false,
  },
  walletConnectCloudProjectId: "957c795c4c86e7c46609c0cd4064fa00",
};

export const supportedChains = [bscTestnet, bscGreenfield];

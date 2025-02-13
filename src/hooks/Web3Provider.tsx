import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [
      {
        id: 1315,
        name: "Story Aeneid Testnet",
        nativeCurrency: {
          decimals: 18,
          name: "IP",
          symbol: "IP",
        },
        rpcUrls: {
          default: { http: ["https://aeneid.storyrpc.io"] },
        },
      },
    ],
    transports: {
      // RPC URL for each chain
      [1315]: http(`https://aeneid.storyrpc.io`),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env
      .VITE_WALLETCONNECT_PROJECT_ID as string,

    // Required App Info
    appName: "AI Voice Agents",

    // Optional App Info
    appDescription: "Voice Biometrics",
    appUrl: "https://aivoiceagents.netlify.app", // your app's url
    appIcon: "https://aivoiceagents.netlify.app/ava.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

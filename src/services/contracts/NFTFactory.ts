import { useWriteContract } from "wagmi";
import { WriteContractErrorType } from "@wagmi/core";

// Define contract types
interface NFTContractConfig {
  contractAddress: `0x${string}`;
  abi: any; // Replace 'any' with your specific ABI type
}

// Define return types for the hook
interface UseNFTContract {
  deployNft: (
    voiceName: string,
    name: string,
    symbol: string,
    baseUri: string
  ) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  hash: `0x${string}` | undefined;
  error: WriteContractErrorType | null;
}

export const useNFTContract = (config: NFTContractConfig): UseNFTContract => {
  const {
    data: hash,
    writeContract,
    isPending,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const deployNft = async (
    voiceName: string,
    name: string,
    symbol: string,
    baseUri: string
  ) => {
    const tx = await writeContract({
      address: config.contractAddress,
      abi: config.abi,
      functionName: "deployAIVoiceNFT",
      args: [voiceName, name, symbol, baseUri],
    });
    return tx;
  };

  return {
    deployNft,
    isPending,
    isSuccess,
    isError,
    error,
    hash,
  };
};

// Example usage in a component:
/*
const YourComponent = () => {
  const { mint, isLoading, isSuccess, isError, error } = useNFTContract({
    contractAddress: '0x...',
    abi: [...],
  });

  const handleMint = async () => {
    if (mint) {
      try {
        await mint();
      } catch (error) {
        console.error('Error minting:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleMint}
      disabled={isLoading}
    >
      {isLoading ? 'Minting...' : 'Mint NFT'}
    </button>
  );
};
*/

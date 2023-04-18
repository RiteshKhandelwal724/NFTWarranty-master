import { useEffect } from "react";
import { ethers } from "ethers";
import Warranty from "../abis/Warranty.json";
import { privateKeyState, warrantyContractState } from "../store";
import { useAtom } from "jotai";
// import { useAccount } from "wagmi";

const ConnectBlockChain = () => {
  // const { isConnected } = useAccount();
  const [warrantyContract, setWarrantyContract] = useAtom(
    warrantyContractState
  );
  const [privateKey] = useAtom(privateKeyState);
  const loadBlockChainData = async () => {
    // if (typeof window.ethereum !== "undefined") {
    //connecting to metamask
    // const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    // let accounts = [];
    // if (isConnected) {
    //   accounts = await ethProvider.send("eth_requestAccounts", []);
    // }
    // const signer = ethProvider.getSigner();
    const provider = new ethers.providers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/635b9815bd784fcc9819d8b992250dce"
    );
    const signerNew = new ethers.Wallet(
      // "c23ff0a8d5f90d1b055dddc8e38bc8a59a289777d01d55677245b0cff9b76147",
      "cf89a65abbe4cd80548d019aecb2927dacb52c04988905fd8e75dc8f982b391c",
      provider
    );
    const warrantyCon = new ethers.Contract(
      "0x86B4352328FBB6F0b13C90A1ef61F5138369Cb11",
      // "0xE48C1327CBf10747D3f13120C39349C8419ed268",
      Warranty.abi,
      // accounts.length > 0 ? signer : signerNew
      signerNew
    );
    setWarrantyContract(warrantyCon);
  };
  useEffect(() => {
    loadBlockChainData();
  }, []);
  return null;
};

export default ConnectBlockChain;

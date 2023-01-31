import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useProgram } from "@thirdweb-dev/react/solana";
import LoadSpinner from "./../components/LoadSpinner";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import Alert from "../components/Alert";

let moment = require("moment-timezone");

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Home: NextPage = () => {
  //!DEVNET NFT DROPS (Collection) WITH CLAIMABLE NFTS
  //5mins:
  //7cYJu2he3nfDEgUqhBgWznfMeTjy7iP8a7AwDUkLVSTn
  //10mins:
  //8RxE14F9LuXSmE7Q8yE4vhcbZa4ACKuLGVCNibMyPpLn
  //30mins:
  //HniCpJWgd2dAmDYZz71uHsr74mf2Nv985QsnRvVc4Egt

  //!MAINNET NFT DROPS (Collection) WITH CLAIMABLE NFTS
  //5mins:
  //FtymXnSnqEqDkkbjs6r2phAxJDmxqDrAoestVbpySLbi
  //10mins:
  //3Bm3Wdd1QgcrSCCpfeTE5kK14ajR48TNzfjZweTQiD8W
  //30mins:
  //BWWD4MFNthXmDhdDrbKpuA8RLsxm26eP2w4fdyUJb2pL

  // would just need to update these 3 vars to use new contracts
  // also update the network in _app.tsx accordingly
  const FIVE_MINS_CONTRACT_DEVNET =
    "FtymXnSnqEqDkkbjs6r2phAxJDmxqDrAoestVbpySLbi";
  const TEN_MINS_CONTRACT_DEVNET =
    "3Bm3Wdd1QgcrSCCpfeTE5kK14ajR48TNzfjZweTQiD8W";
  const THRITY_MINS_CONTRACT_DEVNET =
    "BWWD4MFNthXmDhdDrbKpuA8RLsxm26eP2w4fdyUJb2pL";

  const [contractAddressFive, setContractAddressFive] = useState(
    FIVE_MINS_CONTRACT_DEVNET
  );

  const [contractAddressTen, setContractAddressTen] = useState(
    TEN_MINS_CONTRACT_DEVNET
  );
  const [contractAddressThrity, setContractAddressThirty] = useState(
    THRITY_MINS_CONTRACT_DEVNET
  );

  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const [mintedNft, setMintedNft] = useState({});
  const wallet = useWallet().publicKey;
  const isConnected = !!wallet;

  const { program: programFive, isLoading: isLoadingFive } = useProgram(
    contractAddressFive,
    "nft-drop"
  );
  const { program: programTen, isLoading: isLoadingTen } = useProgram(
    contractAddressTen,
    "nft-drop"
  );
  const { program: programThrity, isLoading: isLoadingThrity } = useProgram(
    contractAddressThrity,
    "nft-drop"
  );

  const mint5MinAccess = () => {
    try {
      mintNft(programFive, isLoadingFive);
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint10MinAccess = () => {
    try {
      mintNft(programTen, isLoadingTen);
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint30MinAccess = () => {
    try {
      mintNft(programThrity, isLoadingThrity);
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mintNft = async (program: any, isLoading: boolean) => {
    try {
      if (isLoading) return;
      setIsMinting(true);

      const mint = await program.claim(1);
      setMessage(
        `Please visit app.darkblock.io to consume your unlockables. ${mint[0]}`
      );
      setStatus("success");
      setIsMinting(false);
      const nft = await program.get(mint[0]);
      if (nft && nft.metadata && nft.metadata.id) setMintedNft(nft);
    } catch (err: any) {
      console.error(err);
      setMessage("Error minting NFT! : " + err?.message.substring(0, 200));
      setStatus("error");
      setIsMinting(false);
    }
  };

  const CROSS_MINT_CLIENT_ID = "33ddd25f-7b60-4bf5-8eb9-dc0af2404e58";

  // mainnet
  const CROSS_MINT_5MIN_CLIENT_ID = "486a32c2-13f6-4c62-8f19-610993453add";
  const CROSS_MINT_10MIN_CLIENT_ID = "76162ae0-a2d2-4f7a-9746-5d69560039d7";
  const CROSS_MINT_30MIN_CLIENT_ID = "7f8dd232-3f2f-4d7a-a8de-ffdebf16eb83";

  // dev
  // ** you'd need to deploy contract with nfts on dev-net
  // ** create collection for it on staging.crossmint.io
  // ** use the client-id here
  // ** change the environment for CrossmintPayButton to staging
  // ** can use the 4242 4242 4242 4242 card for dummy payments
  // const CROSS_MINT_STAGING_CLIENT_ID = "33ddd25f-7b60-4bf5-8eb9-dc0af2404e58";

  return (
    <>
      <nav className="flex-shrink-0 bg-black">
        {status && message && <Alert type={status} message={message} />}

        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center px-2 lg:px-0 xl:w-64">
              <div className="flex-shrink-0 ml-8">
                <img
                  className="h-8 w-auto"
                  src="https://app.darkblock.io/images/footericon.svg"
                  alt="Darkblock"
                />
              </div>
              <div className="right-0 absolute">
                <WalletMultiButtonDynamic className="bg-purple-500 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="w-full mx-auto my-12 flex flex-wrap overflow-hidden grid-cols-4 justify-center items-center h-48">
          <div className="w-full h-48 md:w-1/4 px-2 rounded">
            <img
              className="mx-auto h-48 object-contain"
              src="/DARKBLOCKSTER.svg"
              alt="Darkblockster"
            />
          </div>

          <div className="w-full md:w-3/4 px-2 py-4 rounded align-middle">
            <h2 className="text-xl lg:text-3xl mb-4 text-right font-serif text-purple-500">
              Welcome to Darkblockster.  Content is King.
            </h2>
            <p className="text-xl lg:ml-8 lg:text-xl text-right">
              Keep your premium collection exclusive and reward owners to grow its value. Offer limited-time access to content to increase audience engagement and exposure. By balancing exclusivity and accessibility, you can maximize the value of your premium content.
            </p>
          </div>
        </div>
        <div className="w-full mx-auto mb-12 flex flex-wrap overflow-hidden grid-cols-4">
          <div className="w-full md:w-1/4 mb-8 px-2 rounded">
            <img
              className="mx-auto h-48 img-responsive"
              src="/BUDDY.png"
              alt="BUDDY NFT"
            />
            <div>
              <button
                className="bg-gray-500 w-2/3 mx-auto rounded mt-2 px-2 py-2"
                
              >
                100,000 SOL
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8 px-2 rounded">
            <img
              className="mx-auto h-48 img-responsive"
              src="/5min.jpg"
              alt="5 Minute Access"
            />
            <div>
              <button
                className="bg-purple-500 w-2/3 mx-auto rounded mt-2 px-2 py-2"
                onClick={mint5MinAccess}
              >
                Mint NFT 5
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8 px-2 rounded">
            <img
              className="h-48 mx-auto img-responsive"
              src="/10min.jpg"
              alt="10 Minute Access"
            />
            <div>
              <button
                className="bg-purple-500 w-2/3 mx-auto rounded mt-2 px-2 py-2"
                onClick={mint10MinAccess}
              >
                Mint NFT 10
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8 px-2 rounded">
            <img
              className="mx-auto h-48 img-responsive"
              src="/30min.jpg"
              alt="30 Minute Access"
            />
            <div>
              <button
                className="bg-purple-500 w-2/3 mx-auto rounded mt-2 px-2 py-2"
                onClick={mint30MinAccess}
              >
                Mint NFT 30
              </button>
            </div>
          </div>
        </div>
        {isMinting === true && <LoadSpinner />}
        {isConnected && mintedNft && (
          <div
            style={{
              padding: "1.5rem",
              fontSize: "1rem",
              width: "100%",
              display: "inline-block",
              textAlign: "left",
              wordWrap: "normal",
            }}
          >
            <div>
              <label
                className="bg-gray-900 text-gray-400 text-left"
                placeholder="Minted"
              >
                Minted-NFt : {JSON.stringify(mintedNft)}
              </label>
            </div>
          </div>
        )}{" "}
      </div>
    </>
  );
};

export default Home;

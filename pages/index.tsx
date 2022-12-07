import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useProgram } from "@thirdweb-dev/react/solana";
import LoadSpinner from "./../components/LoadSpinner";
let moment = require('moment-timezone');

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Home: NextPage = () => {
  // Here's how to get the thirdweb SDK instance const sdk = useSDK(); Here's how
  // to get a nft collection

  const [contractAddress, setContractAddress] = useState(
    "BVXDJVY9HbQRgCSggZdLM2TG9DFVjMjSASoSZrrXgWBi" // update this if wanna change collection
  );
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState({});
  const wallet = useWallet().publicKey;
  const isConnected = !!wallet;
  const { program, isLoading } = useProgram(contractAddress, "nft-collection");

  const mint5MinAccess = () => {
    try {
      mintNft(
        "Buddy 5 Minutes Access",
        "This NFT grants the owner 5 minutes of access to unlockable content associated with the BUDDY NFT  After 5 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/3caPXeJc_68rFkVu487RU-_0Vh1YiCEi0_00o3O-kZc",
        "5minutes"
      );
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint10MinAccess = () => {
    try {
      mintNft(
        "Buddy 10 Minutes Access",
        "This NFT grants the owner 10 minutes of access to unlockable content associated with the BUDDY NFT  After 10 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/Mslj9-Lvi0QKDbnRrBzghDnBgpik0PD012_wM23xYdo",
        "10minutes"
      );
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mint30MinAccess = () => {
    try {
      mintNft(
        "Buddy 30 Minutes Access",
        "This NFT grants the owner 30 minutes of access to unlockable content associated with the BUDDY NFT  After 30 minutes, access will be expired but this NFT will stay in your wallet as a receipt.",
        "https://arweave.net/AZHYy3xjZYvLWYEPJxZi_36G1lX9b-rOf3KDAAQOJ14",
        "30minutes"
      );
    } catch (e: any) {
      console.log(e.message);
      alert("Failed To Mint NFT: " + e.message);
    }
  };

  const mintNft = async (
    name: string,
    description: string,
    fileUrl: string,
    duration: string
  ) => {
    try {
      if (isLoading) return;
      setIsMinting(true);

      const durationMinutes = [
        { key: "5minutes", seconds: 5},
        { key: "10minutes", seconds: 10},
        { key: "30minutes", seconds: 30},
      ];

      const expireTime = durationMinutes.find(timeframe => timeframe.key === duration);
      const expireDate = moment.tz( new Date(), "America/New_York").add(expireTime?.seconds, 'minutes').format('MM/DD/YYYY HH:mma z');
      const expireMsg = `Access to the unlockables expires at ${expireDate}.`;

      description = `${description} ${expireMsg}`;

      const mint = await program.mint({
        name,
        description,
        image: fileUrl,
        properties: [
          {
            trait_type: "content-nft",
            value: "FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ:Solana",
          },
          {
            trait_type: "monetization-type",
            value: `rental:${duration}`,
          },
          {
            trait_type: "creation-date",
            value: `${Math.round(Date.now() / 1000)}`,
          },
        ],
      });

      alert(
        `SUCCESS.  Please visit app.darkblock.io to consume your unlockables. ${mint}`
      );
      setIsMinting(false);
      const nft = await program.get(mint);
      if (nft && nft.metadata && nft.metadata.id) setMintedNft(nft);
    } catch (err: any) {
      console.error(err);
      alert("Error minting NFT! : " + err?.message);
      setIsMinting(false);
    }
  };

  return (
    <>
      <nav className="flex-shrink-0 bg-black">
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
        <div className="w-full mx-auto my-12 flex flex-wrap overflow-hidden grid-cols-3 justify-center items-center">
          <div className="w-full md:w-1/3 px-2 rounded">
            <Image
              className="mx-auto mt-0 mb-8 md:mt-8 md:mb-0"
              src="/DARKBLOCKSTER.svg"
              alt="Darkblockster"
              width={400}
              height={300}
              layout="responsive"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 rounded">
            <a
              className="cursor-pointer"
              href="https://app.darkblock.io/platform/sol/nft/FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ"
            >
              <Image
                className="mx-auto img-responsive"
                src="/BUDDY.png"
                alt="BUDDY NFT"
                width={680}
                height={400}
                layout="responsive"
              />
            </a>
          </div>
          <div className="w-full md:w-1/3 px-2 py-4 rounded align-middle">
            <h2 className="text-2xl lg:text-3xl underline mb-4 text-right font-serif text-purple-500">Special Promotion</h2>
            <p className="text-xl lg:text-2xl text-right">Rent access to exclusive BUDDY content.  Enjoy a short film, metaverse 3D model, comic book and concept art.</p>
          </div>          
        </div>
        <div className="w-full mx-auto mb-12 flex flex-wrap overflow-hidden grid-cols-3">
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/5min.jpg"
              alt="5 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint5MinAccess}
              >
                Mint Access NFT 5
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/10min.jpg"
              alt="10 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint10MinAccess}
              >
                Mint Access NFT 10
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-8 px-2 rounded">
            <Image
              className="mx-auto img-responsive"
              src="/30min.jpg"
              alt="30 Minute Access"
              width={680}
              height={400}
              layout="responsive"
            />
            <div>
              <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mint30MinAccess}
              >
                Mint Access NFT 30
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
              <label className="bg-gray-900 text-gray-400 text-left" placeholder="Minted">
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

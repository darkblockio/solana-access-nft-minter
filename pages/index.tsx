import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useProgram } from "@thirdweb-dev/react/solana";
import LoadSpinner from "./../components/LoadSpinner";

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
        <div className="w-full mx-auto my-12 flex flex-wrap overflow-hidden grid-cols-3">
          <div className="w-full md:w-1/3 px-2 rounded">
            <Image
              className="mx-auto mt-8 img-responsive"
              src="/DARKBLOCKSTER.svg"
              alt="Darkblockster"
              width={680}
              height={400}
              layout="responsive"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 rounded">
            <p className="text-right ml-5 py-4 text-baseline md:text-lg lg:text-xl">
              <a
                className="cursor-pointer underline"
                href="https://app.darkblock.io/platform/sol/nft/FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ"
              >
                This is BUDDY. He&apos;s my NFT.
              </a>
            </p>
            <p className="text-right ml-5 py-4 text-baseline md:text-lg lg:text-xl">
              He&apos;s really expensive. BUT ... you can rent access to his
              unlockables which include a short movie, metaverse ready 3D model,
              comic book and exclusive concept art. With Darkblock protocol,
              I&apos;m able to generate revenue from renting access to
              BUDDY&apos;s content. The NFT owner, creator and marketplace will
              all receive revenue from this rental.
            </p>
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
              textAlign: "center",
              wordWrap: "normal",
            }}
          >
            <div>
              <label placeholder="Minted">
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

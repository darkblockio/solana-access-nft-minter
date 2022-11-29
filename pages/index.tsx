import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  // Here's how to get the thirdweb SDK instance
  // const sdk = useSDK();
  // Here's how to get a nft collection

  const [contractAddress, setContractAddress] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File>();
  const [contentNft, setContentNft] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const [mintedNft, setMintedNft] = useState({});

  const wallet = useWallet().publicKey;
  const isConnected = !!wallet;

  const { program, isLoading } = useProgram(contractAddress, "nft-collection");

  const mintNft = async () => {
    try {
      if (isLoading) return;
      var rentalDurations = document.getElementById("rental-durations");
      const duration =
        rentalDurations?.options[rentalDurations.selectedIndex].text;

      if (!contentNft) throw Error("content-nft missing");
      if (!file) throw Error("file missing");

      setIsMinting(true);
      const mint = await program.mint({
        name,
        description,
        image: file,
        properties: [
          {
            trait_type: "content-nft",
            value: contentNft,
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

      alert(`NFT minted successfully - ${mint}`);
      setIsMinting(false);
      const nft = await program.get(mint);
      if (nft && nft.metadata && nft.metadata.id) setMintedNft(nft);
    } catch (err) {
      console.error(err);
      alert("Error minting NFT! : " + err?.message);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Image
            src="/thirdweb.svg"
            height={75}
            width={115}
            style={{
              objectFit: "contain",
            }}
            alt="thirdweb"
          />
          <Image
            width={75}
            height={75}
            src="/sol.png"
            className={styles.icon}
            alt="sol"
          />
        </div>
        <h1 className={styles.h1}>Solana Access NFTs Minter</h1>
        <p className={styles.explain}>
          Explore what you can do with thirdweb&rsquo;s brand new{" "}
          <b>
            <a
              href="https://portal.thirdweb.com/solana"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.lightPurple}
            >
              Solana SDK
            </a>
          </b>
          .
        </p>

        <div
          style={{
            right: 0,
            padding: "0.5rem",
            fontSize: "1rem",
            width: "100%",
          }}
        >
          <WalletMultiButtonDynamic />
        </div>

        {isConnected && (
          <div>
            <div>
              <input
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                type="text"
                onChange={(e) => setContractAddress(e.target.value)}
                value={contractAddress}
                placeholder="Collection"
              />
            </div>
            <div>
              <input
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="NFT-Name"
              />
            </div>
            <div>
              <textarea
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="NFT-Description"
              />
            </div>
            <div>
              <input
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                type="file"
                onChange={(e) => setFile(e.target.files![0])}
              />
            </div>
            <div>
              <textarea
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                onChange={(e) => setContentNft(e.target.value)}
                value={contentNft}
                placeholder="Content-NFT:Platform"
              />
            </div>

            <div>
              <select
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
                id="rental-durations"
              >
                <option>5minutes</option>
                <option>10minutes</option>
                <option>20minutes</option>
                <option>30minutes</option>
                <option>60minutes</option>
              </select>
            </div>

            <div>
              <button
                style={{
                  right: 0,
                  padding: "0.5rem",
                  fontSize: "1rem",
                  width: "100%",
                  backgroundColor: "gold",
                  marginTop: "2rem",
                }}
                onClick={mintNft}
              >
                Mint NFT
              </button>
            </div>
          </div>
        )}

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
        )}
      </div>
    </>
  );
};

export default Home;

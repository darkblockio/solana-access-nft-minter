import {useWallet} from "@solana/wallet-adapter-react";
import type {NextPage}
from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import {useProgram} from "@thirdweb-dev/react/solana";
import LoadSpinner from "./../components/LoadSpinner";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(async() => (await import ("@solana/wallet-adapter-react-ui")).WalletMultiButton, {ssr: false});

const Home : NextPage = () => {
    // Here's how to get the thirdweb SDK instance const sdk = useSDK(); Here's how
    // to get a nft collection

    const [contractAddress,
        setContractAddress] = useState("");
    const [name,
        setName] = useState("");
    const [description,
        setDescription] = useState("");
    const [file,
        setFile] = useState < File > ();
    const [contentNft,
        setContentNft] = useState("");
    const [isMinting,
        setIsMinting] = useState(false);

    const [mintedNft,
        setMintedNft] = useState({});

    const wallet = useWallet().publicKey;
    const isConnected = !!wallet;

    const {program, isLoading} = useProgram(contractAddress, "nft-collection");

    const mintNft = async() => {
        try {
            if (isLoading) 
                return;
            var rentalDurations = document.getElementById("rental-durations")as HTMLSelectElement;
            const duration = rentalDurations
                ?.options[rentalDurations.selectedIndex].text;

            if (!contentNft) 
                throw Error("content-nft missing");
            if (!file) 
                throw Error("file missing");
            if (!duration) 
                throw Error("rental duration missing");
            
            setIsMinting(true);

            const mint = await program.mint({
                name,
                description,
                image: file,
                properties: [
                    {
                        trait_type: "content-nft",
                        value: contentNft
                    }, {
                        trait_type: "monetization-type",
                        value: `rental:${duration}`
                    }, {
                        trait_type: "creation-date",
                        value: `${Math.round(Date.now() / 1000)}`
                    }
                ]
            });

            alert(`NFT minted successfully - ${mint}`);
            setIsMinting(false);
            const nft = await program.get(mint);
            if (nft && nft.metadata && nft.metadata.id) 
                setMintedNft(nft);
            }
        catch (err : any) {
            console.error(err);
            alert("Error minting NFT! : " + err
                ?.message);
        }
    };

    return ( <> <nav className="flex-shrink-0 bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                    <div className="flex-shrink-0 ml-8">
                        <img
                            className="h-8 w-auto"
                            src="https://app.darkblock.io/images/footericon.svg"
                            alt="Darkblock"/>
                    </div>
                    <div className="right-0 absolute">
                        <WalletMultiButtonDynamic className="bg-purple-500 mx-auto"/>
                    </div>
                </div>
            </div>
        </div>
    </nav> < div className = "mx-auto max-w-7xl px-2 sm:px-4 lg:px-8" > <div
        className="w-full mx-auto my-12 flex flex-wrap overflow-hidden grid-cols-3">
        <div className="w-full md:w-1/3 px-2 rounded"><img className="mx-auto mt-8 img-responsive" src="/DARKBLOCKSTER.svg"/></div>
        <div className="w-full md:w-1/3 px-2 rounded">
            <p className="text-right ml-5 py-4 text-baseline md:text-lg lg:text-xl">
                <a
                    className="cursor-pointer underline"
                    href="https://app.darkblock.io/platform/sol/nft/FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ">This is BUDDY. He's my NFT.</a>
            </p>
            <p className="text-right ml-5 py-4 text-baseline md:text-lg lg:text-xl">
                He's really expensive. BUT ... you can rent access to his unlockables which
                include a short movie, metaverse ready 3D model, comic book and exclusive
                concept art. With Darkblock protocol, I'm able to generate revenue from renting
                access to BUDDY's content. The NFT owner, creator and marketplace will all
                receive revenue from this rental.</p>
        </div>
        <div className="w-full md:w-1/3 px-2 rounded">
            <a
                className="cursor-pointer"
                href="https://app.darkblock.io/platform/sol/nft/FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ"><img className="mx-auto img-responsive" src="/BUDDY.png"/></a>
        </div>
    </div> < div className = "w-full mx-auto mb-12 flex flex-wrap overflow-hidden grid-cols-3" > <div className="w-full md:w-1/3 mb-8 px-2 rounded"><img className="mx-auto img-responsive" src="/5min.jpg"/>

        <div>
            <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mintNft}>
                Mint Access NFT 5
            </button>
        </div>
    </div> <div className = "w-full md:w-1/3 mb-8 px-2 rounded" > <img className="mx-auto img-responsive" src="/10min.jpg" /> 
        <div> <button
        className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
        onClick={mintNft}>
        Mint Access NFT 10
    </button> < /div> 
  </div > <div className="w-full md:w-1/3 mb-8 px-2 rounded"><img className="mx-auto img-responsive" src="/30min.jpg"/>
        <div>
            <button
                className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mintNft}>
                Mint Access NFT 30
            </button>
        </div>
    </div> < /div>






          {isConnected && (
            // HERE IS WHERE I BROKE THINGS
          <div>
            <div>
              <input type="hidden"
                onChange={(e) => setContractAddress(e.target.value)}
                value={contractAddress}
                placeholder="BVXDJVY9HbQRgCSggZdLM2TG9DFVjMjSASoSZrrXgWBi"
              / > </div> < div > <input
        type="hidden"
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Buddy 5 Minute Unlockables Access"/> < /div>
            <div>
              <textarea className="hidden"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="This NFT grants the owner 5 minutes of access to unlockable content associated with the BUDDY CONTENT NFT"
              / > </div> < div > <input type="file" onChange={(e) => setFile(e.target.files ![0])}/> < /div>
            <div>
              <textarea className="hidden" onChange={(e) => setContentNft(e.target.value)}
                value={contentNft}
                placeholder="FbNXShA3EPQawwSMLfHGcHvSyNZfti8taCzTxNBtjXDZ:Solana"
              / > </div> < div > <input type="hidden" id="rental-durations" value="5minutes"/> < /div>

            <div>
              <button className="bg-purple-500 w-full rounded mt-2 px-2 py-2"
                onClick={mintNft}
              >
                Mint NFT
              </button > </div> < /div>
        )}

        {isMinting === true && <LoadSpinner / >
}

{
isConnected && mintedNft && (
    <div
        style={{
        padding: "1.5rem",
        fontSize: "1rem",
        width: "100%",
        display: "inline-block",
        textAlign: "center",
        wordWrap: "normal"
    }}>
        <div>
            <label placeholder="Minted">
                Minted-NFt : {JSON.stringify(mintedNft)}
            </label>
        </div>
    </div>
)
} < /div>
    </ >);
};

export default Home;

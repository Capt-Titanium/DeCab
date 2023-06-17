import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [signerAddress, setSignerAddress] = useState("");
  const web3ModalRef = useRef();

  const getProviderorSigner = async (needSigner = false) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);

    if (needSigner) {
      const signer = provider.getSigner();
      setSignerAddress(await signer.getAddress());
      return signer;
    }
    return provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderorSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect your wallet to get started
        </button>
      );
    } else {
      return (
        <div>
          <Link className={styles.button} href="/rides/book">
            Book a Ride
          </Link>
          <Link className={styles.button} href="/rides/publish">
            Publish a Ride
          </Link>
        </div>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "localhost",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>DeCab</title>
        <meta name="desciption" content="DeCab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.main}>
        <header className={styles.header}>
          User Wallet Address: {signerAddress}
        </header>
        <div className={styles.mainContent}>
          <div>
            <Image
              src="/../public/carpool.png"
              width={200}
              height={200}
              className={styles.carpoolImage}
              alt="cab"
            ></Image>
          </div>
          <div>
            <h1 className={styles.title}>
              Welcome to <span className={styles.decab}>DeCab!</span>
            </h1>
          </div>
          <div>
            <h2 className={styles.title}>
              A decentralized peer-to-peer cab sharing application
            </h2>
          </div>
          <div>{renderButton()}</div>
        </div>
      </div>
    </div>
  );
}

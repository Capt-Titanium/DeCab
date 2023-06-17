import { useState, useEffect, useRef } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";
import { newRide } from "../../utils/functions";
import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import styles from "../../styles/Home.module.css";

export default function Publish() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState();
  const [fare, setFare] = useState();
  const [seats, setSeats] = useState();
  const [signerAddress, setSignerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(true);

  const getProviderorSigner = async (signerRequired = false) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    if (signerRequired) {
      const signer = provider.getSigner();
      setSignerAddress(await signer.getAddress());
      return signer;
    }
    return provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderorSigner(false);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const publishRide = async () => {
    try {
      const signer = await getProviderorSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setLoading(true);
      newRide(
        signer,
        contract,
        origin,
        destination,
        departureTime,
        fare,
        seats
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
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

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    } else if (loading) {
      return (
        <div>
          <h1>Loading... please wait</h1>
        </div>
      );
    } else {
      if (signerAddress == "") {
        connectWallet();
      }
      return (
        <div className="container">
          <div className="title">Publish A Ride</div>
          <div className="content">
            <header className="header_rides">
              User Wallet Address: {signerAddress}
            </header>
            <form action="#">
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Origin of ride</span>
                  <input
                    type="text"
                    placeholder="Enter your Origin"
                    required
                    onChange={(e) => {
                      setOrigin(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Destination of ride</span>
                  <input
                    type="text"
                    placeholder="Enter your Destination"
                    required
                    onChange={(e) => {
                      setDestination(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Departure Time</span>
                  <input
                    type="text"
                    placeholder="Enter time in 24hr format without colon"
                    required
                    onChange={(e) => {
                      setDepartureTime(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Seats Available on the ride</span>
                  <input
                    type="number"
                    placeholder="Choose seats available on the ride"
                    required
                    onChange={(e) => {
                      setSeats(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Fare</span>
                  <input
                    type="text"
                    min="0"
                    step="any"
                    placeholder="Enter amount in INR"
                    required
                    onChange={(e) => {
                      setFare(e.target.value || "");
                    }}
                  ></input>
                </div>
              </div>

              <div className="button">
                <input
                  type="submit"
                  value="Publish Ride"
                  onClick={publishRide}
                ></input>
              </div>
            </form>
          </div>
        </div>
      );
    }
  };
  return <div className="main_body">{renderButton()}</div>;
}

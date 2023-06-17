import Link from "next/link";
import { Contract, ethers } from "ethers";
import { searchRide } from "../../utils/functions";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import styles from "../../styles/Home.module.css";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";

export default function Book() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState();
  const [seats, setSeats] = useState();
  const [signerAddress, setSignerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingFare, setBookingFare] = useState();

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

  const bookRide = async () => {
    try {
      const signer = await getProviderorSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setLoading(true);
      const finalRide = await searchRide(
        signer,
        contract,
        origin,
        destination,
        departureTime,
        seats
      );
      setBookingFare(parseInt(finalRide.fare, 16));
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderorSigner(true);
      setWalletConnected(true);
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
          Connect wallet to get started!
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
      if (bookingFare) {
        return (
          <div className={styles.main}>
            <div className="rideBooked">
              Ride has been booked with fare {bookingFare}
            </div>
            <div>
              <Link className={styles.button} href="/">
                Return to Homepage
              </Link>
            </div>
          </div>
        );
      }
      return (
        <div className="container">
          <div className="title">Book A Ride</div>
          <div className="content">
            <header className="header_rides">
              User Wallet Address: {signerAddress}
            </header>
            <form action="#">
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Pickup Location</span>
                  <input
                    type="text"
                    placeholder="Enter Pickup Point"
                    required
                    onChange={(e) => {
                      setOrigin(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Drop Location</span>
                  <input
                    type="text"
                    placeholder="Enter Dropping Point"
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
                    placeholder="Enter time in 24hr format without colons"
                    required
                    onChange={(e) => {
                      setDepartureTime(e.target.value || "");
                    }}
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Seats Required</span>
                  <input
                    type="number"
                    placeholder="Choose number of seats required"
                    required
                    onChange={(e) => {
                      setSeats(e.target.value || "");
                    }}
                  ></input>
                </div>
              </div>
              <div className="button">
                <input type="submit" value="Search and Book on Lowest Fare" onClick={bookRide}></input>
              </div>
            </form>
          </div>
        </div>
      );
    }
  };
  return <div className="main_body">{renderButton()}</div>;
}

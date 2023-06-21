import { useState, useEffect } from "react";
import Wallet from "@arianee/wallet";
import Core from "@arianee/core";
import { magic } from "./libs/magic";
import { web3 } from './libs/web3';
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkisLoggedIn = async () => {
      const boolean = await magic.user.isLoggedIn();
      if (boolean) {
        setIsLoggedIn(boolean);
      }
    };
    checkisLoggedIn();
  }, [isLoggedIn]);

  useEffect(() => {
    (async () => {
      const walletAddress = await web3.eth.getAccounts();

      const core = new Core(
        async (message) => {
          const signature = await web3.eth.sign(message, walletAddress[0]);
          return { message, signature: signature }
        },
        async (data) => {
          const signature = await web3.eth.signTransaction({
            from: walletAddress[0],
            to: data.to.toString(),
            value: data.value.toString(),
            gas: parseInt(data.gasLimit),
            maxFeePerGas: parseInt(data.maxFeePerGas),
            maxPriorityFeePerGas: parseInt(data.maxPriorityFeePerGas),
            chainId: parseInt(data.chainId),
            data: data.data,
          });
          return { message: data, signature: signature.rawTransaction }
        },
        () => {
          return walletAddress[0];
        }
      );
      const arianee = new Wallet({ chainType: 'testnet', auth: { core: core } })
      setWallet(arianee)
    })();
  }, []);

  const handlePrintMetadata = async () => {
    try {
      const metadata = await magic.user.getMetadata();
      console.log("Metadata", metadata);
      console.log("arianeeWallet", wallet)
    } catch (err) {
      console.log("Not Logged In =>", err);
    }
  };

  const handleEmailOTPLogin = async () => {
    try {
      await magic.auth.loginWithEmailOTP({ email });
      setIsLoggedIn(true);
      console.log("Logged In");
    } catch (err) {
      console.log("Login Error =>", err);
    }
  };

  const handleLogoutClick = async () => {
    try {
      const res = await magic.user.logout();
      setIsLoggedIn(!res);
      console.log("Logged Out");
    } catch (err) {
      console.log("Logout Error =>", err);
    }
  };

  const handleClaim = async () => {
    try {
      const res = await wallet.smartAsset.claim('testnet', '74247253', 'ry78jyriuwl7');
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const handleGetOwned = async () => {
    try {
      const res = await wallet.smartAsset.getOwned();
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          disabled={isLoggedIn}
          placeholder="Enter Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        {isLoggedIn ? (
          <button onClick={handleLogoutClick}>Logout</button>
        ) : (
          <button onClick={handleEmailOTPLogin}>Login</button>
        )}
      </div>
      <div>
        <button onClick={handlePrintMetadata}>Print Info</button>
        <button onClick={handleClaim}>smartAsset Claim</button>
        <button onClick={handleGetOwned}>smartAsset GetOwned</button>
      </div>
    </main>
  );
}

export default App;
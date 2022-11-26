import React, { useState } from 'react';
import './App.css';
import {
  ChainId
} from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [socialLogin, setSocialLogin] = useState();
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [userBalance, setUserBalance] = useState({ symbol: "USDC", amount: 0 });
  const [dappBalance, setDappBalance] = useState({ symbol: "USDC", amount: 0 });

  async function login() {
    const socialLogin = new SocialLogin();
      await socialLogin.init(ethers.utils.hexValue(80001), {
        "http://localhost:3000":
          "MEUCIQDCrwqCFSAoivC8NfJdHv9WneLfdMADQCUitF6zs2QCagIgOdh3_6dZ81Le1PFzNfDLSImuugEb46Tz64SjOcQWcZA",
      });

      socialLogin.showConnectModal();
      socialLogin.showWallet();
      setSocialLogin(socialLogin);
  }

  return (
    <div className="App">
      {!isLogin &&
        <button onClick={login}>Login</button>
      }

      {isLogin &&
        <div className='parent-container'>
          <div className='column meta-info-container'>
            <div className='row address-container'>
              Smart Account: {smartAccountAddress}
            </div>
            <div className='row balance-container'>
              <div className='scw-balance'>
                User Balance: {userBalance.amount} {userBalance.symbol}
              </div>
              <div className='dapp-balance'>
                Dapp Balance: {dappBalance.amount} {dappBalance.symbol}
              </div>
            </div>
          </div>
          <div className='row action-container'>
            <div className='column action-container'>
              <h3>Action</h3>
              <div className='column'>
                <div className='gasless-action'>
                  <div className='block-heading'>Gasless Transactions</div>
                  <div>
                    <button className='action-button'>Send Transaction</button>
                  </div>
                </div>
                <div className='user-paid-action'>
                  <div className='block-heading'>User Paid Transactions</div>
                  <div>
                    <button className='action-button'>Estimate Gas</button>
                    <button className='action-button'>Send Transaction</button>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </div>
            <div className='column transaction-container'>
              <h3>Transactions</h3>
              <div className='transactions-body'>

              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;

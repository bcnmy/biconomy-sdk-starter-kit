import React, { useEffect, useState } from 'react';
import './App.css';
import {
  ChainId
} from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
const erc20ABI = require('./abis/erc20.abi.json');
const fundMeABI = require('./abis/fundMe.abi.json');

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string[] | null>(null);
  // const [socialLogin, setSocialLogin] = useState(false);
  const [socialLogin, setSocialLogin] = useState<SocialLogin | null>(
    null,
  );
  // const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [userBalance, setUserBalance] = useState({symbol: "USDT", amount: 0});
  const [dappBalance, setDappBalance] = useState({symbol: "USDT", amount: 0});
  const tokenAddress = "0xeaBc4b91d9375796AA4F69cC764A4aB509080A58";
  const dappContractAddress = "0x682b1f3d1afa69ddfa5ff62c284894a19fd395b4";
  const activeChainId = ChainId.POLYGON_MUMBAI;

  let initWallet = async () => {
    console.log("init wallet");
    const socialLogin = new SocialLogin();
    await socialLogin.init(ethers.utils.hexValue(activeChainId), {
      "http://localhost:3000":
        "MEUCIQDCrwqCFSAoivC8NfJdHv9WneLfdMADQCUitF6zs2QCagIgOdh3_6dZ81Le1PFzNfDLSImuugEb46Tz64SjOcQWcZA",
    });
    socialLogin.showConnectModal();
    setSocialLogin(socialLogin);
    console.log(socialLogin)
    if(socialLogin.provider) {
      setIsLogin(true);
      getTokenBalances();
    }
    return socialLogin;
  }

  useEffect(()=>{
    initWallet();
  },[]);

  useEffect(()=>{
    if(socialLogin) {
      initializeSmartAccount();
      getTokenBalances();
    }
  },[socialLogin]);

  async function initializeSmartAccount() {
    let options = {
      activeNetworkId: activeChainId,
      supportedNetworksIds: [activeChainId],
      // Network Config. 
      // Link Paymaster / DappAPIKey for the chains you'd want to support Gasless transactions on
      networkConfig: [
        {
          chainId: activeChainId,
          dappAPIKey: "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3", // Get one from Paymaster Dashboard
          // customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
        }
      ]
    }

    if(socialLogin?.provider){
      const newProvider = new ethers.providers.Web3Provider(
        socialLogin.provider,
      );
      // let smartAccount = new SmartAccount(newProvider, options);
      // smartAccount = await smartAccount.init();
      // console.log("smartAccount");
      // console.log(smartAccount);
    } else {
      console.log("Social login provider is not defined during initializeSmartAccount");
    }
  }

  async function getTokenBalances() {
    if(socialLogin?.provider) {

      const newProvider = new ethers.providers.Web3Provider(
        socialLogin.provider,
      );
  
      const erc20Contract = new ethers.Contract(tokenAddress, erc20ABI, newProvider);
      const dappContract = new ethers.Contract(dappContractAddress, fundMeABI, newProvider);
  
      let smartAccount;
      // await newProvider.listAccounts().then(async(accounts) => {
      //   console.log(accounts)
      //   smartAccount = accounts;
      //   setSmartAccountAddress(accounts.map(a => a.toLowerCase()))
      // });
  
      // console.log(smartAccount[0]);
  
      console.log("############# SA addresss", smartAccountAddress);
      // const smartContractBalance = await erc20Contract.balanceOf(smartAccountAddress);
      // const smartContractSymbol = await erc20Contract.symbol();
  

      // const dappBalance = await dappContract.balanceOf(smartAccountAddress, tokenAddress);
  
      // console.log("dappBalance.toString()");
      // console.log(dappBalance.toString());
      // setUserBalance({amount: smartContractBalance.toString(), symbol:smartContractSymbol});
      // setDappBalance({amount: dappBalance.toString(), symbol:smartContractSymbol});

    } else {
      console.log("Social login is not defined")
    }
  }

  async function logout() {
    if(socialLogin) {
      await socialLogin.logout();
      socialLogin.hideWallet();
      setIsLogin(false);
      setSocialLogin(null);
    }
  }

  async function sendGaslessTransaction(){
    console.log("yo");
  }

  async function login() {
    try {
      if(socialLogin) {
        socialLogin.showWallet();
      } else {
        let socialLogin = await initWallet();
        socialLogin.showWallet();
        console.log("Social login is not defined");
      }
    } catch (error){
      console.log(error);
    }
  }

  return (
    <div className="App">
      {!isLogin && 
        <button onClick={login}>Login</button>
      }

      { isLogin &&
          <div className='parent-container'>
            <div>
              <button onClick={logout}>Logout</button>
            </div>
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
                      <button className='action-button' onClick={sendGaslessTransaction} >Send Transaction</button>
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

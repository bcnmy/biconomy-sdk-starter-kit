import React, { useEffect, useState } from 'react';
import './App.css';
import {
  ChainId
} from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import erc20ABI from './abis/erc20.abi.json';
import fundMeABI from './abis/fundMe.abi.json';
import SmartAccount from "@biconomy/smart-account";
import { toFixed } from './utils';

type Balance = {
  symbol: string,
  amount: string
}

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();
  const [userBalance, setUserBalance] = useState<Balance>({ symbol: "USDC", amount: "0" });
  const [dappBalance, setDappBalance] = useState<Balance>({ symbol: "USDC", amount: "0" });
  const tokenAddress = "0xdA5289fCAAF71d52a80A254da614a192b693e977";
  const dappContractAddress = "0x682b1f3d1afa69ddfa5ff62c284894a19fd395b4";
  const activeChainId = ChainId.POLYGON_MUMBAI;

  let initWallet = async () => {
    console.log("init wallet");
    const socialLogin = new SocialLogin();
    await socialLogin.init(ethers.utils.hexValue(activeChainId));
    socialLogin.showConnectModal();
    setSocialLogin(socialLogin);
    console.log(socialLogin)
    if (socialLogin.provider) {
      setIsLogin(true);
    }
    return socialLogin;
  }

  useEffect(() => {
    initWallet();
  }, []);

  useEffect(() => {
    const initSmartAccount = async () => {
      if (socialLogin) {
        let smartAccount = await initializeSmartAccount();
        if(smartAccount) {
          setSmartAccount(smartAccount);
        }
      }
    }
    initSmartAccount();
  }, [socialLogin]);

  useEffect(()=>{
    const getSmartAccountAddress = async () => {
      if(smartAccount) {
        let smartAccountState = await smartAccount.getSmartAccountState();
        let scwAddress = smartAccountState.address;
        setSmartAccountAddress(scwAddress);
        getTokenBalances(scwAddress);
      }
    }
    getSmartAccountAddress();
  }, [smartAccount])

  async function initializeSmartAccount() {
    if(socialLogin?.provider) {

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
  
      const newProvider = new ethers.providers.Web3Provider(
        socialLogin.provider,
      );
  
      let smartAccount = new SmartAccount(newProvider, options);
      smartAccount = await smartAccount.init();
      console.log("smartAccount");
      console.log(smartAccount);
      return smartAccount;
    }
    return;
  }

  async function getTokenBalances(smartAccountAddress: string) {
    if (socialLogin?.provider) {
      const newProvider = new ethers.providers.Web3Provider(
        socialLogin.provider,
      );

      const erc20Contract = new ethers.Contract(tokenAddress, erc20ABI, newProvider);
      const dappContract = new ethers.Contract(dappContractAddress, fundMeABI, newProvider);

      const smartContractSymbol = await erc20Contract.symbol();
      const decimal = await erc20Contract.decimals();      
      const rawSCWBalance: ethers.BigNumber = await erc20Contract.balanceOf(smartAccountAddress);      
      const scwBalance = toFixed(rawSCWBalance.toNumber() / Math.pow(10, decimal), 2);      
      const dappRawBalance = await dappContract.balanceOf(smartAccountAddress, tokenAddress);
      const dappBalance = toFixed(dappRawBalance.toNumber() / Math.pow(10, decimal), 2);
      
      if(scwBalance) {
        setUserBalance({ amount: scwBalance.toString(), symbol: smartContractSymbol });
      }
      if(dappBalance) {
        setDappBalance({ amount: dappBalance.toString(), symbol: smartContractSymbol });
      }

    } else {
      console.log("Social login is not defined")
    }
  }

  async function logout() {
    if (socialLogin) {
      await socialLogin.logout();
      socialLogin.hideWallet();
      setIsLogin(false);
      setSocialLogin(null);
    }
  }

  async function sendGaslessTransaction() {
    console.log("yo");
    
  }

  async function login() {
    try {
      if (socialLogin) {
        socialLogin.showWallet();
      } else {
        let socialLogin = await initWallet();
        socialLogin.showWallet();
        console.log("Social login is not defined");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      {!isLogin &&
        <button onClick={login}>Login</button>
      }

      {isLogin &&
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
};

export default App;

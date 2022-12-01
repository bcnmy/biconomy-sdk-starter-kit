import React, { useEffect, useState } from 'react';
import './App.css';
import {
  ChainId
} from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import erc20ABI from './abis/erc20.abi.json';
import fundMeABI from './abis/fundMe.abi.json';
import stateChangeABI from './abis/statechange.abi.json';
import SmartAccount from "@biconomy/smart-account";
import { toFixed } from './utils';
import { activeChainId } from './utils/chainConfig';

type Balance = {
  symbol: string,
  amount: string
}

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();
  const tokenAddress = "0xeaBc4b91d9375796AA4F69cC764A4aB509080A58";
  const dappContractAddress = "0x682b1f3d1afa69ddfa5ff62c284894a19fd395b4";
  const stateChangeContractAddress = "0xCeF6D6781f7db1BCDF18C6123A757a9a6398eA79";
  const amount = "2000000000000000000";

//   const activeChainId = ChainId.POLYGON_MUMBAI;


    async function  initWallet() {
        // init wallet
        const socialLogin = new SocialLogin();
        await socialLogin.init(ethers.utils.hexValue(80001)); // Enter the network id in hex) parameter
        socialLogin.showConnectModal();

        setSocialLogin(socialLogin);
        return socialLogin;
    }

    async function login() {
        try {
            
              let socialLogin = await initWallet();

              if(!socialLogin.provider){
                  socialLogin.showWallet();
              } else {
                setIsLogin(true);
                const provider = new ethers.providers.Web3Provider(
                    socialLogin.provider,
                 );
                const accounts = await provider.listAccounts();
                console.log("EOA address", accounts);


                let options = {
                    activeNetworkId: activeChainId,
                    supportedNetworksIds: [ activeChainId
                    ],
                    networkConfig: [
                             {
                             chainId: ChainId.POLYGON_MUMBAI,
                             // Optional dappAPIKey (only required if you're using Gasless)
                             dappAPIKey: '59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3',
                             // if need to override Rpc you can add providerUrl: 
                           },
                         ]
                   }
                     
                   const walletProvider = new ethers.providers.Web3Provider(socialLogin.provider);

                   let smartAccount = new SmartAccount(walletProvider, options);
                   smartAccount = await smartAccount.init();


                  let smartAccountInfo = await smartAccount.getSmartAccountState();

                  setSmartAccountAddress(smartAccountInfo?.address);


                  smartAccount.on('txHashGenerated', (response: any) => {
                    console.log('txHashGenerated event received via emitter', response);
                    // showSuccessMessage(`Transaction sent: ${response.hash}`);
                  });
            
                  smartAccount.on('txMined', (response: any) => {
                    console.log('txMined event received via emitter', response);
                    // showSuccessMessage(`Transaction mined: ${response.hash}`);
                  });
            
                  smartAccount.on('error', (response: any) => {
                    console.log('error event received via emitter', response);
                  });


                  const erc20Interface = new ethers.utils.Interface(erc20ABI);
                  const dappInterface = new ethers.utils.Interface(fundMeABI);
                  const stateChangeInterface = new ethers.utils.Interface(stateChangeABI);

                  const txs = [];

                  const data1 = erc20Interface.encodeFunctionData(
                      'approve', [dappContractAddress, amount]
                  )

                  const tx1 = {
                    to: tokenAddress ,
                    data: data1
                  }

                  txs.push(tx1);
                  const data2 = dappInterface.encodeFunctionData(
                      'pullTokens', [tokenAddress, amount]
                  )


                  const tx2 = {
                    to: dappContractAddress ,
                    data: data2
                  }

                  txs.push(tx2);

                const data3 = stateChangeInterface.encodeFunctionData(
                'setValue', ["Hey People, its me Divya"]
                )


                const tx3 = {
                to: stateChangeContractAddress ,
                data: data3
                }

                txs.push(tx3);

                const response = await smartAccount.sendGaslessTransactionBatch({ transactions: txs })

                console.log(response);


              }
              console.log("Social login is not defined");

            
          } catch (error) {
            console.log(error);
          }
    }

    async function sendGaslessTransaction() {
    
    }

    async function logout() {
        
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
          </div>
        </div>
      }
    </div>
  );
};

export default App;

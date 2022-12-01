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
import setPurposeAbi from './abis/setPurpose.abi.json';
import SmartAccount from "@biconomy/smart-account";
import { toFixed } from './utils';
import { activeChainId } from './utils/chainConfig';

type Balance = {
  symbol: string,
  amount: string
}

function App() {
  const [isLogin, setIsLogin] = useState(false);
  // const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  // const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  // const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();
  const [eoaAddress, setEoaAddress] = useState<string | null>();
  const [purpose, setPurpose] = useState<string | null>();
  // const [smartAccountBalances, setSmartAccountBalances] = useState<string | null>();
  /*const [balance, setBalance] = useState<Balance>({
    totalBalanceInUsd: 0,
    alltokenBalances: [],
  });*/
  // const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  // const [loading, setLoading] = useState(false);
  const tokenAddress = "0x8ccF516a4f6fEC894f32F486d1426399bfc9B581";
  const dappContractAddress = "0xa3597d4dc48b0B8fCB236Cb22D3a553813021D8A";
  // const stateChangeContractAddress = "0xCeF6D6781f7db1BCDF18C6123A757a9a6398eA79";
  const amount = "1000000000000000000";

  //   const activeChainId = ChainId.POLYGON_MUMBAI;

  // Types
  /*type Balance = {
    totalBalanceInUsd: number;
    alltokenBalances: any[];
  };*/


  async function initWallet() {
    // init wallet
    /*const socialLogin = new SocialLogin();
    await socialLogin.init(ethers.utils.hexValue(80001)); // Enter the network id in hex) parameter
    socialLogin.showConnectModal();
    setSocialLogin(socialLogin);
    return socialLogin;*/
    return { provider: window.ethereum}
  }

  async function login() {
    try {

      let loginContext = await initWallet();

      if (!loginContext.provider) {
        // social login provider
        // loginContext.showWallet();
      } else {
        setIsLogin(true);
        const provider = new ethers.providers.Web3Provider(
          loginContext.provider,
        );
        const accounts = await provider.listAccounts();
        console.log("EOA address", accounts[0]);
        setEoaAddress(accounts[0])


        /*let options = {
          activeNetworkId: activeChainId,
          supportedNetworksIds: [activeChainId
          ],
          networkConfig: [
            {
              chainId: ChainId.POLYGON_MUMBAI,
              // Optional dappAPIKey (only required if you're using Gasless)
              dappAPIKey: '59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3',
              // if need to override Rpc you can add providerUrl: 
            },
          ]
        }*/

        const walletProvider = new ethers.providers.Web3Provider(loginContext.provider);

        // let smartAccount = new SmartAccount(walletProvider, options);
        // smartAccount = await smartAccount.init();


        // let smartAccountInfo = await smartAccount.getSmartAccountState();

        // setSmartAccountAddress(smartAccountInfo?.address);

        /*const balanceParams = {
          chainId: activeChainId,
          eoaAddress: smartAccount.address,
          tokenAddresses: [],
        };
        const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);

        const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
        console.info("getTotalBalanceInUsd", usdBalFromSdk);
        setBalance({
          totalBalanceInUsd: usdBalFromSdk.data.totalBalance,
          alltokenBalances: balFromSdk.data,
        });

        console.log(balance.totalBalanceInUsd)
        console.log(balance.alltokenBalances)

        debugger;

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
        });*/


        const erc20Interface = new ethers.utils.Interface(erc20ABI);
        const dappInterface = new ethers.utils.Interface(setPurposeAbi);
        // const stateChangeInterface = new ethers.utils.Interface(stateChangeABI);

        const txs = [];

        const data1 = erc20Interface.encodeFunctionData(
          'approve', [dappContractAddress, amount]
        )

        const tx1 = {
          to: tokenAddress,
          data: data1,
          from: accounts[0]
        }

        debugger;
        console.log(tx1)

        try{
        let sentTx = await walletProvider.send("eth_sendTransaction", [tx1])
        let receipt = await sentTx.wait(1);
        console.log(receipt)
        } catch (err) {
          console.log("handle errors like signature denied here");
          console.log(err);
        }

        // txs.push(tx1);

        debugger;

        // setPurpose("build simple dapp")
        // console.log(purpose)
        let purpose = "build simple dapp"


        const data2 = dappInterface.encodeFunctionData(
          'setPurpose', [purpose, amount]
        )

        const tx2 = {
          to: dappContractAddress,
          data: data2,
          from: accounts[0]
        }

        // txs.push(tx2);

        try{
          let sentTx = await walletProvider.send("eth_sendTransaction", [tx2])
          let receipt = await sentTx.wait(1);
          console.log(receipt)
          } catch (err) {
            console.log("handle errors like signature denied here");
            console.log(err);
          }

        // const response = await smartAccount.sendGaslessTransactionBatch({ transactions: txs })

        // console.log(response);
      }
      // console.log("Social login is not defined");


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
              Connected Wallet: {eoaAddress}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default App;

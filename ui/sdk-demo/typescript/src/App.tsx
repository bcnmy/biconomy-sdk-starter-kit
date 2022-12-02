import { useState } from 'react';
import './App.css';
import {
  ChainId, FeeQuote, GasLimit
} from "@biconomy/core-types";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import erc20ABI from './abis/erc20.abi.json';
import fundMeABI from './abis/fundMe.abi.json';
import stateChangeABI from './abis/statechange.abi.json';
import SmartAccount from "@biconomy/smart-account";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();
  const tokenAddress = "0xeaBc4b91d9375796AA4F69cC764A4aB509080A58";
  const dappContractAddress = "0x682b1f3d1afa69ddfa5ff62c284894a19fd395b4";
  const stateChangeContractAddress = "0xCeF6D6781f7db1BCDF18C6123A757a9a6398eA79";
  const amount = "2000000000000000000";
  const activeChainId = ChainId.POLYGON_MUMBAI;

    async function login() {
        try {
            
            
          } catch (error) {
            console.log(error);
          }
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

import React, { useEffect, useState } from 'react';
import './App.css';
import { ethers } from "ethers";
import Button from "@material-ui/core/Button";
import erc20ABI from './abis/erc20.abi.json';
import setPurposeAbi from './abis/setPurpose.abi.json';
import { toFixed } from './utils';
import { activeChainId } from './utils/chainConfig';
import { isExpressionWithTypeArguments } from 'typescript';
import { Web3Provider } from '@ethersproject/providers'

function App() {
  const [isLogin, setIsLogin] = useState(false);

  // const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  // const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  // const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();

  const [walletProvider, setWalletProvider] = useState<Web3Provider>();
  const [newQuote, setNewQuote] = useState("");

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
  const amount = "1000000000000000000";

  //const activeChainId = ChainId.POLYGON_MUMBAI;

  // Types
  /*type Balance = {
    totalBalanceInUsd: number;
    alltokenBalances: any[];
  };*/

  const onQuoteChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewQuote(event.target.value);
  };

  async function initWallet() {
    // init wallet
    const provider = window["ethereum"];
    await provider.enable();
    return { provider: provider }
  }

  async function login() {
    try {
    let loginContext = await initWallet();

    if (!loginContext.provider) {
      console.log('provider not found')
    } else {
      setIsLogin(true);
      const provider = new ethers.providers.Web3Provider(
        loginContext.provider,
      );
      const accounts = await provider.listAccounts();
      console.log("EOA address", accounts[0]);
      setEoaAddress(accounts[0])

      let walletProvider = new ethers.providers.Web3Provider(loginContext.provider);
      setWalletProvider(walletProvider)
    }
  } catch (error) {
    console.log(error);
  }
  }

  async function logout() {
  }

  const onApproveTokens = async () => {
    const erc20Interface = new ethers.utils.Interface(erc20ABI);

    // todo
    // const walletProvider = new ethers.providers.Web3Provider(window.ethereum);

    const data1 = erc20Interface.encodeFunctionData(
      'approve', [dappContractAddress, amount]
    )

    const tx1 = {
      to: tokenAddress,
      data: data1,
      from: eoaAddress
    }

    debugger;

    try {
      console.log('debugger ', walletProvider)
      let sentTx = await walletProvider!.send("eth_sendTransaction", [tx1])
      console.log(sentTx)
      // let receipt = await sentTx.wait(1);
      // console.log(receipt)
    } catch (err) {
      console.log("handle errors like signature denied here");
      console.log(err);
    }
  };

  const onSubmitPurpose = async () => {
    if (newQuote != "") {
      const dappInterface = new ethers.utils.Interface(setPurposeAbi);

      // const walletProvider = new ethers.providers.Web3Provider(window.ethereum);

      const data2 = dappInterface.encodeFunctionData(
        'setPurpose', [newQuote, amount]
      )

      const tx2 = {
        to: dappContractAddress,
        data: data2,
        from: eoaAddress
      }

      debugger;

      try {
        let sentTx = await walletProvider!.send("eth_sendTransaction", [tx2])
        console.log(sentTx)
        // let receipt = await sentTx.wait(1);
        // console.log(receipt)
      } catch (err) {
        console.log("handle errors like signature denied here");
        console.log(err);
      }
    }
  };



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

      <section>
        <div className="submit-container">
          <div className="submit-row">
            <Button variant="contained" color="primary" onClick={onApproveTokens}>
              Approve Tokens
            </Button>
            <input
              type="text"
              placeholder="Enter your purpose"
              onChange={onQuoteChange}
              value={newQuote}
            />
            <Button variant="contained" color="primary" onClick={onSubmitPurpose}>
              Set Purpose
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

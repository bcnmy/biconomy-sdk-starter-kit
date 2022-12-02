import React, { useEffect, useState } from 'react';
import './App.css';
import {
  ChainId
} from "@biconomy/core-types";
import { ethers } from "ethers";
import Button from "@material-ui/core/Button";
import SocialLogin from "@biconomy/web3-auth";
import erc20ABI from './abis/erc20.abi.json';
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
  const [socialLogin, setSocialLogin] = useState<SocialLogin | null>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  // let smartAccount: SmartAccount;
  const [newQuote, setNewQuote] = useState("");
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>();
  const [smartAccountBalances, setSmartAccountBalances] = useState<string | null>();
  const [balance, setBalance] = useState<Balance>({
    totalBalanceInUsd: 0,
    alltokenBalances: [],
  });
  // const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  // const [loading, setLoading] = useState(false);
  const tokenAddress = "0x8ccF516a4f6fEC894f32F486d1426399bfc9B581";
  const dappContractAddress = "0xa3597d4dc48b0B8fCB236Cb22D3a553813021D8A";
  const amount = "2000000000000000000";

  //   const activeChainId = ChainId.POLYGON_MUMBAI;

  // Types
  type Balance = {
    totalBalanceInUsd: number;
    alltokenBalances: any[];
  };

  const onQuoteChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewQuote(event.target.value);
  };


  async function initWallet() {
    // init wallet
    const socialLogin = new SocialLogin();
    await socialLogin.init(ethers.utils.hexValue(80001)); // Enter the network id in hex) parameter
    socialLogin.showConnectModal();

    setSocialLogin(socialLogin);
    return socialLogin;
  }

  async function login() {
      // social login here
      let loginContext = await initWallet();

      if (!loginContext.provider) {
        loginContext.showWallet();
      } else {
        setIsLogin(true);
        const provider = new ethers.providers.Web3Provider(
          loginContext.provider,
        );
        const accounts = await provider.listAccounts();
        console.log("EOA address", accounts);


        let options = {
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
        }

        const walletProvider = new ethers.providers.Web3Provider(loginContext.provider);

        let smartAccount = new SmartAccount(walletProvider, options);
        smartAccount = await smartAccount.init();
        setSmartAccount(smartAccount)


        let smartAccountInfo = await smartAccount.getSmartAccountState();

        setSmartAccountAddress(smartAccountInfo?.address);

        const balanceParams = {
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
        });
        //console.log("Social login is not defined");
  }
}

  const onSubmit = async () => {
    if (newQuote != "") {
      const erc20Interface = new ethers.utils.Interface(erc20ABI);
        const dappInterface = new ethers.utils.Interface(setPurposeAbi);

        const txs = [];

        const data1 = erc20Interface.encodeFunctionData(
          'approve', [dappContractAddress, amount]
        )

        const tx1 = {
          to: tokenAddress,
          data: data1
        }

        txs.push(tx1);


        const data2 = dappInterface.encodeFunctionData(
          'setPurpose', [newQuote, amount]
        )


        const tx2 = {
          to: dappContractAddress,
          data: data2
        }

        txs.push(tx2);

        debugger;

        const response = await smartAccount!.sendGaslessTransactionBatch({ transactions: txs })

        console.log(response);
      }
};

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
            <div className='row address-container'>
              Smart Account Balance in USD: {balance.totalBalanceInUsd}
            </div>
          </div>
        </div>
      }

      <section>
        <div className="submit-container">
          <div className="submit-row">
            <input
              type="text"
              placeholder="Enter your quote"
              onChange={onQuoteChange}
              value={newQuote}
            />
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Approve and Set Purpose
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
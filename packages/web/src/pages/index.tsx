import Greeter from '@contracts/artifacts/src/Greeter.sol/Greeter.json';
import { Greeter as GreeterContract } from '@contracts/typechain/Greeter';
import { Account } from '@web/components/account';
import { hasEthereum } from '@web/utils/ethereum';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import tw from 'twin.macro';
import Web3Modal from 'web3modal';

const Layout = tw.main`py-4 px-4`;
const Footer = tw.footer`py-4 px-4`;
const Spacer = tw.div`block h-6`;

const ConnectWalletButton = tw.button`bg-sky-800 text-white px-4 py-2 rounded-sm`;

async function requestAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  return accounts;
}

const providerOptions = {
  /* See Provider Options Section */
};

const Home: NextPage = () => {
  const [web3ModalInstance, setWeb3ModalInstance] = React.useState<Web3Modal>();
  const [connectedWalletAddressState, setConnectedWalletAddressState] = React.useState('');
  const [connectedWalletAddress, setConnectedWalletAddress] = React.useState<string>();

  // If wallet is already connected...
  React.useEffect(() => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);

      return;
    }

    const web3Modal = new Web3Modal({
      providerOptions, // required
    });
    console.log('asdf web3Modal', web3Modal);
    setWeb3ModalInstance(web3Modal);
  }, []);

  React.useEffect(() => {
    async function setConnectedWalletAddressInfo() {
      const instance = await web3ModalInstance?.connect();
      console.log(web3ModalInstance, instance);
      const provider = new ethers.providers.Web3Provider(instance);

      const stuff = await provider.getBlockNumber();
      console.log('asdf', stuff);

      const signer = provider.getSigner();

      try {
        const signerAddress = await signer.getAddress();

        setConnectedWalletAddressState('Wallet connected');
        setConnectedWalletAddress(signerAddress);
      } catch {
        setConnectedWalletAddressState('No wallet connected');

        return;
      }
    }

    if (web3ModalInstance == null) {
      return;
    }

    setConnectedWalletAddressInfo();
  }, [web3ModalInstance]);

  const connectWallet = async () => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);

      return;
    }

    const instance = await web3ModalInstance?.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const signerAddress = await signer.getAddress();

    setConnectedWalletAddressState('Wallet connected');
    setConnectedWalletAddress(signerAddress);
  };

  const greet = async () => {
    const instance = await web3ModalInstance?.connect();
    const provider = new ethers.providers.Web3Provider(instance);

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS as string, Greeter.abi, provider);

    const data = await contract.greet();

    console.log('greet result', data);
  };

  const changeGreeting = async () => {
    const instance = await web3ModalInstance?.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS as string, Greeter.abi, signer) as GreeterContract;

    const greeting = window.prompt('New greeting');

    if (greeting == null) {
      throw new Error('Missing greeting!');
    }

    const transaction = await contract.setGreeting(greeting);

    await transaction.wait();
  };

  return (
    <div>
      <Head>
        <title>Bello</title>
        <meta name="description" content="Bello - Smart Dog Adoption" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <h1>Welcome to Bello!</h1>

        <Spacer />

        <ConnectWalletButton onClick={connectWallet}>Connect Wallet</ConnectWalletButton>

        <button onClick={greet}>Greet</button>
        <button onClick={changeGreeting}>Change greeting</button>

        <Spacer />

        <div tw="h-4">{connectedWalletAddressState && <p tw="text-base">{connectedWalletAddressState}</p>}</div>

        <Account address={connectedWalletAddress} />
      </Layout>

      <Footer></Footer>
    </div>
  );
};

export default Home;

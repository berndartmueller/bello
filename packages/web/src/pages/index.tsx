import { ethers } from 'ethers';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import tw from 'twin.macro';
import { getFormattedETHAccount, hasEthereum, toEther, toWei } from './../utils/ethereum';

const Layout = tw.main`py-4 px-4`;
const Footer = tw.footer`py-4 px-4`;
const Spacer = tw.div`block h-6`;

const ConnectWalletButton = tw.button`bg-sky-800 text-white px-4 py-2 rounded-sm`;

async function requestAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  return accounts;
}

const Home: NextPage = () => {
  const [connectedWalletAddressState, setConnectedWalletAddressState] = React.useState('');
  const [connectedWalletAddress, setConnectedWalletAddress] = React.useState<string>();

  console.log('parse', { eth: toEther('1'), wei: toWei('0.000000000000000001').toString() });

  // If wallet is already connected...
  React.useEffect(() => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);

      return;
    }

    async function setConnectedWalletAddressInfo() {
      const provider = new ethers.providers.Web3Provider(window.ethereum as never); // @todo

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

    setConnectedWalletAddressInfo();
  }, []);

  const connectWallet = async () => {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);

      return;
    }

    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum as never);
    const signer = provider.getSigner();

    const signerAddress = await signer.getAddress();

    setConnectedWalletAddressState('Wallet connected');
    setConnectedWalletAddress(signerAddress);
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

        <Spacer />

        <div tw="h-4">{connectedWalletAddressState && <p tw="text-base">{connectedWalletAddressState}</p>}</div>

        <div tw="h-4">{connectedWalletAddress && <p tw="text-base">{getFormattedETHAccount(connectedWalletAddress)}</p>}</div>
      </Layout>

      <Footer></Footer>
    </div>
  );
};

export default Home;

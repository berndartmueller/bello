import { hasEthereum } from '@web/utils';
import { ethers } from 'ethers';
import React from 'react';
import Web3Modal from 'web3modal';

const providerOptions = {
  /* See Provider Options Section */
};

export const useWeb3 = () => {
  const [web3ModalInstance, setWeb3ModalInstance] = React.useState<Web3Modal>();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider>();

  React.useEffect(() => {
    if (!hasEthereum()) {
      return;
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    });

    setWeb3ModalInstance(web3Modal);
  }, []);

  React.useEffect(() => {
    async function setConnectedWalletAddressInfo() {
      const instance = await web3ModalInstance?.connect();

      const provider = new ethers.providers.Web3Provider(instance);

      setProvider(provider);
    }

    if (web3ModalInstance == null) {
      return;
    }

    setConnectedWalletAddressInfo();
  }, [web3ModalInstance]);

  return {
    provider,
  };
};

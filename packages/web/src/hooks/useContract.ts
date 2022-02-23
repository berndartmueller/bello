import { BaseContract, ethers } from 'ethers';
import React from 'react';
import { useWeb3 } from './useWeb3';

type ABI = any;

export const useContract = <Contract extends BaseContract = BaseContract>(address: string, abi: ABI) => {
  const { provider } = useWeb3();

  return React.useMemo(() => {
    if (!address || !abi || !provider) {
      return;
    }

    const contract = new ethers.Contract(address, abi, provider.getSigner()) as Contract;

    return contract;
  }, [address, abi, provider]);
};

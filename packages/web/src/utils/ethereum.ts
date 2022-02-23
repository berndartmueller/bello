import { ethers } from 'ethers';

// Check for MetaMask wallet browser extension
export function hasEthereum() {
  return typeof window !== 'undefined' && typeof window['ethereum' as never] !== 'undefined';
}

export function toEther(value: string): string {
  return ethers.utils.formatEther(value);
}

export function toWei(value: string) {
  return ethers.utils.parseEther(value);
}

/**
 * Returns a string of form "abc...xyz"
 *
 * @param account ETH Account
 * @param n number of chars to keep at front/end
 * @returns Formatted ETH account string.
 */
export const getFormattedETHAccount = (account: string, n = 5) => {
  if (account == null) {
    return '';
  }

  return `${account.slice(0, n)}...${account.slice(account.length - n)}`;
};

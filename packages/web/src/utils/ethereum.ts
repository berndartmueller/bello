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
 * @param {Object} options Options
 * @param options.pre Number of chars to keep at front
 * @param options.post Number of chars to keep at back
 * @returns Formatted ETH account string.
 */
export const getFormattedETHAccount = (account: string, { pre = 6, post = 4 }: { pre?: number; post?: number } = {}) => {
  if (account == null) {
    return '';
  }

  return `${account.slice(0, pre)}...${account.slice(account.length - post)}`;
};

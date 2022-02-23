import { getFormattedETHAccount } from '@web/utils/ethereum';
import React from 'react';

export const Account = ({ address }: { address?: string }) => {
  if (address == null) {
    return <span>Not connected</span>;
  }

  return (
    <div tw="h-4">
      <p tw="text-base">{getFormattedETHAccount(address)}</p>
    </div>
  );
};

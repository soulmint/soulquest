import React from 'react';
import { Web3Provider } from 'src/libs/web3-context';

import {
  WalletProvider,
  AptosWalletAdapter
  // FewchaWalletAdapter,
  // Coin98WalletAdapter
  // MartianWalletAdapter,
} from '@manahippo/aptos-wallet-adapter';
const wallets = () => [
  new AptosWalletAdapter()
  // new FewchaWalletAdapter(),
  // new Coin98WalletAdapter()
  // new MartianWalletAdapter()
];

const Providers = ({ children }) => {
  return (
    <Web3Provider>
      <WalletProvider
        wallets={wallets()}
        // autoConnect={true}
        onError={(error) => {
          console.error('Aptos Wallet errors: ', error);
        }}
      >
        {children}
      </WalletProvider>
    </Web3Provider>
  );
};

export default Providers;

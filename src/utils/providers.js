import React from 'react';
import { Web3Provider } from 'src/libs/web3-context';

const Providers = ({ children }) => {
  return <Web3Provider>{children}</Web3Provider>;
};

export default Providers;

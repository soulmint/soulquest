import { createContext, useContext, FunctionComponent } from 'react';
import Common from '@ethereumjs/common';
import Web3 from 'web3';

const Web3Context = createContext<Web3Props>({});

export type Web3Props = {
  bscWeb3?: Web3;
  bscCommon?: Common;
};

const Web3Provider: FunctionComponent<Web3Props> = ({ children }) => {
  const bscWeb3 = new Web3(process.env.BSC_URL as string);
  const bscCommon = Common.custom({
    name: 'private',
    networkId: parseInt(process.env.BSC_NETWORK_ID as string, 10),
    chainId: parseInt(process.env.BSC_CHAIN_ID as string, 10),
  });

  return (
    <Web3Context.Provider value={{ bscWeb3, bscCommon }}>
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3Context = () => useContext(Web3Context);

export { Web3Context, Web3Provider, useWeb3Context };

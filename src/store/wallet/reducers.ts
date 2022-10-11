import { WalletAction, WalletActionType, WalletState } from './types';

export const initialState: WalletState = {};

const reducer = (
  state: WalletState = initialState,
  action: WalletAction
): WalletState => {
  if (action.type === WalletActionType.connectWallet) {
    return {
      ...state,
      info: action.payload
    };
  } else {
    return state;
  }
};

export default reducer;

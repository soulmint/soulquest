import {
  WalletsAction,
  WalletsActionType,
  WalletsState
} from './wallets.types';

export const initialState: WalletsState = {};

const reducer = (
  state: WalletsState = initialState,
  action: WalletsAction
): WalletsState => {
  switch (action.type) {
    case WalletsActionType.connectWallet:
      return {
        ...state,
        walletInfo: action.payload
      };

    default:
      return state;
  }
};

export default reducer;

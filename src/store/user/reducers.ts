import { UserAction, UserActionType, UserState } from './types';
import BrowserPersistence from '../../utils/simplePersistence';

const storage = new BrowserPersistence();

const accessToken = storage.getRawItem('access_token');
const currentUserInfo = storage.getRawItem('current_user_info');

const getCurrentUserInfo = () => {
  if (!currentUserInfo) {
    return {};
  }

  const { value } = JSON.parse(currentUserInfo);

  return value;
};

const getToken = () => {
  if (!accessToken) {
    return undefined;
  }
  const { value } = JSON.parse(accessToken);

  return value;
};

export const initialState: UserState = {
  token: getToken(),
  info: getCurrentUserInfo()
};

const reducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActionType.setToken:
      return {
        ...state,
        token: action.payload
      };
    case UserActionType.setInfo:
      return {
        ...state,
        info: action.payload
      };
    case UserActionType.logOut:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default reducer;

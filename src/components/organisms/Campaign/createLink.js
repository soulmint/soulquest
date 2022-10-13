import { useSelector } from 'react-redux';
const CreateLink = (props) => {
  const { children } = props;
  const userState = useSelector((state) => state.user);

  return userState.wallet_address ? null : children;
};

export default CreateLink;

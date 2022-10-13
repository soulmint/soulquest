import React from 'react';
import { useSelector } from 'react-redux';

const CreateLink = (props) => {
  const { children } = props;
  const userState = useSelector((state) => state.user);

  if (userState.id === undefined) {
    return null;
  }

  return children;
};

export default CreateLink;

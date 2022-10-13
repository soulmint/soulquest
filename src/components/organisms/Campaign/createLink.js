import React from 'react';
import { useSelector } from 'react-redux';

const CreateLink = (props) => {
  const { children } = props;

  const userState = useSelector((state) => state.user);

  return userState.id === undefined ? null : children;
};

export default CreateLink;

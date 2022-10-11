import React from 'react';
import { useSession } from 'next-auth/react';

const CreateLink = (props) => {
  const { children } = props;
  const { status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return children;
};

export default CreateLink;

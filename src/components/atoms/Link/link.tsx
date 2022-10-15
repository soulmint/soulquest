import React from 'react';
import LinkNext from 'next/link';
const Link = (props: any) => {
  const data = {
    ...props
  };
  return <LinkNext {...data} />;
};
export default Link;

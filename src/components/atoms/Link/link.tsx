import React from 'react';
const Link = (props: any) => {
  const { href, onClick, children } = props;
  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
};
export default Link;

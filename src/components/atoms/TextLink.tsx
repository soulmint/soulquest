import Link, { LinkProps } from 'next/link';
import React, {
  FunctionComponent,
  Fragment,
  AnchorHTMLAttributes
} from 'react';

export type TextLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const TextLink: FunctionComponent<TextLinkProps> = ({
  children,
  ...textLinkProps
}) => {
  const nextLinkProps = textLinkProps as LinkProps;
  const anchorLinkProps = textLinkProps as Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
  >;

  return (
    <Fragment>
      <Link {...nextLinkProps} passHref>
        <a {...anchorLinkProps}>{children}</a>
      </Link>
    </Fragment>
  );
};

export default TextLink;

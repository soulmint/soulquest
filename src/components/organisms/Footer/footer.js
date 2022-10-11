import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import TextLink from '../../atoms/TextLink';
import { useTranslation } from 'next-i18next';
import classes from './footer.module.css';
import useThemes from 'src/hooks/useThemes';
import { DEFAULT_LINKS, socialData, menuItemsData } from './menuItems';

const Footer = (_props) => {
  const { isDark, rootClassName } = useThemes();
  const { t } = useTranslation('common');
  const date = new Date();
  const year = date.getFullYear();
  function buildLink(data, type, htmlTag) {
    return Array.from(data, ([text, pathInfo]) => {
      let path = pathInfo;
      let Component = Fragment;
      if (pathInfo && typeof pathInfo === 'object') {
        path = pathInfo.path;
        Component = pathInfo.component;
      }

      const itemKey = `text: ${text} path:${path}`;
      const child = path ? (
        <TextLink className={classes.link} href={path}>
          {t(text)}
        </TextLink>
      ) : (
        <span className={classes.label}>{t(text)}</span>
      );
      const elem = htmlTag ? (
        <li className={classes.linkItem}>{child}</li>
      ) : (
        <div className={classes.linkItem}>{child}</div>
      );
      return <Component key={itemKey}>{elem}</Component>;
    });
  }
  const menuItem = buildLink(menuItemsData, 'menu', 'li');
  const socialElements = socialData.map((data, idx) => {
    return (
      <div key={idx} className={classes.linkItem}>
        <TextLink
          className={isDark ? 'dark' : 'light'}
          href={data.link}
          target="_blank"
        >
          <img src={isDark ? data.iconDark : data.icon} alt={data.title} />
          <span className={data.icon ? 'hidden' : ''}>{t(data.title)}</span>
        </TextLink>
      </div>
    );
  });
  const socialItem = <div className={classes.linkGroup}>{socialElements}</div>;
  const menuItems = <ul className={classes.linkGroup}>{menuItem}</ul>;
  return (
    <Fragment>
      <footer
        className={`${classes[rootClassName]} py-4 px-4 lg:px-0 space-x-4 z-10 text-sm font-medium dark:bg-gray-900 border-t border-t-gray-800 dark:border-t-gray-800`}
      >
        <div className="container max-w-screen-xl mx-auto flex flex-wrap flex-col md:flex-row justify-between items-center px-4">
          <div className="block text-sm text-gray-500 w-full md:w-auto text-center md:text-left dark:text-gray-400">
            <span>
              &copy; {year}{' '}
              <a href="/" className="hover:underline hover:text-blue-600">
                SoulMint
              </a>
            </span>
          </div>
          {/* <div className={classes.menuItems}>{menuItems}</div> */}
          <div className={classes.social}>{socialItem}</div>
        </div>
      </footer>
    </Fragment>
  );
};

Footer.defaultProps = {
  links: DEFAULT_LINKS
};

Footer.propTypes = {
  classes: shape({
    root: string
  })
};

export default Footer;

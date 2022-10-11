import React, { Fragment, FunctionComponent /*, useState*/ } from 'react';
import { useTranslation } from 'next-i18next';
import { useStyle } from '../../../classify';
import useThemes from '../../../../hooks/useThemes';
import defaultClasses from './dropDownMenu.module.css';
import { signOut } from 'next-auth/react';
import Link from 'src/components/atoms/Link';
import BrowserPersistence from '../../../../utils/simplePersistence';
interface DropDownMenuProps {
  name?: string;
  classes?: object;
}
const DropDownMenu: FunctionComponent<DropDownMenuProps> = (props) => {
  const { name } = props;
  const classes = useStyle(defaultClasses, props.classes);
  const { t } = useTranslation('common');
  const { isDark } = useThemes();
  const rootClass = isDark ? classes.rootDark : classes.root;
  // const [expanded /*, setExpanded*/] = useState(false);
  // const handleDropDownMenu = () => {
  //   setExpanded(!expanded);
  // };
  const disConnect = async () => {
    const localStorage = new BrowserPersistence();
    localStorage.removeItem('user');
    await signOut();
  };

  return (
    <Fragment>
      <div className={rootClass}>
        {/* <button
          id="dropdownInformationButton"
          onClick={handleDropDownMenu}
          className="text-white bg-violet-600 hover:bg-violet-700 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          Hi: {t(name)}
          <img
            src={expanded ? '/themes/up.svg' : '/themes/right.svg'}
            className={classes.dropdownIcon}
            alt="up"
          />
        </button> */}

        <div
          className={`${classes.userInfo} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-nowrap items-center shadow-none rounded-full py-1 pl-3 pr-1`}
        >
          <span className="mr-2">Hi: {t(name)}</span>
          <Link href="#" onClick={disConnect}>
            {t('Sign out')}
          </Link>
        </div>

        {/* <div
          id="dropdownInformation"
          style={{ display: expanded ? 'block' : 'none' }}
          className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
        > */}
        {/*<ul className="py-1 text-sm text-gray-700 dark:text-gray-200">*/}
        {/*  <li>*/}
        {/*    <Link href="/create-campaign"> {t('Create Campaign')}</Link>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <Link href="/my-campaign"> {t('My Campaigns')}</Link>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <Link href="/user/settings">{t('Settings')}</Link>*/}
        {/*  </li>*/}
        {/*</ul>*/}
        {/* <Link href="#" onClick={disConnect}>
              {t('Sign out')}
            </Link> */}
        {/* </div> */}
      </div>
    </Fragment>
  );
};

export default DropDownMenu;

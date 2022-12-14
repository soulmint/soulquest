import React, { Fragment, FunctionComponent /*, useState*/ } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { useStyle } from '../../../classify';
import useThemes from '../../../../hooks/useThemes';
import defaultClasses from './dropDownMenu.module.css';
import { logOut } from 'src/store/user/operations';
import Link from 'src/components/atoms/Link';
import Avatar from 'boring-avatars';
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
  const dispatch = useDispatch();
  const disConnect = async () => {
    await logOut(dispatch);
  };

  return (
    <Fragment>
      <div className={rootClass}>
        <div className={`${classes.userInfo}`}>
          <span className={`${classes.souldAvatar}`}>
            <Avatar
              size={24}
              name={t(name)}
              variant="beam" //oneOf: marble (default), beam, pixel,sunset, ring, bauhaus
              colors={['#F97316', '#EAB308', '#4ADE80', '#6d28d9', '#475569']}
            />
          </span>
          <span className="mr-2"> {t(name)}</span>
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

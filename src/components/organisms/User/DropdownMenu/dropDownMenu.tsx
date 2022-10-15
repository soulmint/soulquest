import React, { Fragment, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { useStyle } from '../../../classify';
import useThemes from '../../../../hooks/useThemes';
import defaultClasses from './dropDownMenu.module.css';
import { logOut } from 'src/store/user/operations';
import Avatar from 'boring-avatars';
import TextLink from 'src/components/atoms/TextLink';
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
  const dispatch = useDispatch();
  const disConnect = async () => {
    await logOut(dispatch);
  };

  return (
    <Fragment>
      <div className={rootClass}>
        <div
          className={`${classes.userInfo} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-nowrap items-center shadow-none rounded-full py-1 pl-3 pr-1`}
        >
          <span className={`${classes.souldAvatar} mr-2`}>
            <Avatar
              size={24}
              name={t(name)}
              variant="beam" //oneOf: marble (default), beam, pixel,sunset, ring, bauhaus
              colors={['#F97316', '#EAB308', '#4ADE80', '#6d28d9', '#475569']}
            />
          </span>
          <span className="mr-2"> {t(name)}</span>
          <TextLink href="#" onClick={disConnect}>
            {t('Sign out')}
          </TextLink>
        </div>
      </div>
    </Fragment>
  );
};

export default DropDownMenu;

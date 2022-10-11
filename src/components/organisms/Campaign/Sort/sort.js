import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { array, arrayOf, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useDropdown } from '../../../../hooks/useDropdown';
import { useStyle } from '../../../../components/classify';
import useThemes from '../../../../hooks/useThemes';
import Button from '../../../atoms/Button';
import Icon from '../../../atoms/Icon';
import SortItem from './sortItem';
import defaultClasses from './sort.module.css';

const Sort = (props) => {
  const classes = useStyle(defaultClasses, props.classes);
  const { availableSortMethods = null, sortProps } = props;
  const [currentSort, setSort] = sortProps;

  const { t } = useTranslation('common');

  const { rootClassName } = useThemes();

  const { elementRef, expanded, setExpanded } = useDropdown();

  const locale = 'en';
  const orderSortingList = useCallback(
    (list) => {
      return list.sort((a, b) => {
        return a.text.localeCompare(b.text, locale, {
          sensitivity: 'base'
        });
      });
    },
    [locale]
  );
  const sortMethodsFromConfig = availableSortMethods
    ? availableSortMethods
        .map((method) => {
          const { attribute, direction, label } = method;
          return {
            id: `sortItem.${attribute}${direction}`,
            text: label,
            attribute,
            sortDirection: direction
          };
        })
        .filter((method) => !!method)
    : null;

  // click event for menu items
  const handleItemClick = useCallback(
    (sortAttribute) => {
      setSort((prevSort) => {
        return {
          sortText: sortAttribute.text,
          sortId: sortAttribute.id,
          sortAttribute: sortAttribute.attribute,
          sortDirection: sortAttribute.sortDirection,
          sortFromSearch: prevSort.sortFromSearch
        };
      });
      setExpanded(false);
    },
    [setExpanded, setSort]
  );

  const sortElements = useMemo(() => {
    // should be not render item in collapsed mode.
    if (!expanded) {
      return null;
    }

    const defaultSortMethods = [
      {
        id: 'sortItem.newest',
        text: t('Newest'),
        attribute: 'date_created',
        sortDirection: 'DESC'
      },
      {
        id: 'sortItem.oldest',
        text: t('Oldest'),
        attribute: 'date_created',
        sortDirection: 'ASC'
      }
    ];
    const allSortingMethods = sortMethodsFromConfig
      ? orderSortingList([sortMethodsFromConfig, defaultSortMethods].flat())
      : defaultSortMethods;

    const itemElements = Array.from(allSortingMethods, (sortItem) => {
      const { attribute, sortDirection } = sortItem;
      const isActive =
        currentSort.sortAttribute === attribute &&
        currentSort.sortDirection === sortDirection;

      const key = `${attribute}--${sortDirection}`;
      return (
        <li key={key} className={classes.menuItem}>
          <SortItem
            sortItem={sortItem}
            active={isActive}
            onClick={handleItemClick}
          />
        </li>
      );
    });

    return (
      <div className={classes.menu}>
        <ul>{itemElements}</ul>
      </div>
    );
  }, [
    classes.menu,
    classes.menuItem,
    currentSort.sortAttribute,
    currentSort.sortDirection,
    currentSort.sortFromSearch,
    expanded,
    handleItemClick,
    orderSortingList,
    sortMethodsFromConfig
  ]);

  // expand or collapse on click
  const handleSortClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div ref={elementRef} className={`${classes[rootClassName]}`}>
      <Button
        priority={'low'}
        classes={{ root_lowPriority: classes.sortButton }}
        onPress={handleSortClick}
      >
        <span className={classes.mobileText}>{t('Sort')}</span>
        <span className={classes.desktopText}>
          <span className={classes.sortText}>
            {t('Sort by')}
            &nbsp;{currentSort.sortText}
          </span>
          <Icon
            src={ArrowDown}
            classes={{
              root: classes.desktopIconWrapper,
              icon: classes.desktopIcon
            }}
          />
        </span>
      </Button>
      {sortElements}
    </div>
  );
};

Sort.propTypes = {
  classes: shape({
    menuItem: string,
    menu: string,
    root: string,
    sortButton: string
  }),
  availableSortMethods: arrayOf(
    shape({
      label: string,
      value: string
    })
  ),
  sortProps: array
};

export default Sort;

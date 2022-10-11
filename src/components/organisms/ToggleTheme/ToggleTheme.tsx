import React from 'react';
import useThemes from 'src/hooks/useThemes';
import classes from './toggleTheme.module.css';
const ToggleTheme = () => {
  const { setTheme, isDark } = useThemes();

  const imgSrc = isDark ? '/themes/light.svg' : '/themes/dark.svg';
  const toggleThemeClick = () => {
    isDark ? setTheme('light') : setTheme('dark');
  };
  return (
    <button
      className={`${classes.toggleThemeBtn} w-4 ml-auto`}
      onClick={toggleThemeClick}
    >
      <img src={imgSrc} alt="Toggle theme" className={classes.image} />
    </button>
  );
};

export default ToggleTheme;

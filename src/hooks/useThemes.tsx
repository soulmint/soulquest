import React from 'react';
import { useTheme } from 'next-themes';

const useThemes = () => {
  const [isDark, setIsDark] = React.useState(false);

  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  React.useEffect(
    () => (theme === 'dark' ? setIsDark(true) : setIsDark(false)),
    [theme]
  );

  const rootClassName = isDark ? 'rootDark' : 'root';
  return { theme, setTheme, isDark, rootClassName };
};
export default useThemes;

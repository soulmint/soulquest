const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  darkMode: 'class', // or 'media' or 'class'

  theme: {
    // Add Font to Sans Font Array
    fontFamily: {
      sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'ui-sans-serif', 'system-ui', "Helvetica Neue", 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      serif: ['"Literata"', ...defaultTheme.fontFamily.serif],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      altsans: ['"SF Pro Rounded"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'ui-sans-serif', 'system-ui', "Helvetica Neue", 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
    },
  },

  variants: {
    scale:                ['responsive', 'hover', 'focus', 'group-hover'],
    fontSize:             ['responsive', 'hover', 'focus', 'group-hover'],
    textColor:            ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    textOpacity:          ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    display:              ['responsive', 'hover', 'focus', 'group-hover'],
    transform:            ['responsive', 'hover', 'focus', 'group-hover'],
    translate:            ['responsive', 'hover', 'focus', 'group-hover'],
    opacity:              ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    backgroundColor:      ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    backgroundImage:      ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    gradientColorStops:   ['dark', 'responsive', 'hover', 'focus', 'group-hover'],
    width:                ['responsive', 'hover', 'focus', 'group-hover'],
    padding:              ['responsive', 'hover', 'focus', 'group-hover'],
    margin:               ['responsive', 'hover', 'focus', 'group-hover'],
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

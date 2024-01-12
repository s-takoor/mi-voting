import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      50: '#f7fafc',
      900: '#171923',
    },
    teal: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
    primary: {
      50: '#E6F7FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    secondary: {
      50: '#F5F5F5',
      100: '#E4E4E4',
      200: '#CACACA',
      300: '#A0A0A0',
      400: '#828282',
      500: '#636363',
      600: '#494949',
      700: '#333333',
      800: '#1F1F1F',
      900: '#141414',
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'teal.500',
          color: 'white',
          _hover: {
            bg: 'teal.600',
          },
        },
        outline: {
          border: '2px solid',
          borderColor: 'whiteAlpha.700',
          color: 'white',
          _hover: {
            bg: 'teal.600',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'whiteAlpha.700',
        _hover: {
          color: 'white',
        },
      },
    },
  },
});

export default theme;


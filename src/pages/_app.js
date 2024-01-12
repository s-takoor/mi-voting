import { ChakraProvider, CSSReset, ColorModeScript } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import theme from '../themes/chakra-theme';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      {/* Apply global styles and reset CSS */}
      <CSSReset />
      
      {/* Enable color mode script */}
      <ColorModeScript />

      {/* Navbar component */}
      <Navbar />
      
      {/* Render the page component */}
      <Component {...pageProps} />
      
      {/* Footer component */}
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;


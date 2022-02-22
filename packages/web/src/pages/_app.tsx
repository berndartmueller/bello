import type { AppProps } from 'next/app';
import globalStyles from './../styles/globals';

const MyApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();

  return <Component {...pageProps} />;
};

export default MyApp;

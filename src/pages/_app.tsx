import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QuizProvider } from '@/contexts/QuizContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuizProvider>
      <Component {...pageProps} />
    </QuizProvider>
  );
}

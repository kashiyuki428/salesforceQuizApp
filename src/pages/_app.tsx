import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QuizProvider } from '@/contexts/QuizContext';

// FontAwesomeの設定
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRightToBracket, faAngleRight, faAngleLeft, faHome } from '@fortawesome/free-solid-svg-icons';

// アイコンをライブラリに追加
library.add(faRightToBracket, faAngleRight, faAngleLeft, faHome);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuizProvider>
      <Component {...pageProps} />
    </QuizProvider>
  );
}

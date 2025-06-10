import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizQuestion, UserAnswer } from '@/types';

const ScorePage: React.FC = () => {
  const router = useRouter();
  const { resetQuiz } = useQuiz();
  const [mounted, setMounted] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  
  // コンポーネントがマウントされたことを確認
  useEffect(() => {
    setMounted(true);
    console.log('スコアページがマウントされました');
    
    // ローカルストレージからデータを取得
    try {
      const storedQuizData = localStorage.getItem('quizData');
      const storedUserAnswers = localStorage.getItem('userAnswers');
      
      if (storedQuizData && storedUserAnswers) {
        const parsedQuizData = JSON.parse(storedQuizData) as QuizQuestion[];
        const parsedUserAnswers = JSON.parse(storedUserAnswers) as Record<string, UserAnswer>;
        
        setQuizData(parsedQuizData);
        setUserAnswers(parsedUserAnswers);
        
        console.log('ローカルストレージからデータを読み込みました');
        console.log('クイズデータ:', parsedQuizData);
        console.log('ユーザー回答:', parsedUserAnswers);
      } else {
        console.error('ローカルストレージにデータがありません');
      }
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    }
  }, []);

  // 正解数の計算
  const correctAnswersCount = Object.values(userAnswers).filter(
    (answer) => answer.isCorrect
  ).length;

  // 正答率の計算
  const scorePercentage = quizData.length > 0
    ? Math.round((correctAnswersCount / quizData.length) * 100)
    : 0;

  // クイズデータがない場合はホームにリダイレクト
  useEffect(() => {
    if (mounted && quizData.length === 0) {
      console.log('クイズデータがないためホームにリダイレクトします');
      window.location.href = '/';
    }
  }, [quizData.length, mounted]);

  // ホームに戻る処理
  const handleBackToHome = () => {
    console.log('スコアページからホームに戻ります');
    resetQuiz();
    // 強制的にページ遷移を行う
    window.location.href = '/';
  };

  if (quizData.length === 0) {
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">採点結果</h1>
        
        <div className="space-y-6 mb-8">
          <div className="text-5xl font-bold text-secondary-600">
            {correctAnswersCount} / {quizData.length}
          </div>
          
          <div className="text-2xl">
            正答率: <span className="font-semibold">{scorePercentage}%</span>
          </div>
          
          <div className="mt-4">
            {scorePercentage >= 80 ? (
              <p className="text-green-600 font-medium">素晴らしい成績です！</p>
            ) : scorePercentage >= 60 ? (
              <p className="text-blue-600 font-medium">良い成績です！</p>
            ) : (
              <p className="text-orange-600 font-medium">もう一度挑戦してみましょう！</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleBackToHome}
          className="btn btn-primary w-full py-3"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default ScorePage;

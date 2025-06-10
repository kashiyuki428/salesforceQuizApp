import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuiz } from '@/contexts/QuizContext';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');

  const handleQuizSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuizId(e.target.value);
  };

  const handleQuizStart = () => {
    if (!selectedQuizId) return;
    dispatch({ type: 'SET_SELECTED_QUIZ', payload: selectedQuizId });
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-8">
          Salesforce 模擬問題
        </h1>
        
        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="quiz-select" className="block text-sm font-medium text-gray-700 mb-2">
              問題を選択してください
            </label>
            {/* カスタムセレクトボックス - Chrome対応強化版 */}
            <div className="custom-select-wrapper relative block">
              {/* 実際のセレクトボックス */}
              <select
                id="quiz-select"
                value={selectedQuizId}
                onChange={handleQuizSelect}
                className="block w-full p-3 pr-8 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white text-base"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'none',
                  textIndent: '0.01px',
                  textOverflow: '',
                  direction: 'ltr',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <option value="">問題を選択</option>
                {state.availableQuizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.name}
                  </option>
                ))}
              </select>
              
              {/* カスタム矢印 */}
              <div 
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
                style={{ zIndex: 2 }}
                aria-hidden="true"
              >
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleQuizStart}
            disabled={!selectedQuizId}
            className={`w-full btn btn-primary py-3 ${!selectedQuizId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            クイズスタート
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

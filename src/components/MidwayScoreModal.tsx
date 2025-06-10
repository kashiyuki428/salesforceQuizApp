import React from 'react';
import { QuizQuestion, UserAnswer } from '@/types';

interface MidwayScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizQuestion[];
  userAnswers: Record<string, UserAnswer>;
  onGoToScore: () => void;
}

const MidwayScoreModal: React.FC<MidwayScoreModalProps> = ({
  isOpen,
  onClose,
  quizData,
  userAnswers,
  onGoToScore,
}) => {
  if (!isOpen) return null;

  // 回答済みの問題数をカウント
  const answeredCount = Object.keys(userAnswers).length;
  
  // 正解数をカウント
  const correctCount = Object.values(userAnswers).filter(
    answer => answer.isCorrect
  ).length;
  
  // 正答率を計算
  const correctPercentage = answeredCount > 0 
    ? Math.round((correctCount / answeredCount) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">途中採点結果</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center border-b pb-2">
            <span>問題数:</span>
            <span className="font-semibold">{quizData.length}問</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span>回答済み:</span>
            <span className="font-semibold">{answeredCount}問</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span>正解数:</span>
            <span className="font-semibold text-green-600">{correctCount}問</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>現在の正答率:</span>
            <span className="font-semibold text-blue-600">{correctPercentage}%</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onGoToScore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-7a1 1 0 00-1 1v.01a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            採点結果へ
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default MidwayScoreModal;

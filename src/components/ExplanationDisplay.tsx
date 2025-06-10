import React from 'react';

interface ExplanationDisplayProps {
  explanation: string;
  userSelectedOptionKey: string | null;
  correctAnswerKeys: string[];
  options: { [key: string]: string };
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({
  explanation,
  userSelectedOptionKey,
  correctAnswerKeys,
  options,
}) => {
  // 複数選択の場合は配列に分解して比較
  const userAnswerKeys = userSelectedOptionKey ? userSelectedOptionKey.split(',') : [];
  
  const isCorrect = userAnswerKeys.length > 0 ? 
    userAnswerKeys.length === correctAnswerKeys.length && 
    userAnswerKeys.every(key => correctAnswerKeys.includes(key)) : 
    false;
  
  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <div className="mb-4">
        <div className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? '正解！' : '不正解'}
        </div>
        
        <div className="mt-2">
          <span className="font-medium">あなたの回答: </span>
          {userSelectedOptionKey ? userSelectedOptionKey.split(',').filter(key => key.trim() !== '').join(', ') : '未回答'}
        </div>
        
        {!isCorrect && (
          <div className="mt-2">
            <span className="font-medium">正解: </span>
            {correctAnswerKeys.join(', ')}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">解説:</h3>
        <p className="whitespace-pre-line">{explanation}</p>
      </div>
    </div>
  );
};

export default ExplanationDisplay;

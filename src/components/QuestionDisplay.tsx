import React from 'react';
import { QuizQuestion } from '@/types';

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedOptions: string[];
  onOptionSelect: (key: string) => void;
  showAnswer: boolean;
  correctAnswerKeys: string[];
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOptions,
  onOptionSelect,
  showAnswer,
  correctAnswerKeys,
}) => {
  // 複数回答が必要かどうかを判定
  const isMultipleAnswersRequired = correctAnswerKeys.length > 1;
  
  // 選択肢のクラスを決定する関数
  const getOptionClass = (key: string) => {
    let className = 'quiz-option';
    
    if (selectedOptions.includes(key)) {
      className += ' quiz-option-selected';
      
      if (showAnswer) {
        className += correctAnswerKeys.includes(key)
          ? ' quiz-option-correct'
          : ' quiz-option-incorrect';
      }
    } else if (showAnswer && correctAnswerKeys.includes(key)) {
      className += ' quiz-option-correct';
    }
    
    return className;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.question}</h2>
      
      {isMultipleAnswersRequired && !showAnswer && (
        <div className="text-sm text-blue-600 font-medium mb-2">
          ※この問題は複数選択が必要です（{correctAnswerKeys.length}つ選択）
        </div>
      )}
      
      <div className="space-y-3">
        {Object.entries(question.options).map(([key, text]) => (
          <div
            key={key}
            className={getOptionClass(key)}
            onClick={() => !showAnswer && onOptionSelect(key)}
          >
            <div className="flex items-start">
              <span className="font-medium mr-2">{key}.</span>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;

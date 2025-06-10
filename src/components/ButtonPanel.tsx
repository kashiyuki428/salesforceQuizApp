import React from 'react';

interface ButtonPanelProps {
  buttonType: 'answer' | 'next' | 'score';
  onAnswer: () => void;
  onNext: () => void;
  onScore: () => void;
  onHome: () => void;
  onMidwayScore?: () => void; // 途中採点ボタン用のコールバック
  isAnswerButtonDisabled: boolean;
  showMidwayScoreButton?: boolean; // 途中採点ボタンを表示するかどうか
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({
  buttonType,
  onAnswer,
  onNext,
  onScore,
  onHome,
  onMidwayScore,
  isAnswerButtonDisabled,
  showMidwayScoreButton = false,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onHome}
        className="btn btn-outline"
      >
        ホーム
      </button>
      
      <div className="flex space-x-2">
        {showMidwayScoreButton && buttonType !== 'score' && (
          <button
            onClick={onMidwayScore}
            className="btn btn-outline btn-secondary"
          >
            途中採点
          </button>
        )}
        
        {buttonType === 'answer' && (
          <button
            onClick={onAnswer}
            disabled={isAnswerButtonDisabled}
            className={`btn btn-primary ${isAnswerButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            回答
          </button>
        )}
        
        {buttonType === 'next' && (
          <button
            onClick={onNext}
            className="btn btn-primary"
          >
            次へ
          </button>
        )}
        
        {buttonType === 'score' && (
          <button
            onClick={onScore}
            className="btn btn-primary"
          >
            採点
          </button>
        )}
      </div>
    </div>
  );
};

export default ButtonPanel;

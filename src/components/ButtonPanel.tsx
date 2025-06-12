import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ButtonPanelProps {
  buttonType: 'answer' | 'next' | 'score';
  onAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void; // 戻るボタン用のコールバック
  onScore: () => void;
  onHome: () => void;
  onMidwayScore?: () => void; // 途中採点ボタン用のコールバック
  isAnswerButtonDisabled: boolean;
  showMidwayScoreButton?: boolean; // 途中採点ボタンを表示するかどうか
  showPreviousButton?: boolean; // 戻るボタンを表示するかどうか
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({
  buttonType,
  onAnswer,
  onNext,
  onPrevious,
  onScore,
  onHome,
  onMidwayScore,
  isAnswerButtonDisabled,
  showMidwayScoreButton = false,
  showPreviousButton = false,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <div className="flex space-x-2">
        <button
          onClick={onHome}
          className="btn btn-outline"
          aria-label="ホームに戻る"
        >
          <FontAwesomeIcon icon="home" />
        </button>
        
        {showPreviousButton && (
          <button
            onClick={onPrevious}
            className="btn btn-outline"
            aria-label="前の問題に戻る"
          >
            <FontAwesomeIcon icon="angle-left" />
          </button>
        )}
      </div>
      
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
            className="btn btn-primary"
          >
            回答
          </button>
        )}
        
        {buttonType === 'next' && (
          <button
            onClick={onNext}
            className="btn btn-primary"
            aria-label="次の問題へ"
          >
            <FontAwesomeIcon icon="angle-right" />
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

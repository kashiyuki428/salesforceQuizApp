import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuiz } from '@/contexts/QuizContext';
import QuestionDisplay from '@/components/QuestionDisplay';
import ExplanationDisplay from '@/components/ExplanationDisplay';
import ButtonPanel from '@/components/ButtonPanel';
import ConfirmationModal from '@/components/ConfirmationModal';
import MidwayScoreModal from '@/components/MidwayScoreModal';
import { QuizQuestion, UserAnswer } from '@/types';

const QuizPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch, fetchQuizData, submitAnswer, moveToNextQuestion, moveToPreviousQuestion, resetQuiz } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [midwayScoreData, setMidwayScoreData] = useState<{quizData: QuizQuestion[], userAnswers: Record<string, UserAnswer>}>({ quizData: [], userAnswers: {} });

  const {
    selectedQuizId,
    quizData,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    error,
    showExplanation,
  } = state;

  const currentQuestion = quizData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;
  
  // 現在の問題が複数選択を必要とするかどうか
  const isMultipleAnswersRequired = currentQuestion?.correctAnswers?.length > 1;

  // クイズデータの取得
  useEffect(() => {
    if (selectedQuizId) {
      fetchQuizData(selectedQuizId);
    } else {
      router.replace('/');
    }
  }, [selectedQuizId]);

  // 現在の問題が変わったら選択肢をリセット
  useEffect(() => {
    setSelectedOptions([]);
  }, [currentQuestionIndex]);

  // 選択肢を選んだ時の処理
  const handleOptionSelect = (key: string) => {
    // 複数選択の場合
    if (isMultipleAnswersRequired) {
      setSelectedOptions(prev => {
        // すでに選択されている場合は選択を解除
        if (prev.includes(key)) {
          return prev.filter(option => option !== key);
        } 
        // 選択されていない場合は追加
        return [...prev, key];
      });
    } else {
      // 単一選択の場合は上書き
      setSelectedOptions([key]);
    }
  };

  // 回答ボタンを押した時の処理
  const handleAnswer = () => {
    if (selectedOptions.length > 0 && currentQuestion) {
      // 複数選択の場合はソートしてカンマ区切りにする
      const answer = selectedOptions.sort().join(',');
      submitAnswer(currentQuestion.id, answer);
    }
  };

  // 次へボタンを押した時の処理
  const handleNext = () => {
    moveToNextQuestion();
  };

  // 戻るボタンを押した時の処理
  const handlePrevious = () => {
    moveToPreviousQuestion();
  };

  // 採点ボタンを押した時の処理
  const handleScore = () => {
    console.log('採点ボタンが押されました');
    
    // まずローカルストレージにデータを保存
    try {
      localStorage.setItem('quizData', JSON.stringify(quizData));
      localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
      console.log('データをローカルストレージに保存しました');
    } catch (error) {
      console.error('データ保存エラー:', error);
    }
    
    // 強制的にページ遷移を行う
    window.location.href = '/score';
  };

  // 途中採点ボタンを押した時の処理
  const handleMidwayScore = () => {
    setMidwayScoreData({
      quizData,
      userAnswers
    });
    setIsScoreModalOpen(true);
  };

  // ホームボタンを押した時の処理
  const handleHome = () => {
    setIsConfirmModalOpen(true);
  };

  // モーダルの確認ボタンを押した時の処理
  const handleConfirmHome = () => {
    setIsConfirmModalOpen(false);
    console.log('ホームに戻ります');
    // クイズをリセットしてからホームに遷移
    resetQuiz();
    // 強制的にページ遷移を行う
    window.location.href = '/';
  };

  // モーダルのキャンセルボタンを押した時の処理
  const handleCancelHome = () => {
    setIsConfirmModalOpen(false);
  };

  // ボタンタイプの決定
  const getButtonType = (): 'answer' | 'next' | 'score' => {
    if (showExplanation) {
      return isLastQuestion ? 'score' : 'next';
    }
    return 'answer';
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg">クイズデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">エラーが発生しました</div>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  // クイズデータがない場合の表示
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-6">クイズデータがありません</p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-700">
              問題 {currentQuestionIndex + 1} / {quizData.length}
            </h1>
          </div>
        </div>

        <QuestionDisplay
          question={currentQuestion}
          selectedOptions={selectedOptions}
          onOptionSelect={handleOptionSelect}
          showAnswer={showExplanation}
          correctAnswerKeys={currentQuestion.correctAnswers}
        />

        {showExplanation && (
          <ExplanationDisplay
            explanation={currentQuestion.explanation}
            userSelectedOptionKey={selectedOptions.join(',')}
            correctAnswerKeys={currentQuestion.correctAnswers}
            options={currentQuestion.options}
          />
        )}

        <ButtonPanel
          buttonType={getButtonType()}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onScore={handleScore}
          onHome={handleHome}
          onMidwayScore={handleMidwayScore}
          isAnswerButtonDisabled={false}
          showMidwayScoreButton={Object.keys(userAnswers).length > 0}
          showPreviousButton={currentQuestionIndex > 0}
        />
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmHome}
        onCancel={handleCancelHome}
        title="クイズを終了しますか？"
        message="ホームに戻ると進行状況がリセットされます。"
      />
      
      <MidwayScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        quizData={midwayScoreData.quizData}
        userAnswers={midwayScoreData.userAnswers}
        onGoToScore={handleScore}
      />
    </div>
  );
};

export default QuizPage;

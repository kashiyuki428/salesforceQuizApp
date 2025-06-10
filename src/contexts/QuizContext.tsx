import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { QuizState, QuizQuestion, UserAnswer, QuizDatabase } from '@/types';

// アクションタイプの定義
type QuizAction =
  | { type: 'SET_SELECTED_QUIZ'; payload: string }
  | { type: 'SET_QUIZ_DATA'; payload: QuizQuestion[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_QUESTION_INDEX'; payload: number }
  | { type: 'ADD_USER_ANSWER'; payload: UserAnswer }
  | { type: 'TOGGLE_EXPLANATION'; payload?: boolean }
  | { type: 'SET_AVAILABLE_QUIZZES'; payload: QuizDatabase[] }
  | { type: 'RESET_QUIZ' };

// 初期状態
const initialState: QuizState = {
  availableQuizzes: [],
  selectedQuizId: null,
  quizData: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  isLoading: false,
  error: null,
  showExplanation: false,
};

// リデューサー関数
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_SELECTED_QUIZ':
      return { ...state, selectedQuizId: action.payload, quizData: [], currentQuestionIndex: 0, userAnswers: {} };
    case 'SET_QUIZ_DATA':
      return { ...state, quizData: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_QUESTION_INDEX':
      return { ...state, currentQuestionIndex: action.payload };
    case 'ADD_USER_ANSWER':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.questionId]: action.payload,
        },
      };
    case 'TOGGLE_EXPLANATION':
      return {
        ...state,
        showExplanation: action.payload !== undefined ? action.payload : !state.showExplanation,
      };
    case 'SET_AVAILABLE_QUIZZES':
      return {
        ...state,
        availableQuizzes: action.payload,
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
        availableQuizzes: state.availableQuizzes,
      };
    default:
      return state;
  }
};

// コンテキストの作成
interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  fetchQuizData: (databaseId: string) => Promise<void>;
  submitAnswer: (questionId: string, selectedOption: string) => void;
  moveToNextQuestion: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  // データベースリストを取得する関数
  const fetchDatabases = async () => {
    try {
      const response = await fetch('/api/databases');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `APIエラー: ${response.status}`);
      }
      
      const databases: QuizDatabase[] = await response.json();
      dispatch({ type: 'SET_AVAILABLE_QUIZZES', payload: databases });
    } catch (error) {
      console.error('データベースリストの取得エラー:', error);
    }
  };
  
  // コンポーネントのマウント時にデータベースリストを取得
  useEffect(() => {
    fetchDatabases();
  }, []);

  // クイズデータを取得する関数
  const fetchQuizData = async (quizId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {      
      // API Routeを使用してデータを動的に取得
      const response = await fetch(`/api/quiz?quizId=${quizId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `APIエラー: ${response.status}`);
      }
      
      const quizData = await response.json();
      
      if (!Array.isArray(quizData) || quizData.length === 0) {
        throw new Error('クイズデータが見つかりませんでした');
      }
      
      dispatch({ type: 'SET_QUIZ_DATA', payload: quizData });
    } catch (error) {
      console.error('クイズデータの取得エラー:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : '不明なエラーが発生しました' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 回答を提出する関数
  const submitAnswer = (questionId: string, selectedOption: string) => {
    const currentQuestion = state.quizData.find((q) => q.id === questionId);
    
    if (!currentQuestion) return;
    
    // 選択肢と正解を配列に分解して、空の要素や空白を除去してソート
    const userAnswerKeys = selectedOption.split(',').filter(key => key.trim() !== '').sort();
    const correctAnswerKeys = [...currentQuestion.correctAnswers].sort();
    
    // 配列の長さが同じで、すべての要素が一致するかチェック
    const isCorrect = 
      userAnswerKeys.length === correctAnswerKeys.length &&
      userAnswerKeys.length > 0 &&
      userAnswerKeys.every(key => correctAnswerKeys.includes(key));
    
    dispatch({
      type: 'ADD_USER_ANSWER',
      payload: {
        questionId,
        selectedOption,
        isCorrect,
      },
    });
    
    dispatch({ type: 'TOGGLE_EXPLANATION', payload: true });
  };

  // 次の問題に進む関数
  const moveToNextQuestion = () => {
    if (state.currentQuestionIndex < state.quizData.length - 1) {
      dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: state.currentQuestionIndex + 1 });
      dispatch({ type: 'TOGGLE_EXPLANATION', payload: false });
    }
  };

  // クイズをリセットする関数
  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        fetchQuizData,
        submitAnswer,
        moveToNextQuestion,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// カスタムフック
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

// クイズの質問に関する型定義
export interface QuizQuestion {
  id: string;
  no: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D?: string;
    E?: string;
  };
  correctAnswers: string[];
  explanation: string;
}

// クイズデータベース情報の型定義
export interface QuizDatabase {
  id: string;
  name: string;
}

// ユーザーの回答履歴の型定義
export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

// クイズコンテキストの状態の型定義
export interface QuizState {
  availableQuizzes: QuizDatabase[];
  selectedQuizId: string | null;
  quizData: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, UserAnswer>;
  isLoading: boolean;
  error: string | null;
  showExplanation: boolean;
}

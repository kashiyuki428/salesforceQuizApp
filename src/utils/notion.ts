import { QuizQuestion } from '@/types';

/**
 * NotionのAPIレスポンスからテキストを抽出するヘルパー関数
 */
const getTextContent = (prop: any): string => {
  if (!prop) return '';
  if (prop.rich_text && Array.isArray(prop.rich_text)) {
    return prop.rich_text.map((text: any) => text.plain_text).join('');
  }
  if (prop.title && Array.isArray(prop.title)) {
    return prop.title.map((text: any) => text.plain_text).join('');
  }
  return '';
};

/**
 * NotionのAPIレスポンスを扱いやすい形式に変換する関数
 */
export const transformNotionData = (notionData: any[]): QuizQuestion[] => {
  return notionData
    .map((item) => {
      try {
        const properties = item.properties;
        // 必須プロパティのチェック
        if (!properties.question || !properties.correctAnswer) {
          return null;
        }
        // データの抽出
        const no = properties.id ? parseInt(getTextContent(properties.id)) || 0 : 0;
        const question = getTextContent(properties.question);
        const optionA = getTextContent(properties.choiceA);
        const optionB = getTextContent(properties.choiceB);
        const optionC = getTextContent(properties.choiceC);
        const optionD = getTextContent(properties.choiceD);
        const optionE = getTextContent(properties.choiceE);
        const correctAnswerText = getTextContent(properties.correctAnswer);
        const explanation = getTextContent(properties.explanation);
        // 選択肢の設定
        const options: Record<string, string> = {};
        if (optionA) options['A'] = optionA;
        if (optionB) options['B'] = optionB;
        if (optionC) options['C'] = optionC;
        if (optionD) options['D'] = optionD;
        if (optionE) options['E'] = optionE;
        // 正解の設定（カンマ区切りで分割）
        const correctAnswers = correctAnswerText
          .split(/[,、]/) // カンマと全角カンマの両方に対応
          .map(answer => answer.trim())
          .filter(answer => answer !== '');
        return {
          id: item.id,
          no,
          question,
          options,
          correctAnswers,
          explanation,
        };
      } catch (error) {
        console.error('データ変換エラー:', error);
        return null;
      }
    })
    .filter((item): item is QuizQuestion => item !== null)
    .reverse(); // Notion APIが逆順でデータを返すため、順序を反転させる
};

// Notionデータを変換してJSONファイルに保存するスクリプト
const fs = require('fs');
const path = require('path');

// Notionデータを読み込む
const notionDataPath = path.join(process.cwd(), 'src/data/notion_data.json');
const notionData = JSON.parse(fs.readFileSync(notionDataPath, 'utf8'));

if (!notionData.results || !Array.isArray(notionData.results)) {
  console.error('データ形式が不正です');
  process.exit(1);
}

console.log(`${notionData.results.length}件のNotionデータを変換します`);

// Notionのレスポンスデータをクイズ形式に変換する関数
function transformNotionData(notionResults) {
  return notionResults
    .map((item, index) => {
      try {
        // 質問テキストの取得
        const questionProperty = item.properties.question;
        const questionText = questionProperty?.title?.[0]?.plain_text || '';
        
        // 選択肢の取得
        const optionA = getPropertyText(item.properties.choiceA);
        const optionB = getPropertyText(item.properties.choiceB);
        const optionC = getPropertyText(item.properties.choiceC);
        const optionD = getPropertyText(item.properties.choiceD);
        const optionE = getPropertyText(item.properties.choiceE);
        
        // 正解の取得
        const correctAnswerText = getPropertyText(item.properties.correctAnswer);
        
        // 正解を配列に変換（カンマで区切られている場合は分割）
        const correctAnswers = correctAnswerText
          .split(/[,、]/)
          .map(answer => answer.trim())
          .filter(answer => answer);
          
        // 解説の取得
        const explanation = getPropertyText(item.properties.explanation);
        
        // 問題番号の取得
        const uniqueId = item.properties.unique_id;
        const no = uniqueId?.number || index + 1;
        
        // クイズ項目の作成
        const options = { A: optionA, B: optionB, C: optionC };
        if (optionD) options.D = optionD;
        if (optionE) options.E = optionE;
        
        return {
          id: item.id,
          no,
          question: questionText,
          options,
          correctAnswers,
          explanation
        };
      } catch (error) {
        console.error(`項目${index + 1}の変換エラー:`, error);
        return null;
      }
    })
    .filter(item => item !== null)
    .sort((a, b) => a.no - b.no);
}

// Notionプロパティからテキストを取得するヘルパー関数
function getPropertyText(property) {
  if (!property) return '';
  
  if (property.rich_text && Array.isArray(property.rich_text) && property.rich_text.length > 0) {
    return property.rich_text[0].plain_text || '';
  }
  
  if (property.title && Array.isArray(property.title) && property.title.length > 0) {
    return property.title[0].plain_text || '';
  }
  
  return '';
}

// クイズデータに変換
const quizData = transformNotionData(notionData.results);

// クイズデータをJSONファイルに保存
const quizzes = {
  quizzes: [
    {
      id: '20c669af-59b2-80fe-a055-f8ae4db772f7',
      title: 'Salesforceクイズ',
      questions: quizData
    }
  ]
};

const quizzesPath = path.join(process.cwd(), 'src/data/quizzes.json');
fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2));

console.log(`${quizData.length}問のクイズデータをJSONファイルに保存しました`);

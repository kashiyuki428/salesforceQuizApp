import { NextApiRequest, NextApiResponse } from 'next';
import { QuizQuestion } from '@/types';
import { transformNotionData } from '@/utils/notion';

/**
 * Notion APIからクイズデータを取得するAPI Route
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  const { quizId } = req.query;

  if (!quizId || typeof quizId !== 'string') {
    return res.status(400).json({ error: 'クイズIDが必要です' });
  }

  try {
    // Notion APIからデータを取得
    const apiKey = process.env.NOTION_API_KEY;
    
    if (!apiKey) {
      throw new Error('Notion APIキーが設定されていません');
    }
    
    const url = `https://api.notion.com/v1/databases/${quizId}/query`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    });
    
    if (!response.ok) {
      throw new Error(`Notion APIエラー: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('データ形式が不正です');
    }
    
    const quizData = transformNotionData(data.results);
    return res.status(200).json(quizData);
  } catch (error) {
    console.error('クイズデータの取得エラー:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
    });
  }
}

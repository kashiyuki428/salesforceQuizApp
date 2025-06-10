import { NextApiRequest, NextApiResponse } from 'next';
import { QuizDatabase } from '@/types';

// 環境変数からNotionデータベースのリストを取得するAPI Route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'メソッドが許可されていません' });
  }

  try {
    // 環境変数からデータベースリストを取得
    const databasesString = process.env.NOTION_DATABASES;
    
    if (!databasesString) {
      return res.status(500).json({ error: 'データベース設定が見つかりません' });
    }
    
    // 形式: DATABASE_ID1:DATABASE_NAME1,DATABASE_ID2:DATABASE_NAME2,...
    const databases: QuizDatabase[] = databasesString
      .split(',')
      .map(item => {
        const [id, name] = item.split(':');
        return { id, name };
      })
      .filter(item => item.id && item.name);
    
    return res.status(200).json(databases);
  } catch (error) {
    console.error('データベースリスト取得エラー:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
    });
  }
}

import { Request, Response } from 'express';
import { processOperationsQuery } from '../services/aiService';

export async function askOperationsBrain(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query prompt is required' });
    }

    const result = await processOperationsQuery(query);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

import { Request, Response } from 'express';
import { prisma } from '../services/db';

export async function getKnowledgeGraph(req: Request, res: Response) {
  try {
    const nodes = await prisma.graphNode.findMany();
    const edges = await prisma.graphEdge.findMany();

    return res.json({ nodes, edges });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

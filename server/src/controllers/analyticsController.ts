import { Request, Response } from 'express';
import { prisma } from '../services/db';
import { calculateRULPredictions } from '../services/rulService';

export async function getAnalyticsData(req: Request, res: Response) {
  try {
    const assets = await prisma.asset.findMany();

    const downtimeByCause = {
      labels: ['Mechanical', 'Electrical', 'Sensor fault', 'Human error', 'Scheduled'],
      data: [42, 28, 15, 9, 22],
    };

    const assetUtilization = {
      labels: ['In use', 'Idle', 'Maintenance', 'Offline'],
      data: [68, 18, 9, 5],
    };

    const costTrend = {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      data: [38, 42, 35, 48, 44, 51],
    };

    const riskRadar = {
      labels: ['Mechanical', 'Thermal', 'Electrical', 'Vibration', 'Corrosion', 'Age'],
      data: [62, 45, 38, 55, 30, 48],
    };

    return res.json({
      downtimeByCause,
      assetUtilization,
      costTrend,
      riskRadar,
      totalAssetsCount: assets.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getRULData(req: Request, res: Response) {
  try {
    const predictions = await calculateRULPredictions();
    return res.json(predictions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

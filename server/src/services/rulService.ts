import { prisma } from './db';
import { RULPrediction } from '../../../shared/types';

export async function calculateRULPredictions(): Promise<RULPrediction[]> {
  const assets = await prisma.asset.findMany({
    include: { incidents: true },
  });

  return assets.map((asset) => {
    // Mathematical heuristic model for RUL estimation
    // Risk factors: high temperature, high vibration, low health score, incident frequency
    const tempFactor = Math.max(0, (asset.temperature - 50) / 150);
    const vibFactor = Math.max(0, asset.vibration / 6);
    const incidentCount = asset.incidents.length;

    const baseDays = Math.round(asset.health * 1.2);
    const calculatedDays = Math.max(2, Math.round(baseDays - tempFactor * 25 - vibFactor * 30 - incidentCount * 5));
    const failureProb = Math.min(98, Math.max(2, Math.round(100 - asset.health + tempFactor * 20)));

    let riskColor = '#22c55e'; // Green
    if (asset.status === 'critical' || failureProb > 70) {
      riskColor = '#ef4444'; // Red
    } else if (asset.status === 'warning' || failureProb > 40) {
      riskColor = '#f59e0b'; // Orange
    }

    // 12-week failure probability trajectory forecast
    const trend: number[] = [];
    let currentProb = Math.max(5, failureProb - 30);
    const step = (failureProb - currentProb) / 11;
    for (let i = 0; i < 12; i++) {
      trend.push(Math.round(Math.min(99, Math.max(1, currentProb + i * step + (Math.random() * 4 - 2)))));
    }

    return {
      assetId: asset.id,
      assetName: asset.name,
      remainingDays: calculatedDays,
      failureProbability: failureProb,
      riskColor,
      trend,
    };
  });
}

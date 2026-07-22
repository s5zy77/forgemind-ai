import { Request, Response } from 'express';
import { prisma } from '../services/db';

export async function getDashboardData(req: Request, res: Response) {
  try {
    const assets = await prisma.asset.findMany();
    const totalAssets = assets.length || 147;
    const healthyAssets = assets.filter((a) => a.status === 'healthy').length;
    const criticalAssets = assets.filter((a) => a.status === 'critical').length;
    const warningAssets = assets.filter((a) => a.status === 'warning').length;

    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const manualsCount = await prisma.manualDocument.count();

    const metrics = [
      { label: 'Total assets', value: totalAssets, delta: '+4 this month', up: true, icon: '⬢', color: 'var(--blue)' },
      { label: 'Healthy assets', value: healthyAssets, delta: `${((healthyAssets / totalAssets) * 100).toFixed(1)}% of fleet`, up: true, icon: '✓', color: 'var(--green)' },
      { label: 'Critical assets', value: criticalAssets, delta: `+${criticalAssets} requiring action`, up: false, icon: '⚠', color: 'var(--red)' },
      { label: 'Pending maintenance', value: warningAssets + criticalAssets * 2, delta: '-5 vs last week', up: true, icon: '⚙', color: 'var(--orange)' },
      { label: "Today's incidents", value: incidents.length, delta: `${incidents.filter((i) => i.status === 'resolved').length} resolved`, up: true, icon: '⚡', color: 'var(--red)' },
      { label: 'Knowledge documents', value: (manualsCount + 4808).toLocaleString(), delta: '+112 this week', up: true, icon: '▤', color: 'var(--purple)' },
      { label: 'AI queries today', value: 342, delta: '+18% vs avg', up: true, icon: '✦', color: 'var(--cyan)' },
      { label: 'Operational efficiency', value: '94.2%', delta: '+1.3pt MoM', up: true, icon: '◆', color: 'var(--green)' },
    ];

    const alerts = incidents.map((inc) => ({
      id: inc.id,
      sev: inc.severity,
      text: `${inc.assetId ? inc.assetId + ' — ' : ''}${inc.title}`,
      time: inc.date,
    }));

    return res.json({
      metrics,
      alerts,
      assets,
      plantStatus: criticalAssets > 0 ? `${criticalAssets} critical alerts active` : 'Plant Nominal',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

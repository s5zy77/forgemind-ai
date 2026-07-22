import { Request, Response } from 'express';
import { prisma } from '../services/db';

export async function getAssets(req: Request, res: Response) {
  try {
    const { zone, status, search } = req.query;

    const where: any = {};
    if (zone && zone !== 'all') where.zone = String(zone);
    if (status && status !== 'all') where.status = String(status);
    if (search) {
      where.OR = [
        { id: { contains: String(search) } },
        { name: { contains: String(search) } },
        { zone: { contains: String(search) } },
        { type: { contains: String(search) } },
      ];
    }

    const assets = await prisma.asset.findMany({
      where,
      include: {
        manuals: true,
        incidents: true,
      },
      orderBy: { id: 'asc' },
    });

    return res.json(assets);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getAssetById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        manuals: true,
        incidents: true,
        telemetries: {
          take: 20,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    return res.json(asset);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createAsset(req: Request, res: Response) {
  try {
    const data = req.body;

    const asset = await prisma.asset.create({
      data: {
        id: data.id,
        name: data.name,
        zone: data.zone,
        type: data.type || 'Equipment',
        health: Number(data.health) || 100,
        riskScore: Number(data.riskScore) || 0,
        temperature: Number(data.temperature) || 50,
        vibration: Number(data.vibration) || 1.0,
        status: data.status || 'healthy',
        nextMaintenance: data.nextMaintenance || 'Scheduled',
        recommendation: data.recommendation || 'Nominal operations',
        description: data.description || '',
        gridX: Number(data.gridX) || 100,
        gridY: Number(data.gridY) || 100,
        gridW: Number(data.gridW) || 110,
        gridH: Number(data.gridH) || 80,
      },
    });

    return res.status(201).json(asset);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...data,
        health: data.health !== undefined ? Number(data.health) : undefined,
        riskScore: data.riskScore !== undefined ? Number(data.riskScore) : undefined,
        temperature: data.temperature !== undefined ? Number(data.temperature) : undefined,
        vibration: data.vibration !== undefined ? Number(data.vibration) : undefined,
      },
    });

    return res.json(asset);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.asset.delete({ where: { id } });
    return res.json({ success: true, message: `Asset ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

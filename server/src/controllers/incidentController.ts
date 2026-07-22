import { Request, Response } from 'express';
import { prisma } from '../services/db';

export async function getIncidents(req: Request, res: Response) {
  try {
    const { severity, status } = req.query;
    const where: any = {};
    if (severity && severity !== 'all') where.severity = String(severity);
    if (status && status !== 'all') where.status = String(status);

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { asset: true },
    });

    return res.json(incidents);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createIncident(req: Request, res: Response) {
  try {
    const data = req.body;
    const incident = await prisma.incident.create({
      data: {
        assetId: data.assetId || null,
        title: data.title,
        type: data.type || 'Incident',
        severity: data.severity || 'medium',
        status: data.status || 'open',
        date: data.date || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        description: data.description,
        rootCause: data.rootCause || 'AI Root cause analysis in progress...',
        resolution: data.resolution || 'Pending technician assignment.',
      },
    });

    return res.status(201).json(incident);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateIncident(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const incident = await prisma.incident.update({
      where: { id },
      data,
    });
    return res.json(incident);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteIncident(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.incident.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

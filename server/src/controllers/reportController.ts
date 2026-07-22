import { Request, Response } from 'express';
import { generateCSVReport, generatePDFReport } from '../services/reportService';
import { prisma } from '../services/db';

export async function downloadReport(req: Request, res: Response) {
  try {
    const { type, format } = req.query; // type: maintenance, incidents, assets, executive; format: csv, pdf

    const reportType = (type as any) || 'assets';
    const fileFormat = (format as any) || 'csv';

    if (fileFormat === 'csv') {
      const csv = await generateCSVReport(reportType);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ForgeMind_${reportType}_Report_${Date.now()}.csv"`);
      return res.status(200).send(csv);
    } else {
      return generatePDFReport(reportType, res);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function globalSearch(req: Request, res: Response) {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ assets: [], incidents: [], manuals: [] });

    const assets = await prisma.asset.findMany({
      where: {
        OR: [
          { id: { contains: q } },
          { name: { contains: q } },
          { zone: { contains: q } },
          { type: { contains: q } },
        ],
      },
      take: 5,
    });

    const incidents = await prisma.incident.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { type: { contains: q } },
        ],
      },
      take: 5,
    });

    const manuals = await prisma.manualDocument.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 5,
    });

    return res.json({ assets, incidents, manuals });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

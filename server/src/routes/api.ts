import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { getDashboardData } from '../controllers/dashboardController';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/assetController';
import { askOperationsBrain } from '../controllers/aiController';
import { getIncidents, createIncident, updateIncident, deleteIncident } from '../controllers/incidentController';
import { getAnalyticsData, getRULData } from '../controllers/analyticsController';
import { getKnowledgeGraph } from '../controllers/graphController';
import { downloadReport, globalSearch } from '../controllers/reportController';
import { verifyToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public Auth routes
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/me', getMe);

// Protected routes (require valid JWT token)
router.get('/dashboard', verifyToken as any, getDashboardData);

// Assets (Writing requires ADMIN or ENGINEER)
router.get('/assets', verifyToken as any, getAssets);
router.get('/assets/:id', verifyToken as any, getAssetById);
router.post('/assets', verifyToken as any, requireRole(['ADMIN', 'ENGINEER']) as any, createAsset);
router.patch('/assets/:id', verifyToken as any, requireRole(['ADMIN', 'ENGINEER']) as any, updateAsset);
router.delete('/assets/:id', verifyToken as any, requireRole(['ADMIN']) as any, deleteAsset);

// AI Brain
router.post('/ai/query', verifyToken as any, askOperationsBrain);

// Incidents
router.get('/incidents', verifyToken as any, getIncidents);
router.post('/incidents', verifyToken as any, createIncident);
router.patch('/incidents/:id', verifyToken as any, requireRole(['ADMIN', 'ENGINEER']) as any, updateIncident);
router.delete('/incidents/:id', verifyToken as any, requireRole(['ADMIN']) as any, deleteIncident);

// Analytics & Predictive Maintenance
router.get('/analytics', verifyToken as any, getAnalyticsData);
router.get('/maintenance/rul', verifyToken as any, getRULData);

// Knowledge Graph
router.get('/graph', verifyToken as any, getKnowledgeGraph);

// Reports & Search
router.get('/reports/download', verifyToken as any, downloadReport);
router.get('/search', verifyToken as any, globalSearch);

export default router;

import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { getDashboardData } from '../controllers/dashboardController';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/assetController';
import { askOperationsBrain } from '../controllers/aiController';
import { getIncidents, createIncident, updateIncident, deleteIncident } from '../controllers/incidentController';
import { getAnalyticsData, getRULData } from '../controllers/analyticsController';
import { getKnowledgeGraph } from '../controllers/graphController';
import { downloadReport, globalSearch } from '../controllers/reportController';

const router = Router();

// Auth
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/me', getMe);

// Dashboard
router.get('/dashboard', getDashboardData);

// Assets
router.get('/assets', getAssets);
router.get('/assets/:id', getAssetById);
router.post('/assets', createAsset);
router.patch('/assets/:id', updateAsset);
router.delete('/assets/:id', deleteAsset);

// AI Brain
router.post('/ai/query', askOperationsBrain);

// Incidents
router.get('/incidents', getIncidents);
router.post('/incidents', createIncident);
router.patch('/incidents/:id', updateIncident);
router.delete('/incidents/:id', deleteIncident);

// Analytics & Predictive Maintenance
router.get('/analytics', getAnalyticsData);
router.get('/maintenance/rul', getRULData);

// Knowledge Graph
router.get('/graph', getKnowledgeGraph);

// Reports & Search
router.get('/reports/download', downloadReport);
router.get('/search', globalSearch);

export default router;

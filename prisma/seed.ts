import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ForgeMind AI database...');

  // Clean existing data
  await prisma.graphEdge.deleteMany();
  await prisma.graphNode.deleteMany();
  await prisma.manualDocument.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.telemetryRecord.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.createMany({
    data: [
      {
        id: 'usr-1',
        email: 'admin@forgemind.ai',
        password: hashedPassword,
        name: 'R. Kapoor',
        role: 'ADMIN',
        avatar: 'RK',
      },
      {
        id: 'usr-2',
        email: 'engineer@forgemind.ai',
        password: hashedPassword,
        name: 'A. Iyer',
        role: 'ENGINEER',
        avatar: 'AI',
      },
    ],
  });

  // Create Assets
  const assetsData = [
    {
      id: 'Pump-101',
      name: 'Primary Feed Pump 101',
      zone: 'Zone A',
      type: 'Centrifugal Pump',
      health: 88.0,
      riskScore: 14.0,
      temperature: 62.0,
      vibration: 2.1,
      status: 'healthy',
      nextMaintenance: 'Aug 14',
      recommendation: 'Monitor bearing vibration during peak load',
      description: 'Main coolant circulating pump for Zone A chemical processing line.',
      gridX: 40,
      gridY: 40,
      gridW: 110,
      gridH: 70,
    },
    {
      id: 'Boiler-22',
      name: 'High Pressure Steam Boiler 22',
      zone: 'Zone B',
      type: 'Industrial Boiler',
      health: 41.0,
      riskScore: 78.0,
      temperature: 210.0,
      vibration: 5.8,
      status: 'critical',
      nextMaintenance: 'Overdue',
      recommendation: 'Schedule immediate pressure valve & burner inspection',
      description: 'High pressure steam generator providing power for Zone B thermal units.',
      gridX: 220,
      gridY: 60,
      gridW: 130,
      gridH: 90,
    },
    {
      id: 'Conveyor-A',
      name: 'Heavy Material Conveyor A',
      zone: 'Zone A',
      type: 'Conveyor System',
      health: 73.0,
      riskScore: 32.0,
      temperature: 38.0,
      vibration: 1.4,
      status: 'healthy',
      nextMaintenance: 'Sep 2',
      recommendation: 'On track, check belt tension during routine window',
      description: 'Continuous belt conveyor transporting raw ore to primary crusher.',
      gridX: 400,
      gridY: 150,
      gridW: 220,
      gridH: 40,
    },
    {
      id: 'Transformer-T3',
      name: 'Main Substation Transformer T3',
      zone: 'Zone C',
      type: 'Power Transformer',
      health: 59.0,
      riskScore: 55.0,
      temperature: 74.0,
      vibration: 0.8,
      status: 'warning',
      nextMaintenance: 'Jul 29',
      recommendation: 'Thermal imaging recommended for high-temp bushing',
      description: 'Step-down oil-cooled transformer rated for 15MVA plant distribution.',
      gridX: 660,
      gridY: 40,
      gridW: 110,
      gridH: 80,
    },
    {
      id: 'Compressor-X4',
      name: 'Rotary Screw Compressor X4',
      zone: 'Zone D',
      type: 'Air Compressor',
      health: 66.0,
      riskScore: 41.0,
      temperature: 88.0,
      vibration: 3.2,
      status: 'warning',
      nextMaintenance: 'Aug 5',
      recommendation: 'Replace air filter within 2 weeks',
      description: 'Pneumatic line compressor supplying instrument air across Zone D.',
      gridX: 60,
      gridY: 230,
      gridW: 120,
      gridH: 80,
    },
    {
      id: 'Compressor-X5',
      name: 'Rotary Screw Compressor X5',
      zone: 'Zone D',
      type: 'Air Compressor',
      health: 91.0,
      riskScore: 9.0,
      temperature: 81.0,
      vibration: 1.1,
      status: 'healthy',
      nextMaintenance: 'Sep 18',
      recommendation: 'Nominal operations, continue standard schedule',
      description: 'Secondary air compressor, operating under balanced load configuration.',
      gridX: 240,
      gridY: 250,
      gridW: 120,
      gridH: 80,
    },
    {
      id: 'Chiller-C2',
      name: 'Glycol Process Chiller C2',
      zone: 'Zone C',
      type: 'Refrigeration Chiller',
      health: 36.0,
      riskScore: 82.0,
      temperature: 15.0,
      vibration: 4.6,
      status: 'critical',
      nextMaintenance: 'Overdue',
      recommendation: 'High failure risk — dispatch technician immediately for leak check',
      description: 'Closed-loop chiller supplying low temperature glycol coolant.',
      gridX: 460,
      gridY: 250,
      gridW: 130,
      gridH: 90,
    },
    {
      id: 'Motor-M9',
      name: 'Induction Drive Motor M9',
      zone: 'Zone B',
      type: 'Electric Motor',
      health: 79.0,
      riskScore: 22.0,
      temperature: 55.0,
      vibration: 1.7,
      status: 'healthy',
      nextMaintenance: 'Oct 1',
      recommendation: 'Healthy operating range, vibration nominal',
      description: 'Variable speed AC induction motor driving main exhaust fan.',
      gridX: 660,
      gridY: 250,
      gridW: 110,
      gridH: 70,
    },
  ];

  for (const asset of assetsData) {
    await prisma.asset.create({ data: asset });

    // Seed historical telemetry
    for (let i = 10; i >= 0; i--) {
      const time = new Date(Date.now() - i * 3600 * 1000 * 4);
      await prisma.telemetryRecord.create({
        data: {
          assetId: asset.id,
          temperature: asset.temperature + (Math.random() * 4 - 2),
          vibration: Math.max(0.2, asset.vibration + (Math.random() * 0.4 - 0.2)),
          healthScore: Math.min(100, Math.max(10, asset.health + (Math.random() * 2 - 1))),
          timestamp: time,
        },
      });
    }
  }

  // Create Incidents
  await prisma.incident.createMany({
    data: [
      {
        id: 'inc-101',
        assetId: 'Boiler-22',
        title: 'Boiler-22 high-pressure trip',
        type: 'Trip',
        severity: 'critical',
        status: 'open',
        date: 'Jul 20, 14:32',
        description: 'Automatic shutdown triggered due to pressure spiking beyond 18 bar limit.',
        rootCause: 'Fouled pressure relief valve and delayed actuation.',
        resolution: 'Bypass engaged; full valve overhaul pending.',
      },
      {
        id: 'inc-102',
        assetId: 'Compressor-X4',
        title: 'Compressor-X4 filter replaced',
        type: 'Maintenance',
        severity: 'low',
        status: 'resolved',
        date: 'Jul 18, 09:10',
        description: 'Preventive replacement completed by engineering team in Zone D.',
        rootCause: 'Dust accumulation in intake duct.',
        resolution: 'New HEPA grade air filter installed.',
      },
      {
        id: 'inc-103',
        assetId: 'Transformer-T3',
        title: 'Transformer-T3 thermal scan anomaly',
        type: 'Inspection',
        severity: 'medium',
        status: 'investigating',
        date: 'Jul 16, 11:00',
        description: 'Thermal imaging showed localized hotspot near high-voltage bushings.',
        rootCause: 'Loose terminal connection leading to increased contact resistance.',
        resolution: 'Tightening scheduled for upcoming shutdown window.',
      },
      {
        id: 'inc-104',
        assetId: 'Pump-101',
        title: 'Pump-101 bearing lubrication',
        type: 'Maintenance',
        severity: 'low',
        status: 'resolved',
        date: 'Jul 12, 08:45',
        description: 'Routine maintenance per manufacturer specification.',
        rootCause: 'Scheduled maintenance cycle.',
        resolution: 'Synthesized high-temp grease applied.',
      },
      {
        id: 'inc-105',
        assetId: 'Chiller-C2',
        title: 'Chiller-C2 refrigerant leak detected',
        type: 'Incident',
        severity: 'critical',
        status: 'open',
        date: 'Jul 9, 22:14',
        description: 'Sensor flagged sudden suction pressure drop; leak confirmed near condenser.',
        rootCause: 'Micro-fracture in copper tubing.',
        resolution: 'Isolated loop 2; braze repair assigned.',
      },
    ],
  });

  // Create Manuals
  await prisma.manualDocument.createMany({
    data: [
      {
        id: 'man-1',
        assetId: 'Boiler-22',
        title: 'Boiler-22 Maintenance & Safety Manual',
        category: 'Equipment Manual',
        content: 'Safety limits: Max Operating Temperature 220°C, Max Operating Pressure 18.5 bar. Vibration threshold: 4.5 mm/s. Overpressure relief valve inspection mandated every 90 days. Flushing procedure requires 2-hour cooldown before chemical descaling.',
      },
      {
        id: 'man-2',
        assetId: 'Pump-101',
        title: 'Pump-101 Operations & Bearing Maintenance Guide',
        category: 'Operating Guide',
        content: 'Optimal vibration: under 2.5 mm/s. Recommended lubrication interval: 1,200 operating hours. Bearing temperature alarm limit set at 75°C. Impeller clearance check required during annual overhaul.',
      },
      {
        id: 'man-3',
        assetId: 'Chiller-C2',
        title: 'Chiller-C2 Technical Specifications & Fault Matrix',
        category: 'Troubleshooting',
        content: 'Refrigerant R-134a. Normal suction pressure: 3.2 - 4.1 bar. Pressure drops under 2.8 bar indicate refrigerant leak or expansion valve clogging. Emergency shutdown triggers when compressor oil temp exceeds 95°C.',
      },
      {
        id: 'man-4',
        title: 'Plant Emergency SOP & Isolation Protocol',
        category: 'Safety Standard',
        content: 'In case of Zone B pressure trip or Zone C coolant failure: 1. Notify Shift Lead. 2. Isolate main fuel feed valve within 90 seconds. 3. Engage secondary cooling bypass.',
      },
    ],
  });

  // Create Knowledge Graph Nodes
  const graphNodes = [
    { id: 'Boiler-22', name: 'Boiler-22', type: 'asset', x: 450, y: 220, r: 26 },
    { id: 'Pump-101', name: 'Pump-101', type: 'asset', x: 220, y: 120, r: 22 },
    { id: 'Compressor-X4', name: 'Compressor-X4', type: 'asset', x: 680, y: 130, r: 22 },
    { id: 'R. Kapoor', name: 'R. Kapoor', type: 'engineer', x: 300, y: 320, r: 18 },
    { id: 'A. Iyer', name: 'A. Iyer', type: 'engineer', x: 600, y: 330, r: 18 },
    { id: 'Manual-B22', name: 'Manual-B22', type: 'document', x: 150, y: 260, r: 16 },
    { id: 'SOP-Pressure', name: 'SOP-Pressure', type: 'document', x: 750, y: 260, r: 16 },
    { id: 'Failure-0472', name: 'Failure-0472', type: 'failure', x: 420, y: 90, r: 16 },
    { id: 'Failure-0398', name: 'Failure-0398', type: 'failure', x: 560, y: 60, r: 16 },
    { id: 'Valve Supplier Co.', name: 'Valve Supplier Co.', type: 'supplier', x: 100, y: 130, r: 16 },
  ];

  for (const node of graphNodes) {
    await prisma.graphNode.create({ data: node });
  }

  // Create Knowledge Graph Edges
  const graphEdges = [
    { source: 'Boiler-22', target: 'Pump-101', label: 'Feeds Water To' },
    { source: 'Boiler-22', target: 'Compressor-X4', label: 'Provides Steam To' },
    { source: 'Boiler-22', target: 'R. Kapoor', label: 'Assigned Lead' },
    { source: 'Boiler-22', target: 'A. Iyer', label: 'Inspected By' },
    { source: 'Boiler-22', target: 'Manual-B22', label: 'Governed By' },
    { source: 'Boiler-22', target: 'Failure-0472', label: 'Experienced' },
    { source: 'Boiler-22', target: 'Failure-0398', label: 'Experienced' },
    { source: 'Compressor-X4', target: 'SOP-Pressure', label: 'Refers To' },
    { source: 'Pump-101', target: 'Valve Supplier Co.', label: 'Sourced From' },
    { source: 'A. Iyer', target: 'SOP-Pressure', label: 'Author Of' },
  ];

  for (const edge of graphEdges) {
    await prisma.graphEdge.create({ data: edge });
  }

  console.log('✅ ForgeMind AI database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { GraphNode, GraphEdge } from '../../../shared/types';

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await api.get('/graph');
        setNodes(res.data.nodes);
        setEdges(res.data.edges);
      } catch (err) {
        console.error('Error loading graph:', err);
      }
    };
    fetchGraph();
  }, []);

  const colorMap: Record<string, string> = {
    asset: '#3b82f6',
    engineer: '#a855f7',
    document: '#0891b2',
    failure: '#ef4444',
    supplier: '#d97706',
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div>
        <div className="section-title text-base font-semibold">Knowledge Graph</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Relational network linking plant machinery, documents, failures, and support systems</div>
      </div>

      <div className="card border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl shadow-sm">
        {/* Legend */}
        <div className="kg-legend flex flex-wrap gap-4 mb-4">
          <div className="kg-legend-item flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <span className="kg-dot w-2 h-2 rounded-full" style={{ background: '#3b82f6' }}></span> Assets
          </div>
          <div className="kg-legend-item flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <span className="kg-dot w-2 h-2 rounded-full" style={{ background: '#a855f7' }}></span> Engineers
          </div>
          <div className="kg-legend-item flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <span className="kg-dot w-2 h-2 rounded-full" style={{ background: '#0891b2' }}></span> Documents
          </div>
          <div className="kg-legend-item flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <span className="kg-dot w-2 h-2 rounded-full" style={{ background: '#ef4444' }}></span> Failures
          </div>
          <div className="kg-legend-item flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
            <span className="kg-dot w-2 h-2 rounded-full" style={{ background: '#d97706' }}></span> Suppliers
          </div>
        </div>

        {/* Dynamic SVG Node-Edge Canvas */}
        <div className="relative border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface-secondary)]">
          <svg width="100%" height="460" viewBox="0 0 900 460">
            {/* Edges */}
            {edges.map((e) => {
              const sourceNode = nodes.find((n) => n.id === e.source);
              const targetNode = nodes.find((n) => n.id === e.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <g key={e.id || `${e.source}-${e.target}`}>
                  <line
                    x1={sourceNode.x || 100}
                    y1={sourceNode.y || 100}
                    x2={targetNode.x || 200}
                    y2={targetNode.y || 200}
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                  {e.label && (
                    <text
                      x={((sourceNode.x || 0) + (targetNode.x || 0)) / 2}
                      y={((sourceNode.y || 0) + (targetNode.y || 0)) / 2 - 4}
                      fill="var(--text-mute)"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const color = colorMap[n.type] || '#3b82f6';
              const radius = n.r || 20;
              const isSelected = selectedNode?.id === n.id;

              return (
                <g
                  key={n.id}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => setSelectedNode(n)}
                >
                  <circle
                    cx={n.x || 100}
                    cy={n.y || 100}
                    r={radius}
                    fill={`${color}12`}
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text
                    x={n.x || 100}
                    y={(n.y || 100) + radius + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--text)"
                    fontFamily="Inter"
                    fontWeight="500"
                  >
                    {n.name || n.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Floating Drawer */}
          {selectedNode && (
            <div className="absolute bottom-4 right-4 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl shadow-lg max-w-xs space-y-2">
              <div className="flex justify-between items-center gap-4">
                <span className="font-bold text-[var(--text)] text-xs truncate">{selectedNode.name || selectedNode.id}</span>
                <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded border" style={{ color: colorMap[selectedNode.type], borderColor: `${colorMap[selectedNode.type]}33`, background: `${colorMap[selectedNode.type]}08` }}>
                  {selectedNode.type}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-dim)] leading-normal">
                Relational entity mapped inside the platform knowledge graph.
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-full text-center text-[10.5px] font-semibold py-1 border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-dim)] hover:text-[var(--text)] rounded-lg transition-all"
              >
                Close Inspector
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

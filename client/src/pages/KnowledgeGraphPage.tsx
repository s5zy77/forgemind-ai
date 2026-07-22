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
    document: '#22d3ee',
    failure: '#ef4444',
    supplier: '#f59e0b',
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">Knowledge Graph</div>
        <div className="section-sub">Assets, engineers, documents, failures, and suppliers — unified relational graph</div>
      </div>

      <div className="card">
        {/* Legend */}
        <div className="kg-legend">
          <div className="kg-legend-item">
            <span className="kg-dot" style={{ background: '#3b82f6' }}></span> Assets
          </div>
          <div className="kg-legend-item">
            <span className="kg-dot" style={{ background: '#a855f7' }}></span> Engineers
          </div>
          <div className="kg-legend-item">
            <span className="kg-dot" style={{ background: '#22d3ee' }}></span> Documents
          </div>
          <div className="kg-legend-item">
            <span className="kg-dot" style={{ background: '#ef4444' }}></span> Failures
          </div>
          <div className="kg-legend-item">
            <span className="kg-dot" style={{ background: '#f59e0b' }}></span> Suppliers
          </div>
        </div>

        {/* Dynamic SVG Node-Edge Canvas */}
        <div className="relative border border-white/10 rounded-xl overflow-hidden bg-[#0d1622]">
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
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.5"
                  />
                  {e.label && (
                    <text
                      x={((sourceNode.x || 0) + (targetNode.x || 0)) / 2}
                      y={((sourceNode.y || 0) + (targetNode.y || 0)) / 2 - 4}
                      fill="#8b96a8"
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
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => setSelectedNode(n)}
                >
                  <circle
                    cx={n.x || 100}
                    cy={n.y || 100}
                    r={radius}
                    fill={`${color}33`}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1.8}
                  />
                  <text
                    x={n.x || 100}
                    y={(n.y || 100) + radius + 14}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#c7d0dc"
                    fontFamily="Inter"
                  >
                    {n.name || n.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Floating Drawer */}
          {selectedNode && (
            <div className="absolute bottom-4 right-4 bg-[#111827] border border-white/20 p-4 rounded-xl shadow-2xl max-w-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{selectedNode.name || selectedNode.id}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded" style={{ color: colorMap[selectedNode.type] }}>
                  {selectedNode.type}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Connected relational node in ForgeMind industrial knowledge graph.
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-full text-center text-xs py-1 text-slate-400 hover:text-white"
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

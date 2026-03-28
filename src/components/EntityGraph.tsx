import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Entity, Relationship } from '../types';

interface EntityGraphProps {
  entities: Entity[];
  relationships: Relationship[];
}

interface Node extends d3.SimulationNodeDatum, Entity {}
interface Link extends d3.SimulationLinkDatum<Node> {
  type: string;
}

export const EntityGraph: React.FC<EntityGraphProps> = ({ entities, relationships }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !entities.length) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    svg.selectAll('*').remove();

    const nodes: Node[] = entities.map(d => ({ ...d }));
    const links: Link[] = relationships.map(d => ({
      source: d.source,
      target: d.target,
      type: d.type
    }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 12)
      .attr('fill', d => {
        switch (d.type) {
          case 'company': return '#3b82f6';
          case 'person': return '#ef4444';
          case 'sector': return '#10b981';
          case 'government': return '#f59e0b';
          default: return '#6b7280';
        }
      });

    node.append('text')
      .text(d => d.name)
      .attr('x', 15)
      .attr('y', 5)
      .attr('stroke', 'none')
      .attr('fill', '#333')
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    node.append('title')
      .text(d => `${d.name} (${d.type})\n${d.description || ''}`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, [entities, relationships]);

  return (
    <div className="w-full h-[600px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

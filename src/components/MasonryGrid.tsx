
import { useState, useEffect, useRef } from 'react';

interface MasonryGridProps {
  children: React.ReactNode[];
  columnCount?: {
    default: number;
    1536: number;
    1024: number;
    640: number;
  };
  gap?: number;
}

const MasonryGrid = ({ 
  children, 
  columnCount = { default: 4, 1536: 3, 1024: 2, 640: 1 },
  gap = 24 
}: MasonryGridProps) => {
  const [columns, setColumns] = useState<React.ReactNode[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getColumnCount = () => {
    if (typeof window === 'undefined') return columnCount.default;
    
    const width = window.innerWidth;
    if (width <= 640) return columnCount[640];
    if (width <= 1024) return columnCount[1024];
    if (width <= 1536) return columnCount[1536];
    return columnCount.default;
  };

  const distributeItems = () => {
    const numColumns = getColumnCount();
    const newColumns: React.ReactNode[][] = Array.from({ length: numColumns }, () => []);
    const columnHeights = new Array(numColumns).fill(0);

    children.forEach((child, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(child);
      
      // Estimate height increase (this is approximate)
      // In a real implementation, you might want to measure actual heights
      columnHeights[shortestColumnIndex] += 200; // Estimated item height
    });

    setColumns(newColumns);
  };

  useEffect(() => {
    distributeItems();
  }, [children]);

  useEffect(() => {
    const handleResize = () => {
      distributeItems();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  return (
    <div 
      ref={containerRef}
      className="flex"
      style={{ gap: `${gap}px` }}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;

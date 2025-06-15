
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  items: any[];
  itemsPerPage?: number;
  threshold?: number;
}

export const useInfiniteScroll = ({ 
  items, 
  itemsPerPage = 6, 
  threshold = 100 
}: UseInfiniteScrollProps) => {
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initialize with first batch
  useEffect(() => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setCurrentPage(1);
    setHasMore(items.length > itemsPerPage);
  }, [items, itemsPerPage]);

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = items.slice(startIndex, endIndex);
      
      if (newItems.length > 0) {
        setDisplayedItems(prev => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < items.length);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 300);
  }, [items, currentPage, itemsPerPage, loading, hasMore]);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMoreItems();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [loadMoreItems, loading, hasMore, threshold]);

  return {
    displayedItems,
    loading,
    hasMore,
    loadMore: loadMoreItems
  };
};

// Simple throttle function
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return function (...args: any[]) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

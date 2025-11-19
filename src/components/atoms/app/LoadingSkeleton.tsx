import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'table' | 'card' | 'list';
}

export default function LoadingSkeleton({ rows = 3, type = 'list' }: LoadingSkeletonProps) {
  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2 py-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-gray-200';

  const variants = {
    text: 'h-4 w-full rounded',
    rect: 'h-32 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    />
  );
};

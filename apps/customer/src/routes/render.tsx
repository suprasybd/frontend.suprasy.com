import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

const RenderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    document.body.style.overflow = 'scroll';
  }, []);
  return children;
};

export const Route = createFileRoute('/render')({
  component: () => {
    return (
      <RenderWrapper>
        <Outlet />
      </RenderWrapper>
    );
  },
});

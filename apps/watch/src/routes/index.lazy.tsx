import React from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { WatchUI } from 'ui';

const { Homepage } = WatchUI;

const Index = () => {
  return <Homepage />;
};

export const Route = createLazyFileRoute('/')({
  component: Index,
});

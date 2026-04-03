import React from 'react';
import { useAppStore } from '../store/appStore';

export function StrongLine() {
  return <hr className="h-1 bg-primary rounded my-6" style={{ backgroundColor: 'var(--primary)' }} />;
}

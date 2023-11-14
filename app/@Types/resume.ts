import React from 'react';

interface WorkInfo {
  company: string;
  date: string;
  role: string;
  position: string;
  description: string[];
  link?: string;
}

interface WorkContent {
  title: string;
  list: React.ReactNode[];
}

export interface WorkItem {
  info: WorkInfo;
  content: WorkContent[];
}

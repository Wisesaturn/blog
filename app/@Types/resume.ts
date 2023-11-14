import React from 'react';

interface ProjectInfo {
  teamName: string;
  date: string;
  role: string;
  position: string;
  description: string[];
  link?: string;
  linkAlt?: string;
  techStack?: string[];
  isAwarded?: boolean;
}

interface ProjectContent {
  title: string;
  list: React.ReactNode[];
}

export interface ProjectItem {
  info: ProjectInfo;
  content: ProjectContent[];
}

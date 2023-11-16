import React from 'react';

interface ProjectInfo {
  teamName: string;
  date: string;
  role?: string;
  position?: string;
  description: string[];
  link?: string;
  linkAlt?: string;
  techStack?: string[];
  isAwarded?: boolean;
  thumbnail?: string;
}

interface ProjectContent {
  title: string;
  list: React.ReactNode[];
}

export interface ProjectItem {
  info: ProjectInfo;
  content: ProjectContent[];
}

export interface TextItem {
  title: string;
  position: string;
  tasks: React.ReactNode[];
  date?: string;
  link?: string;
  linkAlt?: string;
  thumbnail?: string;
}

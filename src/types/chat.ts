export type Role = 'user' | 'assistant' | 'system';

export type ArtifactType = 'code' | 'react' | 'svg' | 'markdown' | 'html';

export interface Artifact {
  id: string;
  identifier: string;
  title: string;
  type: ArtifactType;
  language: string;
  content: string;
  version: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  thinking?: string;
  createdAt: string;
  artifacts?: Artifact[];
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  customInstructions: string;
  documentsCount: number;
  createdAt: string;
}

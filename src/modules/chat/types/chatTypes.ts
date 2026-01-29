/**
 * Chat API Types
 */

export interface ChatQueryPayload {
  question: string;
  sessionId: string;
  userId: string;
  files?: File[];
}

export interface ChatQueryResponse {
  answer: string;
  sessionId: string;
  timestamp: string;
  sources?: Array<{
    title: string;
    content: string;
    relevance: number;
  }>;
}

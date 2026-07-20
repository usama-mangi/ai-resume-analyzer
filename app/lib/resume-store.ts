import { create } from 'zustand';
import type { GeneratedResume } from 'types';

interface ResumeStore {
  // Map of resumeId → generated content + version counter
  resumes: Record<string, { content: GeneratedResume; version: number }>;
  updateResume: (id: string, content: GeneratedResume) => void;
  getVersion: (id: string) => number;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumes: {},

  updateResume: (id, content) =>
    set((state) => ({
      resumes: {
        ...state.resumes,
        [id]: {
          content,
          version: (state.resumes[id]?.version ?? 0) + 1,
        },
      },
    })),

  getVersion: (id) => get().resumes[id]?.version ?? 0,
}));

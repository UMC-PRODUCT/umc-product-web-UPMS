import { create } from 'zustand';

import type { SavedProjectDraft } from './types';

type DraftStoreState = {
  saved: SavedProjectDraft | null;
  save: (draft: SavedProjectDraft) => void;
  clear: () => void;
};

// TODO: 임시 저장 API 연동. 지금은 화면 안에서만 임시 저장본을 유지함
export const useProjectDraftStore = create<DraftStoreState>()((set) => ({
  saved: null,
  save: (saved) => set({ saved }),
  clear: () => set({ saved: null }),
}));

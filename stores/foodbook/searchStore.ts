import {create} from 'zustand';

type SearchState = {
  focus: boolean;
  toggleFocusState: () => void;
};

export const useSearchStore = create<SearchState>(set => ({
  focus: false,
  toggleFocusState: () => set(({focus}) => ({focus: !focus})),
}));

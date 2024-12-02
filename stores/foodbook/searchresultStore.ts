import {SearchResult} from '@/types';
import {create} from 'zustand';

// Define the state shape and associated actions for the store
type SearchResultState = {
  searchResult: SearchResult;
  setSearchResults: (newSearchResults: SearchResult) => void;
};

// Create the Zustand store with typed state and actions
export const useSearchResultStore = create<SearchResultState>(set => ({
  searchResult: null,
  setSearchResults: newSearchResults => set({searchResult: newSearchResults}),
}));

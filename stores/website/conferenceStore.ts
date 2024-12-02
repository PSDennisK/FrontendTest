import {Conference} from '@/types';
import {create} from 'zustand';

type ConferenceStore = {
  conferences: Conference[];
  currentDate: string;
  setCurrentDate: (newCurrentDate: string) => void;
  setConferences: (newConferences: Conference[]) => void;
};

export const useConferenceStore = create<ConferenceStore>(set => ({
  conferences: [],
  currentDate: '',
  setCurrentDate: newCurrentDate => set({currentDate: newCurrentDate}),
  setConferences: newConferences => set({conferences: newConferences}),
}));

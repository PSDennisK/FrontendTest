export type Poll = {
  id: string;
  club_profile_id: null;
  selection_method: string;
  question: string;
  status: string;
  choices: Choice[];
};

export type Choice = {
  id: string;
  choice: string;
};

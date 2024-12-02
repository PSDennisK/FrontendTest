export type DialInInformation = {
  dial_in_number: string;
  dial_in_id: string;
  dial_in_passcode: string;
  presenter_dial_in_number: string;
  presenter_dial_in_id: string;
  presenter_dial_in_passcode: string;
};

export type Presenter = {
  presenter_id: string;
  member_id: string;
  conference_id: string;
  display_name: string;
  display_on_landing_page: boolean;
  first_name: string;
  last_name: string;
  email: string;
  presenter_url: string;
  presenter_dial_in_number: string;
  presenter_dial_in_id: string;
  presenter_dial_in_passcode: string;
  title: null | string;
  bio: null | string;
  can_manage: boolean;
  is_moderator: boolean;
  facebook: null;
  twitter: null;
  linkedin: null;
  website: null | string;
};

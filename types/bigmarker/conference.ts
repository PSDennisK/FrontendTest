import {DialInInformation, Poll, Presenter, WebinarStats} from '@/types';

export type Conference = {
  id: string;
  title: string;
  event_type: string;
  language: string;
  meeting_mode: boolean;
  type: string;
  copy_webinar_id: string;
  master_webinar_id: null;
  max_attendance: number;
  purpose: string;
  start_time: Date;
  duration: number;
  conference_address: string;
  banner_filter_percentage: string;
  custom_event_id: null;
  channel_id: string;
  webcast_mode: string;
  presenter_exit_url: string;
  end_time: Date;
  moderator_open_time: Date;
  audience_open_time: Date;
  first_admin_enter_time: null;
  manual_end_time: null;
  dial_in_information: DialInInformation;
  time_zone: string;
  privacy: string;
  exit_url: string;
  enable_registration_email: boolean;
  enable_knock_to_enter: boolean;
  send_reminder_emails_to_presenters: boolean;
  enable_review_emails: boolean;
  can_view_poll_results: boolean;
  enable_ie_safari: boolean;
  enable_twitter: boolean;
  auto_invite_all_channel_members: boolean;
  send_cancellation_email: boolean;
  show_reviews: boolean;
  recording_url: string;
  registration_required_to_view_recording: boolean;
  recording_iframe: null;
  who_can_watch_recording: string;
  show_handout_on_page: boolean;
  background_image_url: string;
  fb_open_graph_image_url: string;
  agenda_topics: string[];
  preload_files: any[];
  disclaimer: null;
  presenters: Presenter[];
  recorded: boolean;
  webinar_stats: WebinarStats;
  associated_series: any[];
  tags: any[];
  polls: Poll[];
  auto_publish_time: null;
  auto_unpublish_time: null;
  last_publish_time: null;
  last_unpublish_time: null;
  is_recording_published: null;
};
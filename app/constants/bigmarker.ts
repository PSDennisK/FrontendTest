const BIGMARKER_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BIGMARKER_API_URL,
  API_KEY: process.env.NEXT_PUBLIC_BIGMARKER_API_KEY,
  ENDPOINTS: {
    CONFERENCE: {
      LIST: '/?per_page=:per_page',
      MONTH: '/?start_time=:start_time&end_time=:end_time',
    },
  },
};

export default BIGMARKER_CONFIG;

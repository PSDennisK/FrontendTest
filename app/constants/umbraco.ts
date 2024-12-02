const UMBRACO_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_DELIVERY_API_URL,
  FORM_URL: process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_URL,
  FORM_API_KEY: process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_KEY,
  ENDPOINTS: {
    CONTENT: {
      ROOT: '/',
      ITEM: '/item/:pathorid',
      HOME: '/item/home',
    },
    FORM: {
      FIELDS: '/delivery/api/v1/definitions/:formid?culture=:locale',
      SUBMIT: '/delivery/api/v1/definitions/:formid/entries',
    },
  },
};

export default UMBRACO_CONFIG;

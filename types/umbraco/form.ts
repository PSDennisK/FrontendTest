export type Form = {
  id: string;
  form: string;
};

export type UmbracoForm = {
  disableDefaultStylesheet: boolean;
  fieldIndicationType: string;
  hideFieldValidation: boolean;
  id: string;
  indicator: string;
  messageOnSubmit: string;
  messageOnSubmitIsHtml: boolean;
  name: string;
  nextLabel: string;
  pages: UmbracoFormPage[];
  previousLabel: string;
  showValidationSummary: boolean;
  submitLabel: string;
};

export type UmbracoFormPage = {
  caption: string;
  fieldsets: UmbracoFormFieldset[];
};

export type UmbracoFormFieldset = {
  caption: string;
  columns: UmbracoFormColumn[];
  id: string;
};

export type UmbracoFormColumn = {
  caption: string;
  fields: UmbracoFormField[];
  width: number;
};

export type UmbracoFormField = {
  alias: string;
  caption: string;
  helpText: string;
  id: string;
  pattern: string;
  patternInvalidErrorMessage: string;
  preValues: UmbracoFormFieldValue[];
  required: boolean;
  requiredErrorMessage: string;
  settings: UmbracoFormSettings;
  type: UmbracoFormType;
  cssClass?: string;
};

export type UmbracoFormFieldValue = {
  caption: string;
  value: string;
};

export type UmbracoFormSettings = {
  defaultValue?: string;
  placeholder?: string;
  showLabel: string;
  maximumLength?: string;
  fieldType?: string;
  autocompleteAttribute?: string;
  numberOfRows?: string;
  saveScore?: string;
  scoreThreshold?: string;
  theme?: string;
  size?: string;
  allowMultipleSelections?: string;
  selectPrompt: string;
};

export type UmbracoFormType = {
  id: string;
  name: string;
  renderInputType: string;
  supportsPreValues: boolean;
  supportsUploadTypes: boolean;
};

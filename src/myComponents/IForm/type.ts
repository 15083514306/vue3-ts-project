interface options {
  value: string;
  label: string;
  children?: options[];
  disabled?: boolean;
}

interface formItemAttrs extends IAny {
  options?: options[];
}

export interface IFromConfig {
  label: string;
  key: string;
  type: string;
  slot?: string;
  hide?: boolean;
  layoutAttrs?: any;
  formItemAttrs?: formItemAttrs;
  formItemListeners?: any;
  [t: string]: any;
}

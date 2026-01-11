
export interface InquiryCategory {
  id: string;
  emoji: string;
  label: string;
  description: string;
  template: string;
}

export interface AppSettings {
  ngoName: string;
  ngoPhone: string;
  primaryColor: string;
  languages: string[];
}

export interface InquiryStat {
  category: string;
  count: number;
}

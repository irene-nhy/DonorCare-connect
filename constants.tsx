
import { InquiryCategory, AppSettings } from './types';

export const DEFAULT_CATEGORIES: InquiryCategory[] = [
  {
    id: 'callback',
    emoji: '📞',
    label: 'Request a Callback',
    description: 'Schedule a time for our donor care team to call you directly.',
    template: "I would like to request a callback to discuss my support. I have some questions that would be easier to talk through over the phone."
  },
  {
    id: 'tax',
    emoji: '📄',
    label: 'Tax Receipt Request',
    description: 'Get your tax exemption receipts for recent donations.',
    template: "I'd like to request my tax exemption receipt for donations made recently. Please send it to my email address on file."
  },
  {
    id: 'details',
    emoji: '✏️',
    label: 'Donation Update',
    description: 'Change your payment method or donation amount.',
    template: "I would like to update my donation details (amount/payment method). Please let me know the process."
  },
  {
    id: 'general',
    emoji: '💬',
    label: 'General Question',
    description: 'Ask us anything about our mission or projects.',
    template: "I have a general question about your organization and the work you do."
  },
  {
    id: 'feedback',
    emoji: '🌟',
    label: 'Fundraiser Feedback',
    description: 'Share your experience with our team in the field.',
    template: "I recently had an experience with one of your fundraisers and wanted to share some feedback."
  },
  {
    id: 'impact',
    emoji: '📊',
    label: 'Impact Report',
    description: 'See how your contributions are making a difference.',
    template: "I'm interested in receiving the latest impact report to see the results of our collective efforts."
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  ngoName: "Global Hope Foundation",
  ngoPhone: "60176560643",
  primaryColor: "#FF8B7B",
  languages: ["English", "Spanish", "French"]
};

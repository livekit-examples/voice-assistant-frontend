import type { AppConfig } from './lib/types';

export const APP_CONFIG: AppConfig = {
  companyName: 'LiveKit',
  pageTitle: 'Voice Assistant',
  pageDescription: 'A voice assistant built with LiveKit',

  suportsChatInput: false,
  suportsVideoInput: false,
  suportsScreenShare: false,

  logo: '/lk-logo.svg',
  accent: '#002cf2',
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',
};

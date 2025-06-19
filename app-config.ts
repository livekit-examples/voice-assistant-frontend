import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'LiveKit',
  pageTitle: 'Voice Assistant',
  pageDescription: 'A voice assistant built with LiveKit',

  suportsChatInput: true,
  suportsVideoInput: true,
  suportsScreenShare: true,

  logo: '/lk-logo.svg',
  accent: '#002cf2',
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',
};

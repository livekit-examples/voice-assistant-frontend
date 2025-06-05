import { Metadata, ResolvingMetadata } from 'next';
import { App } from '@/components/app';
import { getAppConfig } from '@/lib/utils';

export async function generateMetadata(_props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const { pageTitle, pageDescription } = await getAppConfig();
  const parentMetadata = await parent;

  return {
    ...parentMetadata,
    title: pageTitle,
    description: pageDescription + '\n\nBuilt with LiveKit Agents.',
  } as Metadata;
}

export default async function Page() {
  const appConfig = await getAppConfig();

  return <App appConfig={appConfig} />;
}

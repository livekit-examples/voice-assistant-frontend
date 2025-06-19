import { headers } from 'next/headers';
import { App } from '@/components/app';
import { getAppConfig, getOrigin } from '@/lib/utils';

export default async function Page() {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  const appConfig = await getAppConfig(origin);

  return <App appConfig={appConfig} />;
}

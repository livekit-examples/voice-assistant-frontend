'use client';

import { toast as sonnerToast } from 'sonner';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { Alert, AlertTitle } from './ui/alert';

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
}

export function toastAlert(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom(
    (id) => <AlertToast id={id} title={toast.title} description={toast.description} />,
    { duration: 10_000 }
  );
}

function AlertToast(props: ToastProps) {
  const { title, id } = props;

  return (
    <Alert onClick={() => sonnerToast.dismiss(id)} className="bg-accent">
      <WarningIcon weight="bold" />
      <AlertTitle>{title}</AlertTitle>
      {/* <AlertDescription>{description}</AlertDescription> */}
    </Alert>
  );
}

import { notFound } from 'next/navigation';
import MobileAuthForm from './form';

export default async function MobileAuthPage({ params }: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (mode !== 'login' && mode !== 'register') notFound();
  return <MobileAuthForm register={mode === 'register'} />;
}

'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';

export default function MobileAuthForm({ register }: { register: boolean }) {
  const { data: session, status, update } = useSession();
  const captcha = useRef<ReCAPTCHA>(null);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaSlow, setCaptchaSlow] = useState(false);

  useEffect(() => {
    if (!register || captchaReady) return;
    const timer = setTimeout(() => setCaptchaSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [register, captchaReady]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get('email') || '').trim().toLowerCase();
    const password = String(fields.get('password') || '');
    setError('');
    if (register && !token) {
      setError('Please complete the CAPTCHA.');
      return;
    }
    setBusy(true);
    try {
      if (register) {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: String(fields.get('name') || '').trim(),
            organization: String(fields.get('organization') || '').trim(),
            email, password, recaptchaToken: token,
          }),
        });
        const result = await response.json();
        if (!response.ok || result.err || !result.msg) {
          throw new Error(result.err || 'Registration failed. Please try again.');
        }
        form.reset();
        setRegistered(true);
      } else {
        const result = await signIn('credentials', { email, password, redirect: false });
        if (!result?.ok || result.error) {
          throw new Error(result?.error === 'ACCOUNT_DEACTIVATED'
            ? 'Your account is inactive. Please contact ANTUF.'
            : 'Unable to sign in. Check your email and password.');
        }
        form.reset();
        await update();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to connect. Please try again.');
    } finally {
      setBusy(false);
      if (register) {
        captcha.current?.reset();
        setToken(null);
      }
    }
  }

  return <Box component="main" sx={{ minHeight: '100dvh', bgcolor: '#f7f7f7', p: 2 }}>
    <Box sx={{ maxWidth: 480, mx: 'auto', py: 3 }}>
      <Typography sx={{ color: '#b71c1c', fontWeight: 900, letterSpacing: 2 }}>ANTUF</Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 800, color: '#202020' }}>
        {session ? 'Your account' : register ? 'Create an account' : 'Welcome back'}
      </Typography>
      <Typography sx={{ mt: 1, mb: 3, color: 'text.secondary' }}>
        {session ? 'You are signed in to ANTUF.' : 'Connect with your union and stay informed.'}
      </Typography>
      {status === 'loading' ? <CircularProgress aria-label="Loading account" /> : session ?
        <Stack spacing={2}>
          <Alert severity="success">Signed in as {session.user?.name || session.user?.email}</Alert>
          <Button variant="outlined" onClick={() => signOut({ redirect: false })}>Log out</Button>
          <Typography>You can return to the app using the back arrow.</Typography>
        </Stack> : registered ?
        <Stack spacing={2}>
          <Alert severity="success">Your account was created. You can now log in.</Alert>
          <Button component={Link} href="/mobile/auth/login" variant="contained">Continue to login</Button>
        </Stack> :
        <Box component="form" onSubmit={submit}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error" role="alert">{error}</Alert>}
            {register && <TextField label="Full name" name="name" autoComplete="name" required disabled={busy} />}
            <TextField label="Email" name="email" type="email" autoComplete="email" required disabled={busy} />
            <TextField label="Password" name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} required disabled={busy}
              slotProps={{ htmlInput: { minLength: register ? 6 : 1 } }} helperText={register ? 'Use at least 6 characters.' : undefined} />
            {register && <TextField label="Organization / Union" name="organization" autoComplete="organization" required disabled={busy} />}
            {register && <ReCAPTCHA ref={captcha}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              asyncScriptOnLoad={() => setCaptchaReady(true)}
              onChange={setToken} onExpired={() => setToken(null)}
              onErrored={() => { setToken(null); setError('CAPTCHA could not load. Check your connection and reload the page.'); }} />}
            {register && !captchaReady && <Alert severity={captchaSlow ? 'warning' : 'info'}
              action={captchaSlow ? <Button onClick={() => window.location.reload()}>Reload</Button> : undefined}>
              {captchaSlow ? 'CAPTCHA could not load. Check your internet connection, then reload.' : 'Loading CAPTCHA…'}
            </Alert>}
            <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ bgcolor: '#b71c1c' }}>
              {busy ? 'Please wait…' : register ? 'Create account' : 'Login'}
            </Button>
            <Button component={Link} href={register ? '/mobile/auth/login' : '/mobile/auth/register'} disabled={busy}>
              {register ? 'Already have an account? Login' : 'New to ANTUF? Register'}
            </Button>
          </Stack>
        </Box>}
    </Box>
  </Box>;
}

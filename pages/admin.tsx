import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminTemplateForm from '../components/AdminTemplateForm';
import { Session } from '@supabase/supabase-js';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  if (!session) {
    return <button onClick={() => supabase.auth.signInWithOtp({ email: prompt('Enter your admin email')! })}>Sign In</button>;
  }

  const teamId = session.user?.user_metadata?.team_id;

  return <AdminTemplateForm teamId={teamId} />;
}
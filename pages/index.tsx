//////////////// pages/index.tsx //////////////////
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import TemplateList from '../components/TemplateList';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (session) {
      supabase.from('templates')
        .select('*')
        .eq('team_id', session.user?.user_metadata?.team_id)
        .then(({ data }) => setTemplates(data || []));
    }
  }, [session]);

  if (!session) {
    return <button onClick={() => supabase.auth.signInWithOtp({ email: prompt('Enter your work email')! })}>Sign In</button>;
  }

  return <TemplateList templates={templates} />;
}

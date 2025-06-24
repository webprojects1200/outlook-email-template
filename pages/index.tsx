import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import TemplateList from '../components/TemplateList';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState('');

  useEffect(() => {
    // Handle magic link redirect if present
    supabase.auth.exchangeCodeForSession(window.location.href).then(({ data, error }) => {
      if (error) console.error('Error handling magic link:', error.message);
      if (data?.session) setSession(data.session);
    });

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

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.trim() || !session) return;
    const { error } = await supabase.from('templates').insert([
      {
        content: newTemplate,
        team_id: session.user?.user_metadata?.team_id,
        user_id: session.user?.id,
      },
    ]);
    if (!error) {
      setNewTemplate('');
      // Refresh templates
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('team_id', session.user?.user_metadata?.team_id);
      setTemplates(data || []);
    }
  };

  if (!session) {
    return (
      <div className="p-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            const email = prompt('Enter your work email');
            if (email) {
              supabase.auth.signInWithOtp({ email });
            }
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <form onSubmit={handleAddTemplate} className="mb-4">
        <textarea
          className="border rounded w-full p-2 mb-2"
          placeholder="Enter new email template..."
          value={newTemplate}
          onChange={e => setNewTemplate(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Template
        </button>
      </form>
      <TemplateList templates={templates} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import TemplateList from '../components/TemplateList';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');

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
        subject,
        cc,
        bcc,
        team_id: session.user?.user_metadata?.team_id,
        user_id: session.user?.id,
      },
    ]);
    if (!error) {
      setNewTemplate('');
      setSubject('');
      setCc('');
      setBcc('');
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
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="CC (comma separated)"
          value={cc}
          onChange={e => setCc(e.target.value)}
        />
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="BCC (comma separated)"
          value={bcc}
          onChange={e => setBcc(e.target.value)}
        />
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

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import TemplateList from '../components/TemplateList';

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');

  useEffect(() => {
    supabase
      .from('templates')
      .select('*')
      .then(({ data }) => setTemplates(data || []));
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !newTemplate.trim()) return;
    const { error } = await supabase.from('templates').insert([
      {
        title,
        content: newTemplate,
        subject,
        cc,
        bcc,
      },
    ]);
    if (!error) {
      setTitle('');
      setNewTemplate('');
      setSubject('');
      setCc('');
      setBcc('');
      // Refresh templates
      const { data } = await supabase
        .from('templates')
        .select('*');
      setTemplates(data || []);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleAddTemplate} className="mb-4">
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
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
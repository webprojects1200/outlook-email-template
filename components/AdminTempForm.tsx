import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminTemplateForm({ teamId }: { teamId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const { error } = await supabase.from('templates').insert({
      title,
      description,
      body,
      team_id: teamId
    });
    if (!error) {
      setTitle('');
      setDescription('');
      setBody('');
      setSuccess(true);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Create New Template</h1>
      {success && <p className="text-green-600">Template saved!</p>}
      <input className="w-full border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input className="w-full border p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <textarea className="w-full border p-2" placeholder="Body (HTML or plain text)" rows={5} value={body} onChange={e => setBody(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save Template</button>
    </div>
  );
}
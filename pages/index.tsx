import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editCc, setEditCc] = useState('');
  const [editBcc, setEditBcc] = useState('');
  const [editContent, setEditContent] = useState('');

  // Fetch templates helper
  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('templates').select('*');
    console.log('Fetched templates:', data, 'Error:', error);
    if (error) {
      console.error('Error fetching templates:', error);
      alert('Error fetching templates: ' + error.message);
      // Do not clear the list on error
      return;
    } else {
      setTemplates(data || []);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !newTemplate.trim()) return;
    const { data, error } = await supabase.from('templates').insert([
      {
        title,
        content: newTemplate,
        subject,
        cc,
        bcc,
      },
    ]);
    console.log('Insert result:', { data, error });
    if (error) {
      alert('Error adding template: ' + error.message);
      return;
    }
    setTitle('');
    setNewTemplate('');
    setSubject('');
    setCc('');
    setBcc('');
    // Refresh templates
    await fetchTemplates();
  };

  const startEdit = (template: any) => {
    setEditingId(template.id);
    setEditTitle(template.title);
    setEditSubject(template.subject || '');
    setEditCc(template.cc || '');
    setEditBcc(template.bcc || '');
    setEditContent(template.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditSubject('');
    setEditCc('');
    setEditBcc('');
    setEditContent('');
  };

  const handleEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim() || !editContent.trim()) return;
    const updateData: any = {
      title: editTitle,
      subject: editSubject,
      cc: editCc,
      bcc: editBcc,
      content: editContent,
    };
    const { data, error } = await supabase.from('templates').update(updateData).eq('id', editingId);
    console.log('Update result:', { data, error });
    if (error) {
      alert('Error updating template: ' + error.message);
      return;
    }
    cancelEdit();
    // Refresh templates
    await fetchTemplates();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100">
      <div className="w-full max-w-6xl px-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Column */}
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleAddTemplate} className="mb-6 space-y-4 bg-white shadow-2xl rounded-2xl px-6 pt-8 pb-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Email Template</h2>
              <input
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 mb-2 text-gray-700 placeholder-gray-400 transition"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <input
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 mb-2 text-gray-700 placeholder-gray-400 transition"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <input
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 mb-2 text-gray-700 placeholder-gray-400 transition"
                placeholder="CC (comma separated)"
                value={cc}
                onChange={e => setCc(e.target.value)}
              />
              <input
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 mb-2 text-gray-700 placeholder-gray-400 transition"
                placeholder="BCC (comma separated)"
                value={bcc}
                onChange={e => setBcc(e.target.value)}
              />
              <textarea
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 mb-2 text-gray-700 placeholder-gray-400 transition resize-none"
                placeholder="Enter new email template..."
                value={newTemplate}
                onChange={e => setNewTemplate(e.target.value)}
                rows={5}
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md w-full transition"
              >
                Add Template
              </button>
            </form>
          </div>
          {/* List Column */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">List of Email Templates</h2>
              <ul className="space-y-4">
                {templates.length === 0 && (
                  <li className="text-gray-400 text-center">No templates yet.</li>
                )}
                {templates.map((template) => (
                  <li key={template.id} className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-green-50">
                    {editingId === template.id ? (
                      <form onSubmit={handleEditTemplate} className="space-y-2">
                        <input
                          className="border rounded w-full p-2 mb-1"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          required
                        />
                        <input
                          className="border rounded w-full p-2 mb-1"
                          value={editSubject}
                          onChange={e => setEditSubject(e.target.value)}
                          placeholder="Subject"
                        />
                        <input
                          className="border rounded w-full p-2 mb-1"
                          value={editCc}
                          onChange={e => setEditCc(e.target.value)}
                          placeholder="CC"
                        />
                        <input
                          className="border rounded w-full p-2 mb-1"
                          value={editBcc}
                          onChange={e => setEditBcc(e.target.value)}
                          placeholder="BCC"
                        />
                        <textarea
                          className="border rounded w-full p-2 mb-1"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows={3}
                          required
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                          <button type="button" onClick={cancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-lg text-blue-700">{template.title}</span>
                          <span className="text-xs text-gray-400">{template.subject}</span>
                        </div>
                        <div className="mb-1 text-gray-600 whitespace-pre-line">{template.content}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                          {template.cc && <span><span className="font-semibold">CC:</span> {template.cc}</span>}
                          {template.bcc && <span><span className="font-semibold">BCC:</span> {template.bcc}</span>}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                            onClick={() => {
                              navigator.clipboard.writeText(template.content);
                              alert('Template copied to clipboard!');
                            }}
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                            onClick={() => startEdit(template)}
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
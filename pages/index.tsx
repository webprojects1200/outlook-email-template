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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editCc, setEditCc] = useState('');
  const [editBcc, setEditBcc] = useState('');
  const [editContent, setEditContent] = useState('');
  const [section, setSection] = useState('');
  const [editSection, setEditSection] = useState('');

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
    // Set up real-time subscription
    const channel = supabase.channel('public:templates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, () => {
        fetchTemplates();
      })
      .subscribe();
    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
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
        section,
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
    setSection('');
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
    setEditSection(template.section || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditSubject('');
    setEditCc('');
    setEditBcc('');
    setEditContent('');
    setEditSection('');
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
      section: editSection,
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

  // Delete template handler
  const handleDeleteTemplate = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      alert('Error deleting template: ' + error.message);
      return;
    }
    // No need to call fetchTemplates here, real-time should update
  };

  // Get unique sections from templates
  const sectionOptions = Array.from(new Set(templates.map(t => t.section).filter(Boolean)));
  // If the current section is no longer in the options, clear it
  useEffect(() => {
    if (section && !sectionOptions.includes(section)) {
      setSection('');
    }
  }, [sectionOptions.join(','), section]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100">
      <div className="w-full max-w-6xl px-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Column */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:self-start lg:z-10">
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="section-input">Section</label>
                <div className="flex items-center gap-2">
                  <input
                    id="section-input"
                    className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg w-full p-3 text-gray-700 placeholder-gray-400 transition"
                    placeholder="e.g. HR, Sales, Support"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    list="section-options"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setSection('')}
                    title="Clear section"
                  >
                    Clear
                  </button>
                </div>
                <datalist id="section-options">
                  {sectionOptions.map(option => (
                    <option value={option} key={option} />
                  ))}
                </datalist>
              </div>
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
              <TemplateList 
                templates={templates} 
                onDelete={handleDeleteTemplate} 
                onEdit={startEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
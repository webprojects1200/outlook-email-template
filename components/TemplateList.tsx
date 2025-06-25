import { FC } from 'react';

const TemplateList: FC<{
  templates: any[];
  onDelete: (id: string) => void;
  onEdit: (tpl: any) => void;
}> = ({ templates, onDelete, onEdit }) => {
  const openMailto = (tpl: any) => {
    const subject = encodeURIComponent(tpl.subject || '');
    const body = encodeURIComponent(tpl.content || '');
    const cc = encodeURIComponent(tpl.cc || '');
    const bcc = encodeURIComponent(tpl.bcc || '');
    let mailto = `mailto:?subject=${subject}&body=${body}`;
    if (cc) mailto += `&cc=${cc}`;
    if (bcc) mailto += `&bcc=${bcc}`;
    window.location.href = mailto;
  };

  // Group templates by section
  const grouped = templates.reduce((acc, tpl) => {
    const section = tpl.section || 'Uncategorized';
    if (!acc[section]) acc[section] = [];
    acc[section].push(tpl);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Team Email Templates</h1>
      {Object.entries(grouped).map(([section, group]) => (
        <div key={section} className="mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">{section}</h2>
          <div className="space-y-4">
            {(group as any[]).map((tpl) => (
              <div key={tpl.id} className="border p-3 rounded shadow">
                <h3 className="font-semibold">{tpl.title}</h3>
                {tpl.subject && <div className="text-xs text-gray-500 mb-1"><span className="font-semibold">Subject:</span> {tpl.subject}</div>}
                {tpl.description && <p className="text-sm text-gray-600">{tpl.description}</p>}
                <div className="text-gray-700 whitespace-pre-line mb-2">{tpl.content}</div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                  {tpl.cc && <span><span className="font-semibold">CC:</span> {tpl.cc}</span>}
                  {tpl.bcc && <span><span className="font-semibold">BCC:</span> {tpl.bcc}</span>}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openMailto(tpl)} className="bg-blue-600 text-white px-4 py-1 rounded">Insert</button>
                  <button onClick={() => onEdit(tpl)} className="bg-yellow-500 text-white px-4 py-1 rounded">Edit</button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this template?')) {
                        onDelete(tpl.id);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
import { FC } from 'react';

const TemplateList: FC<{ templates: any[] }> = ({ templates }) => {
  const insertIntoEmail = (content: string) => {
    Office.context.mailbox.item.body.setSelectedDataAsync(content, { coercionType: Office.CoercionType.Html });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Team Email Templates</h1>
      {templates.map((tpl) => (
        <div key={tpl.id} className="border p-3 rounded shadow">
          <h2 className="font-semibold">{tpl.title}</h2>
          {tpl.subject && <div className="text-xs text-gray-500 mb-1"><span className="font-semibold">Subject:</span> {tpl.subject}</div>}
          {tpl.description && <p className="text-sm text-gray-600">{tpl.description}</p>}
          <div className="text-gray-700 whitespace-pre-line mb-2">{tpl.content}</div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            {tpl.cc && <span><span className="font-semibold">CC:</span> {tpl.cc}</span>}
            {tpl.bcc && <span><span className="font-semibold">BCC:</span> {tpl.bcc}</span>}
          </div>
          <button onClick={() => insertIntoEmail(tpl.content)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Insert</button>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
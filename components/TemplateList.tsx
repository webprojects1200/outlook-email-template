import { FC } from 'react';

const TemplateList: FC<{ templates: any[] }> = ({ templates }) => {
  const insertIntoEmail = (body: string) => {
    Office.context.mailbox.item.body.setSelectedDataAsync(body, { coercionType: Office.CoercionType.Html });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Team Email Templates</h1>
      {templates.map((tpl) => (
        <div key={tpl.id} className="border p-3 rounded shadow">
          <h2 className="font-semibold">{tpl.title}</h2>
          <p className="text-sm text-gray-600">{tpl.description}</p>
          <button onClick={() => insertIntoEmail(tpl.body)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Insert</button>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
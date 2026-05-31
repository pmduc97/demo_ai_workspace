import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function PostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'draft' });

  useEffect(() => {
    if (isEdit) api.get('/admin/posts').then((r) => {
      const found = (r.data.items || []).find((x) => String(x.id) === id);
      if (found) setForm({ title: found.title, slug: found.slug, content: found.content || '', status: found.status });
    });
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    if (isEdit) await api.put(`/posts/${id}`, form); else await api.post('/posts', form);
    nav('/admin/posts');
  };

  return (
    <form onSubmit={submit} className="p-4 space-y-3 max-w-2xl">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Post' : 'New Post'}</h1>
      <input className="border p-2 w-full" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="border p-2 w-full" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea className="border p-2 w-full min-h-48" placeholder="Content (HTML)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <select className="border p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">draft</option><option value="published">published</option></select>
      <button className="border px-4 py-2">Save</button>
    </form>
  );
}

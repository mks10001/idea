import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import Layout from '../../components/Layout'

export default function NewIdea() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e: any) {
    e.preventDefault()
    const res = await apiFetch('/api/ideas', { method: 'POST', body: JSON.stringify({ title, description, authorId: '' }) })
    setMsg(JSON.stringify(res))
  }

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">New Idea</h1>
      <form onSubmit={submit} className="space-y-3 max-w-lg">
        <input className="w-full p-2 border" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full p-2 border" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white">Create</button>
      </form>
      <p className="mt-3">{msg}</p>
    </Layout>
  )
}

import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

export default function Home() {
  const [ideas, setIdeas] = useState<any[]>([])

  useEffect(() => {
    apiFetch('/api/ideas').then((data) => {
      if (Array.isArray(data)) setIdeas(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>
      <ul className="space-y-3">
        {ideas.map((it) => (
          <li key={it.id} className="p-3 border rounded">
            <a href={`/ideas/${it.id}`} className="text-lg font-semibold">{it.title}</a>
            <p className="text-sm text-gray-600">{it.description}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

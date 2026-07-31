import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { apiFetch } from '../../lib/api'
import Layout from '../../components/Layout'

export default function IdeaPage() {
  const router = useRouter()
  const { id } = router.query
  const [idea, setIdea] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    apiFetch(`/api/ideas/${id}`).then(setIdea)
  }, [id])

  if (!idea) return <Layout><p>Loading...</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p className="mt-2">{idea.description}</p>
      <div className="mt-4">
        <button className="px-3 py-2 bg-indigo-600 text-white">Make Offer (placeholder)</button>
      </div>
    </Layout>
  )
}

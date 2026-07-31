import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import { saveToken } from '../../lib/auth'
import Layout from '../../components/Layout'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e: any) {
    e.preventDefault()
    const res = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
    if (res.token) {
      saveToken(res.token)
      setMsg('Registered and logged in')
    } else {
      setMsg(JSON.stringify(res))
    }
  }

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input className="w-full p-2 border" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white">Register</button>
      </form>
      <p className="mt-3">{msg}</p>
    </Layout>
  )
}

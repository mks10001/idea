import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    // naive: try to read user id from token payload if present
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserId(payload.sub || payload.userId || '')
      } catch {}
    }
  }, [])

  async function load() {
    if (!userId) return
    const res = await apiFetch(`/api/token/balance/${userId}`)
    setBalance(res.balance ?? 0)
  }

  async function buy() {
    if (!userId) return alert('login first')
    // call backend to create checkout session
    const res = await apiFetch('/api/wallet/buy', { method: 'POST', body: JSON.stringify({ userId, tokenAmount: 10, successUrl: window.location.href, cancelUrl: window.location.href }) })
    if (res && res.url) {
      window.location.href = res.url
    } else {
      alert(JSON.stringify(res))
    }
  }

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Wallet</h1>
      <div className="mb-4">
        <button onClick={load} className="px-3 py-2 bg-gray-200">Load Balance</button>
      </div>
      <p>Balance: {balance === null ? 'unknown' : balance}</p>
      <div className="mt-4">
        <button onClick={buy} className="px-3 py-2 bg-green-600 text-white">Buy 10 SITE_TOKEN</button>
      </div>
    </Layout>
  )
}

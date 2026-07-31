import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="p-4 bg-gray-100">
      <div className="container mx-auto flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/ideas/new">New Idea</Link>
        <Link href="/wallet">Wallet</Link>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>
    </nav>
  )
}

import Nav from './Nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

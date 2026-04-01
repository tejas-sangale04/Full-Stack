"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { signIn, getSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (res?.error) {
        setError("Invalid username or password")
      } else {
        const session = await getSession()
        const role = session?.user?.role
        
        if (role === "waiter") router.push("/waiter")
        else if (role === "chef") router.push("/kitchen")
        else if (role === "customer") router.push("/rewards")
        else if (role === "admin") router.push("/admin")
        else router.push("/")
        
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50/50 flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-lg">
          <h1 className="mb-1 font-serif text-3xl text-foreground">Staff Login</h1>
          <p className="mb-8 text-sm text-muted-foreground">Sign in to your account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-widest text-muted-foreground">USERNAME / EMAIL</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. waiter1"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-widest text-muted-foreground">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-primary py-3 text-sm font-semibold tracking-widest text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Waiter: waiter1 / waiter123</p>
            <p>Chef: chef1 / chef123</p>
            <p>Admin: admin / admin123</p>
            <p>Customer: customer1 / cust123</p>
          </div>
        </div>
      </main>
    </div>
  )
}

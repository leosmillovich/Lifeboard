import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.auth.signInWithOtp({ email })
    alert('Revisa tu correo para el enlace de inicio de sesión')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <form onSubmit={handleLogin} className="space-y-2">
        <input
          className="border p-2"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Login via Magic Link
        </button>
      </form>
      <button className="mt-4 underline" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

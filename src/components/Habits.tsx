import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Habit {
  id: number
  user_id: string
  trigger: string
  action: string
}

export default function Habits() {
  const [userId, setUserId] = useState('')
  const [habits, setHabits] = useState<Habit[]>([])
  const [trigger, setTrigger] = useState('')
  const [action, setAction] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('habits').select('*')
    if (data) setHabits(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('habits').insert({ user_id: userId, trigger, action })
    setTrigger('')
    setAction('')
    load()
  }

  return (
    <div>
      <form onSubmit={add} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          value={trigger}
          onChange={e => setTrigger(e.target.value)}
          placeholder="Después de..."
        />
        <input
          className="border p-2 w-full"
          value={action}
          onChange={e => setAction(e.target.value)}
          placeholder="Haré..."
        />
        <button className="bg-orange-500 text-white px-4 py-2" type="submit">
          Agregar
        </button>
      </form>
      <ul className="space-y-2">
        {habits.map(h => (
          <li key={h.id} className="border p-2">
            Después de {h.trigger} -> haré {h.action}
          </li>
        ))}
      </ul>
    </div>
  )
}

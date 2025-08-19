import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Item {
  id: number
  user_id: string
  failure: string
  lesson: string
}

export default function FailureReframe() {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [failure, setFailure] = useState('')
  const [lesson, setLesson] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('failure_reframes').select('*')
    if (data) setItems(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('failure_reframes').insert({ user_id: userId, failure, lesson })
    setFailure('')
    setLesson('')
    load()
  }

  return (
    <div>
      <form onSubmit={add} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          value={failure}
          onChange={e => setFailure(e.target.value)}
          placeholder="Fallo"
        />
        <input
          className="border p-2 w-full"
          value={lesson}
          onChange={e => setLesson(e.target.value)}
          placeholder="Aprendizaje"
        />
        <button className="bg-purple-500 text-white px-4 py-2" type="submit">
          Agregar
        </button>
      </form>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="border p-2">
            <div className="font-bold">{i.failure}</div>
            <div>{i.lesson}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

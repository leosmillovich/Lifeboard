import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Review {
  id: number
  user_id: string
  week: string
  positives: string | null
  improvements: string | null
}

export default function WeeklyReview() {
  const [userId, setUserId] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [positives, setPositives] = useState('')
  const [improvements, setImprovements] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from('weekly_reviews')
      .select('*')
      .order('week', { ascending: false })
    if (data) setReviews(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const week = new Date().toISOString().slice(0, 10)
    await supabase
      .from('weekly_reviews')
      .upsert({ user_id: userId, week, positives, improvements }, { onConflict: 'user_id,week' })
    setPositives('')
    setImprovements('')
    load()
  }

  return (
    <div>
      <form onSubmit={add} className="space-y-2 mb-4">
        <textarea
          className="border p-2 w-full"
          value={positives}
          onChange={e => setPositives(e.target.value)}
          placeholder="Positivos"
        />
        <textarea
          className="border p-2 w-full"
          value={improvements}
          onChange={e => setImprovements(e.target.value)}
          placeholder="A mejorar"
        />
        <button className="bg-teal-500 text-white px-4 py-2" type="submit">
          Guardar
        </button>
      </form>
      <ul className="space-y-2">
        {reviews.map(r => (
          <li key={r.id} className="border p-2">
            <div className="font-bold">{r.week}</div>
            <div>Positivos: {r.positives}</div>
            <div>A mejorar: {r.improvements}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

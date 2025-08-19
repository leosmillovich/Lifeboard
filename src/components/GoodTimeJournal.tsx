import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Entry {
  id: number
  user_id: string
  date: string
  activity: string
  energy: number
  engagement: number
}

export default function GoodTimeJournal() {
  const [userId, setUserId] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [activity, setActivity] = useState('')
  const [energy, setEnergy] = useState(5)
  const [engagement, setEngagement] = useState(5)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from('gtj_entries')
      .select('*')
      .order('date', { ascending: false })
    if (data) setEntries(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('gtj_entries').insert({
      user_id: userId,
      date: new Date().toISOString(),
      activity,
      energy,
      engagement,
    })
    setActivity('')
    setEnergy(5)
    setEngagement(5)
    load()
  }

  return (
    <div>
      <form onSubmit={addEntry} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          value={activity}
          onChange={e => setActivity(e.target.value)}
          placeholder="Actividad"
        />
        <div className="flex gap-2">
          <label>Energía {energy}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={e => setEnergy(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2">
          <label>Engagement {engagement}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={engagement}
            onChange={e => setEngagement(Number(e.target.value))}
          />
        </div>
        <button className="bg-green-500 text-white px-4 py-2" type="submit">
          Agregar
        </button>
      </form>
      <ul className="space-y-2">
        {entries.map(e => (
          <li key={e.id} className="border p-2">
            <div>{new Date(e.date).toLocaleString()}</div>
            <div>{e.activity}</div>
            <div>Energía: {e.energy} / Engagement: {e.engagement}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { formatDateInput, isValidScore } from '../utils/gtj'

interface Entry {
  id: number
  user_id: string
  activity: string
  note: string | null
  energy: number
  focus: number
  satisfaction: number
  occurred_at: string
}

export default function GoodTimeJournal() {
  const [userId, setUserId] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [activity, setActivity] = useState('')
  const [energy, setEnergy] = useState(3)
  const [focus, setFocus] = useState(3)
  const [satisfaction, setSatisfaction] = useState(3)
  const [note, setNote] = useState('')
  const [occurredAt, setOccurredAt] = useState(formatDateInput(new Date()))

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minScore, setMinScore] = useState(1)
  const [maxScore, setMaxScore] = useState(5)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('gtj_entries')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
    if (error) setError(error.message)
    if (data) setEntries(data as Entry[])
    setLoading(false)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (![energy, focus, satisfaction].every(isValidScore)) {
      setError('Puntajes inválidos')
      return
    }
    setError('')
    const { error } = await supabase.from('gtj_entries').insert({
      user_id: userId,
      activity,
      energy,
      focus,
      satisfaction,
      note: note || null,
      occurred_at: new Date(occurredAt).toISOString(),
    })
    if (error) {
      setError(error.message)
      return
    }
    setActivity('')
    setEnergy(3)
    setFocus(3)
    setSatisfaction(3)
    setNote('')
    setOccurredAt(formatDateInput(new Date()))
    load()
  }

  const filtered = entries.filter(e => {
    const d = e.occurred_at.slice(0, 10)
    if (startDate && d < startDate) return false
    if (endDate && d > endDate) return false
    const scores = [e.energy, e.focus, e.satisfaction]
    return scores.every(s => s >= minScore && s <= maxScore)
  })

  return (
    <div>
      <form onSubmit={addEntry} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          value={activity}
          onChange={e => setActivity(e.target.value)}
          placeholder="Actividad"
          required
        />
        <div className="flex gap-2 flex-wrap">
          <label>Energía</label>
          <select
            className="border p-1"
            value={energy}
            onChange={e => setEnergy(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <label>Enfoque</label>
          <select
            className="border p-1"
            value={focus}
            onChange={e => setFocus(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <label>Satisfacción</label>
          <select
            className="border p-1"
            value={satisfaction}
            onChange={e => setSatisfaction(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="border p-2 w-full"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Nota (opcional)"
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={occurredAt}
          onChange={e => setOccurredAt(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 py-2" type="submit">
          Agregar
        </button>
      </form>

      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={5}
            className="border p-2 w-20"
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
          />
          <input
            type="number"
            min={1}
            max={5}
            className="border p-2 w-20"
            value={maxScore}
            onChange={e => setMaxScore(Number(e.target.value))}
          />
        </div>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && filtered.length === 0 && !error && <div>No hay entradas</div>}

      <ul className="space-y-2">
        {filtered.map(e => (
          <li key={e.id} className="border p-2">
            <div>{new Date(e.occurred_at).toLocaleDateString()}</div>
            <div>{e.activity}</div>
            {e.note && <div className="italic">{e.note}</div>}
            <div>
              Energía: {e.energy} / Enfoque: {e.focus} / Satisfacción: {e.satisfaction}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

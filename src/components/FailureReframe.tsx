import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

interface FailureReframeItem {
  id: number
  event: string
  assumption: string | null
  learning: string | null
  adjustment: string | null
  next_prototype_date: string | null
  created_at: string
}

export default function FailureReframe() {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState<FailureReframeItem[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  const [event, setEvent] = useState('')
  const [assumption, setAssumption] = useState('')
  const [learning, setLearning] = useState('')
  const [adjustment, setAdjustment] = useState('')
  const [nextDate, setNextDate] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const eventRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data, error } = await supabase
      .from('failure_reframes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      setError('Error al cargar')
    } else if (data) {
      setItems(data)
    }
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const resetForm = () => {
    setEditingId(null)
    setEvent('')
    setAssumption('')
    setLearning('')
    setAdjustment('')
    setNextDate('')
    setError('')
    eventRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!event.trim()) {
      setError('El evento es requerido')
      eventRef.current?.focus()
      return
    }
    const payload = {
      event,
      assumption: assumption || null,
      learning: learning || null,
      adjustment: adjustment || null,
      next_prototype_date: nextDate || null,
    }
    let resp
    if (editingId) {
      resp = await supabase.from('failure_reframes').update(payload).eq('id', editingId)
    } else {
      resp = await supabase
        .from('failure_reframes')
        .insert({ user_id: userId, ...payload })
    }
    if (resp.error) {
      setError('Error al guardar')
    } else {
      setMessage('Guardado con éxito')
      resetForm()
      load()
    }
  }

  const edit = (item: FailureReframeItem) => {
    setEditingId(item.id)
    setEvent(item.event)
    setAssumption(item.assumption ?? '')
    setLearning(item.learning ?? '')
    setAdjustment(item.adjustment ?? '')
    setNextDate(item.next_prototype_date ?? '')
    setMessage('')
    setError('')
    eventRef.current?.focus()
  }

  const remove = async (id: number) => {
    const { error } = await supabase.from('failure_reframes').delete().eq('id', id)
    if (error) {
      setError('Error al eliminar')
    } else {
      setMessage('Eliminado')
      if (editingId === id) resetForm()
      load()
    }
  }

  return (
    <div>
      {message && (
        <div role="status" className="p-2 mb-2 text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div role="alert" className="p-2 mb-2 text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <div>
          <label htmlFor="event" className="block">
            Evento
          </label>
          <input
            id="event"
            ref={eventRef}
            className="border p-2 w-full"
            value={event}
            onChange={e => setEvent(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="assumption" className="block">
            Suposición
          </label>
          <input
            id="assumption"
            className="border p-2 w-full"
            value={assumption}
            onChange={e => setAssumption(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="learning" className="block">
            Aprendizaje
          </label>
          <input
            id="learning"
            className="border p-2 w-full"
            value={learning}
            onChange={e => setLearning(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="adjustment" className="block">
            Ajuste
          </label>
          <input
            id="adjustment"
            className="border p-2 w-full"
            value={adjustment}
            onChange={e => setAdjustment(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nextDate" className="block">
            Próximo prototipo
          </label>
          <input
            id="nextDate"
            type="date"
            className="border p-2 w-full"
            value={nextDate}
            onChange={e => setNextDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-purple-500 text-white px-4 py-2" type="submit">
            {editingId ? 'Actualizar' : 'Agregar'}
          </button>
          {editingId && (
            <button
              type="button"
              className="px-4 py-2 border"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <p>No hay reframes aún.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(i => (
            <li key={i.id} className="border p-2">
              <div className="font-bold">{i.event}</div>
              {i.assumption && <div>Suposición: {i.assumption}</div>}
              {i.learning && <div>Aprendizaje: {i.learning}</div>}
              {i.adjustment && <div>Ajuste: {i.adjustment}</div>}
              {i.next_prototype_date && (
                <div>Próximo prototipo: {i.next_prototype_date}</div>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => edit(i)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => remove(i.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Prototype {
  id: number
  user_id: string
  title: string
  hypothesis: string
  next_step: string
  due_date: string | null
  tags: string[]
  status: string
}

const statuses = ['backlog', 'in_progress', 'learned']

export default function Prototypes() {
  const [userId, setUserId] = useState('')
  const [cards, setCards] = useState<Prototype[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Prototype | null>(null)

  const [title, setTitle] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')

  const [menu, setMenu] = useState<{ x: number; y: number; card: Prototype } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('prototypes').select('*').eq('user_id', userId)
    if (data) setCards(data as Prototype[])
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const openNew = () => {
    setTitle('')
    setHypothesis('')
    setNextStep('')
    setDueDate('')
    setTags('')
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (card: Prototype) => {
    setTitle(card.title)
    setHypothesis(card.hypothesis)
    setNextStep(card.next_step)
    setDueDate(card.due_date || '')
    setTags(card.tags.join(', '))
    setEditing(card)
    setFormOpen(true)
  }

  const savePrototype = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      user_id: userId,
      title,
      hypothesis,
      next_step: nextStep,
      due_date: dueDate || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: editing?.status ?? 'backlog',
    }
    if (editing) {
      await supabase.from('prototypes').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('prototypes').insert(payload)
    }
    setFormOpen(false)
    setEditing(null)
    load()
  }

  const handleContextMenu = (e: React.MouseEvent, card: Prototype) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, card })
  }

  const changeStatus = async (card: Prototype, status: string) => {
    await supabase.from('prototypes').update({ status }).eq('id', card.id)
    setMenu(null)
    load()
  }

  useEffect(() => {
    const close = () => setMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  return (
    <div className="relative">
      {formOpen && (
        <form onSubmit={savePrototype} className="mb-4 space-y-2 border p-4 bg-white">
          <input
            className="border p-2 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título"
            required
          />
          <textarea
            className="border p-2 w-full"
            value={hypothesis}
            onChange={e => setHypothesis(e.target.value)}
            placeholder="Hipótesis"
            required
          />
          <textarea
            className="border p-2 w-full"
            value={nextStep}
            onChange={e => setNextStep(e.target.value)}
            placeholder="Próximo paso"
            required
          />
          <input
            type="date"
            className="border p-2 w-full"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Etiquetas (separadas por coma)"
          />
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-4 py-2" type="submit">
              Guardar
            </button>
            <button
              className="px-4 py-2"
              type="button"
              onClick={() => {
                setFormOpen(false)
                setEditing(null)
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <button className="mb-4 bg-blue-500 text-white px-4 py-2" onClick={openNew}>
        Nuevo prototipo
      </button>
      <div className="flex gap-4">
        {statuses.map(status => {
          const cardsByStatus = cards.filter(c => c.status === status)
          return (
            <div key={status} className="w-1/3">
              <h3 className="text-xl capitalize mb-2">{status.replace('_', ' ')}</h3>
              <div className="space-y-2 min-h-[50px]">
                {cardsByStatus.map(card => (
                  <div
                    key={card.id}
                    className="border p-2 bg-white"
                    onContextMenu={e => handleContextMenu(e, card)}
                  >
                    <div className="font-semibold">{card.title}</div>
                    <div className="text-sm">{card.next_step}</div>
                    {card.due_date && (
                      <div className="text-xs text-gray-500">Vence: {card.due_date}</div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-200 px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      className="text-xs underline mt-2"
                      onClick={() => openEdit(card)}
                    >
                      Editar
                    </button>
                  </div>
                ))}
                {cardsByStatus.length === 0 && (
                  <div className="text-sm text-gray-500">Sin prototipos</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {menu && (
        <div
          className="absolute bg-white border shadow z-10"
          style={{ top: menu.y, left: menu.x }}
        >
          {statuses
            .filter(s => s !== menu.card.status)
            .map(s => (
              <div
                key={s}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                onClick={() => changeStatus(menu.card, s)}
              >
                {s.replace('_', ' ')}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

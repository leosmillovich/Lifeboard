import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Card {
  id: number
  user_id: string
  title: string
  status: string
}

const statuses = ['ideas', 'testing', 'done']

export default function Prototypes() {
  const [userId, setUserId] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('prototypes').select('*')
    if (data) setCards(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('prototypes').insert({ user_id: userId, title, status: 'ideas' })
    setTitle('')
    load()
  }

  const moveCard = async (card: Card, status: string) => {
    await supabase.from('prototypes').update({ status }).eq('id', card.id)
    load()
  }

  return (
    <div className="flex gap-4">
      {statuses.map(status => (
        <div key={status} className="w-1/3">
          <h3 className="text-xl capitalize mb-2">{status}</h3>
          <div className="space-y-2">
            {cards
              .filter(c => c.status === status)
              .map(card => (
                <div key={card.id} className="border p-2 bg-white">
                  <div>{card.title}</div>
                  <div className="flex gap-2 mt-2">
                    {statuses
                      .filter(s => s !== status)
                      .map(s => (
                        <button
                          key={s}
                          className="text-sm underline"
                          onClick={() => moveCard(card, s)}
                        >
                          {s}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
          {status === 'ideas' && (
            <form onSubmit={addCard} className="mt-4 space-y-2">
              <input
                className="border p-2 w-full"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nuevo prototipo"
              />
              <button className="bg-blue-500 text-white px-4 py-2" type="submit">
                Agregar
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  )
}

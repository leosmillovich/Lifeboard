import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface Plan {
  id: number
  user_id: string
  variant: number
  content: string | null
}

export default function Odyssey() {
  const [userId, setUserId] = useState('')
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('odyssey_plans').select('*')
    if (data) setPlans(data)
  }

  useEffect(() => {
    if (userId) load()
  }, [userId])

  const update = async (variant: number, content: string) => {
    await supabase
      .from('odyssey_plans')
      .upsert({ user_id: userId, variant, content }, { onConflict: 'user_id,variant' })
    load()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(variant => {
        const plan = plans.find(p => p.variant === variant)
        return (
          <textarea
            key={variant}
            className="border p-2 h-48"
            value={plan?.content ?? ''}
            onChange={e => update(variant, e.target.value)}
            placeholder={`Plan ${variant}`}
          />
        )
      })}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

interface Metric {
  id?: number
  user_id: string
  label: string
  value: number
}

const labels = ['Health', 'Work', 'Play', 'Love', 'Learning']

export default function Dashboard() {
  const [userId, setUserId] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? ''))
  }, [])

  const loadMetrics = async () => {
    const { data } = await supabase.from('dashboard_metrics').select('*').order('label')
    if (data) setMetrics(data)
  }

  useEffect(() => {
    if (!userId) return
    const init = async () => {
      const { data } = await supabase
        .from('life_meters')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()
      if (!data) {
        await supabase.from('life_meters').upsert({ user_id: userId })
      }
      loadMetrics()
    }
    init()
  }, [userId])

  const updateMetric = async (label: string, value: number) => {
    if (!userId) return
    await supabase
      .from('dashboard_metrics')
      .upsert({ user_id: userId, label, value }, { onConflict: 'user_id,label' })
    loadMetrics()
  }

  return (
    <div className="space-y-4">
      {labels.map(label => {
        const metric = metrics.find(m => m.label === label)
        return (
          <div key={label} className="space-y-1">
            <div className="flex justify-between">
              <span>{label}</span>
              <span>{metric?.value ?? 0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={metric?.value ?? 0}
              onChange={e => updateMetric(label, Number(e.target.value))}
              className="w-full"
            />
          </div>
        )
      })}
    </div>
  )
}

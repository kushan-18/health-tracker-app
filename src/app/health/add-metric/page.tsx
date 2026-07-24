'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Heart, Activity, Thermometer, Droplets, Stethoscope, Save, ArrowLeft,
  Calendar, Clock, FileText, CheckCircle2,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import { format } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

const METRIC_OPTIONS = [
  { value: 'blood_pressure_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: <Heart className="w-5 h-5" />, color: 'text-red-400', placeholder: '120' },
  { value: 'blood_pressure_diastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg', icon: <Heart className="w-5 h-5" />, color: 'text-red-400', placeholder: '80' },
  { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', icon: <Droplets className="w-5 h-5" />, color: 'text-amber-400', placeholder: '95' },
  { value: 'spo2', label: 'SpO2 (Oxygen Saturation)', unit: '%', icon: <Activity className="w-5 h-5" />, color: 'text-cyan-400', placeholder: '98' },
  { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: <Heart className="w-5 h-5" />, color: 'text-pink-400', placeholder: '72' },
  { value: 'body_temperature', label: 'Body Temperature', unit: '°F', icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-400', placeholder: '98.6' },
]

export default function AddMetricPage() {
  const router = useRouter()
  const addMetric = useStore((s) => s.addMetric)
  const [selectedType, setSelectedType] = React.useState('blood_pressure_systolic')
  const [value, setValue] = React.useState('')
  const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = React.useState(format(new Date(), 'HH:mm'))
  const [notes, setNotes] = React.useState('')
  const [saved, setSaved] = React.useState(false)

  const selected = METRIC_OPTIONS.find((m) => m.value === selectedType)

  const handleSave = () => {
    if (!value || !selected) return
    addMetric({
      id: generateId(),
      userId: 'user_001',
      type: selectedType,
      value: parseFloat(value),
      unit: selected.unit,
      date,
      time,
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push('/health')
    }, 1500)
  }

  return (
    <AppLayout title="Add Health Metric">
      <div className="max-w-2xl mx-auto">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="mb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white -ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-400" />
                <CardTitle>Add Health Metric</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {saved ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Saved Successfully</h3>
                  <p className="text-sm text-gray-400 mt-2">Redirecting to Health Tracking...</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">Metric Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {METRIC_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedType(opt.value)}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm',
                            selectedType === opt.value
                              ? 'bg-purple-500/20 border-purple-500/40 text-white'
                              : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]'
                          )}
                        >
                          <div className={cn(selectedType === opt.value ? 'text-purple-400' : opt.color)}>
                            {opt.icon}
                          </div>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Value ({selected?.unit})
                    </label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={selected?.placeholder}
                      className="bg-white/5 border-white/10 text-white text-lg h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                      </label>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Time
                      </label>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes about this reading..."
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={!value}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-base font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}

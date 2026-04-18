'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  month: number
  year: number
}

export default function MonthSelector({ month, year }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function navigate(newMonth: number, newYear: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', String(newMonth))
    params.set('year', String(newYear))
    router.push(`?${params.toString()}`)
  }

  function prev() {
    if (month === 1) navigate(12, year - 1)
    else navigate(month - 1, year)
  }

  function next() {
    if (month === 12) navigate(1, year + 1)
    else navigate(month + 1, year)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={prev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-slate-700 min-w-32 text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={next}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

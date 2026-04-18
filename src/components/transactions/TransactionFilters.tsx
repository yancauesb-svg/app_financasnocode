'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { CATEGORIES } from '@/types'
import { useCallback } from 'react'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  month: number
  year: number
  category: string
  search: string
}

export default function TransactionFilters({ month, year, category, search }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  function prevMonth() {
    if (month === 1) updateParams({ month: '12', year: String(year - 1) })
    else updateParams({ month: String(month - 1) })
  }

  function nextMonth() {
    if (month === 12) updateParams({ month: '1', year: String(year + 1) })
    else updateParams({ month: String(month + 1) })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-slate-700 min-w-32 text-center">
          {MONTHS[month - 1]} {year}
        </span>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          className="pl-8 h-9"
          placeholder="Buscar por descrição..."
          value={search}
          onChange={e => updateParams({ search: e.target.value })}
        />
        {search && (
          <button
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            onClick={() => updateParams({ search: '' })}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select value={category || 'all'} onValueChange={val => updateParams({ category: (val ?? '') === 'all' ? '' : (val ?? '') })}>
        <SelectTrigger className="w-44 h-9">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

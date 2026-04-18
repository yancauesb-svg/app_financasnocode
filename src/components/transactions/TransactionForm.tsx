'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'
import type { Transaction, TransactionFormData, TransactionType, Category } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction
}

const today = new Date().toISOString().split('T')[0]

export default function TransactionForm({ open, onClose, onSuccess, transaction }: Props) {
  const isEditing = !!transaction

  const [form, setForm] = useState<TransactionFormData>({
    description: transaction?.description ?? '',
    amount: transaction?.amount ?? ('' as unknown as number),
    date: transaction?.date ?? today,
    type: transaction?.type ?? 'despesa',
    category: transaction?.category ?? 'Alimentação',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const availableCategories = form.type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(type: TransactionType) {
    const defaultCategory = type === 'receita' ? 'Salário' : 'Alimentação'
    setForm(prev => ({ ...prev, type, category: defaultCategory }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.description.trim()) { setError('Descrição é obrigatória.'); return }
    if (!form.amount || Number(form.amount) <= 0) { setError('Valor deve ser maior que zero.'); return }
    if (!form.date) { setError('Data é obrigatória.'); return }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      description: form.description.trim(),
      amount: Number(form.amount),
      date: form.date,
      type: form.type,
      category: form.category,
      user_id: user!.id,
    }

    const { error: dbError } = isEditing
      ? await supabase.from('transactions').update(payload).eq('id', transaction!.id)
      : await supabase.from('transactions').insert(payload)

    setLoading(false)

    if (dbError) {
      setError('Erro ao salvar. Tente novamente.')
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('receita')}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                form.type === 'receita'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              + Receita
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('despesa')}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                form.type === 'despesa'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              - Despesa
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={e => setForm(prev => ({ ...prev, amount: e.target.value as unknown as number }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={form.category}
              onValueChange={val => setForm(prev => ({ ...prev, category: val as Category }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

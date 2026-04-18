'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import TransactionFilters from './TransactionFilters'
import type { Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
  month: number
  year: number
  category: string
  search: string
  totalIncome: number
  totalExpenses: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function exportToCsv(transactions: Transaction[]) {
  const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']
  const rows = transactions.map(t => [
    new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR'),
    `"${t.description.replace(/"/g, '""')}"`,
    t.type === 'receita' ? 'Receita' : 'Despesa',
    t.category,
    t.type === 'receita' ? t.amount : -t.amount,
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transacoes.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function TransactionsPageClient({
  transactions,
  month,
  year,
  category,
  search,
  totalIncome,
  totalExpenses,
}: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500 text-sm">
            {transactions.length} transação{transactions.length !== 1 ? 'ções' : ''} •{' '}
            <span className="text-green-600">{formatCurrency(totalIncome)}</span>{' '}
            receitas •{' '}
            <span className="text-red-500">{formatCurrency(totalExpenses)}</span>{' '}
            despesas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCsv(transactions)}
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova transação
          </Button>
        </div>
      </div>

      <TransactionFilters month={month} year={year} category={category} search={search} />

      <TransactionList transactions={transactions} />

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false)
          router.refresh()
        }}
      />
    </div>
  )
}

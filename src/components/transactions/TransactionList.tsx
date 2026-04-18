'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import TransactionForm from './TransactionForm'
import type { Transaction } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta transação?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', id)
    setDeletingId(null)
    router.refresh()
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">Adicione sua primeira transação clicando no botão acima</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {transactions.map(t => (
          <div key={t.id} className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <p className="font-medium text-slate-800 truncate">{t.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
                <Badge variant="outline" className="text-xs py-0 px-1.5 h-4">{t.category}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${t.type === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                {t.type === 'receita' ? '+' : '-'}{formatCurrency(Number(t.amount))}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-100">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingTransaction(t)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-600">Descrição</TableHead>
              <TableHead className="font-semibold text-slate-600">Categoria</TableHead>
              <TableHead className="font-semibold text-slate-600">Data</TableHead>
              <TableHead className="font-semibold text-slate-600">Tipo</TableHead>
              <TableHead className="font-semibold text-slate-600 text-right">Valor</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-700">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{t.category}</Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{formatDate(t.date)}</TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${
                      t.type === 'receita'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {t.type === 'receita' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'receita' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTransaction(t)}>
                        <Pencil className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingTransaction && (
        <TransactionForm
          open
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => {
            setEditingTransaction(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

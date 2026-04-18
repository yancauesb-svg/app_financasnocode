import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { Transaction } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">Últimas transações</CardTitle>
        <Link
          href="/dashboard/transactions"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Nenhuma transação neste período</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-slate-700 truncate">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
                    <Badge variant="outline" className="text-xs py-0 px-1.5 h-4">
                      {t.category}
                    </Badge>
                  </div>
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${
                  t.type === 'receita' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {t.type === 'receita' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

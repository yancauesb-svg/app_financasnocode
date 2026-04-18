import { createClient } from '@/lib/supabase/server'
import SummaryCards from '@/components/dashboard/SummaryCards'
import CategoryChart from '@/components/dashboard/CategoryChart'
import MonthSelector from '@/components/dashboard/MonthSelector'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import type { DashboardSummary, CategoryData, Transaction } from '@/types'
import { Suspense } from 'react'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const now = new Date()
  const month = parseInt(params.month ?? String(now.getMonth() + 1))
  const year = parseInt(params.year ?? String(now.getFullYear()))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0)
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: false })

  const txList = (transactions ?? []) as Transaction[]

  const totalIncome = txList
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = txList
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const summary: DashboardSummary = {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  }

  const expensesByCategory: Record<string, number> = {}
  txList
    .filter(t => t.type === 'despesa')
    .forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] ?? 0) + Number(t.amount)
    })

  const categoryData: CategoryData[] = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value, color: '' }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Resumo financeiro do período</p>
        </div>
        <Suspense>
          <MonthSelector month={month} year={year} />
        </Suspense>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryChart data={categoryData} title="Despesas por Categoria" />
        <Suspense>
          <RecentTransactions transactions={txList.slice(0, 5)} />
        </Suspense>
      </div>
    </div>
  )
}

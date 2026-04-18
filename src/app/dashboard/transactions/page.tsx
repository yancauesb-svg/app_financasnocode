import { createClient } from '@/lib/supabase/server'
import TransactionsPageClient from '@/components/transactions/TransactionsPageClient'
import type { Transaction, Category } from '@/types'
import { Suspense } from 'react'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string; category?: string; search?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const now = new Date()
  const month = parseInt(params.month ?? String(now.getMonth() + 1))
  const year = parseInt(params.year ?? String(now.getFullYear()))
  const category = params.category ?? ''
  const search = params.search ?? ''

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0)
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('description', `%${search}%`)

  const { data: transactions } = await query

  const txList = (transactions ?? []) as Transaction[]

  const totalIncome = txList
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = txList
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <Suspense>
      <TransactionsPageClient
        transactions={txList}
        month={month}
        year={year}
        category={category}
        search={search}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />
    </Suspense>
  )
}

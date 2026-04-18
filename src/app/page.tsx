import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  PieChart,
  Shield,
  Download,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard visual',
    description: 'Visualize receitas, despesas e saldo em cards e gráficos claros.',
  },
  {
    icon: PieChart,
    title: 'Gráficos por categoria',
    description: 'Entenda onde seu dinheiro é gasto com gráficos de rosca interativos.',
  },
  {
    icon: Shield,
    title: 'Dados seguros',
    description: 'Autenticação segura e cada usuário acessa apenas seus próprios dados.',
  },
  {
    icon: Download,
    title: 'Exportar CSV',
    description: 'Baixe suas transações filtradas para análise em qualquer planilha.',
  },
]

const benefits = [
  'Registre receitas e despesas rapidamente',
  'Filtre por mês, categoria ou descrição',
  'Visualize seu saldo em tempo real',
  'Funciona no celular e no computador',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <header className="border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">FinançasPessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="dark:text-slate-300 dark:hover:text-white">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <CheckCircle className="h-4 w-4" />
          Gratuito e sem instalação
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          Controle suas finanças{' '}
          <span className="text-blue-600">de forma simples</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Registre receitas e despesas, visualize seu saldo em tempo real e entenda
          para onde vai seu dinheiro — tudo em um dashboard limpo e intuitivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="w-full sm:w-auto text-base px-8">
              Começar agora — é grátis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
          Tudo que você precisa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center p-6 rounded-xl border border-slate-100 dark:border-slate-700 dark:bg-slate-800/50 hover:shadow-md transition-shadow">
              <div className="inline-flex bg-blue-50 dark:bg-blue-950 rounded-xl p-3 mb-4">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Comece a organizar suas finanças hoje
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Crie sua conta grátis em menos de 1 minuto.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Criar conta gratuita
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-slate-400 dark:text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600 rounded-md p-1">
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">FinançasPessoais</span>
          </div>
          <p>Controle financeiro simples e eficiente para pessoas físicas.</p>
        </div>
      </footer>
    </div>
  )
}

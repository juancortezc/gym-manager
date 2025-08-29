'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, FileText, Calendar, Filter, BarChart3, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

interface CashTransaction {
  id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  document: string | null
  responsible: string
  date: string
  createdAt: string
}

interface CashBalance {
  currentBalance: number
  totalIncome: number
  totalExpense: number
  monthlyIncome: number
  monthlyExpense: number
  monthlyNet: number
}

interface CashReportTransaction {
  id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  document: string | null
  responsible: string
  date: string
  time: string
  fullDate: Date
}

interface DailyCashSummary {
  date: string
  transactions: Omit<CashReportTransaction, 'fullDate'>[]
  dailyIncome: number
  dailyExpense: number
  dailyBalance: number
}

interface ResponsibleSummary {
  name: string
  totalTransactions: number
  totalIncome: number
  totalExpense: number
  balance: number
  transactions: Omit<CashReportTransaction, 'fullDate'>[]
}

interface CashReportSummary {
  totalTransactions: number
  totalIncome: number
  totalExpense: number
  netBalance: number
  incomeTransactions: number
  expenseTransactions: number
  activeDays: number
  uniqueResponsibles: number
}

interface CashReportResponse {
  month: number
  year: number
  summary: CashReportSummary
  dailySummary: DailyCashSummary[]
  responsibleSummary: ResponsibleSummary[]
  transactions: CashReportTransaction[]
}

export default function CashPage() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([])
  const [balance, setBalance] = useState<CashBalance | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState<'transactions' | 'reports'>('transactions')

  const [form, setForm] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    amount: '',
    description: '',
    document: '',
    responsible: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    // Check URL params for initial tab
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      if (tabParam === 'reports') {
        setActiveTab('reports')
      }
    }
    fetchData()
  }, [filter, currentMonth, currentYear])

  const fetchData = async () => {
    try {
      const [transactionsRes, balanceRes] = await Promise.all([
        fetch(`/api/cash-transactions?type=${filter}&month=${currentMonth}&year=${currentYear}`),
        fetch('/api/cash-transactions/balance'),
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json()
        setBalance(balanceData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTransaction ? `/api/cash-transactions/${editingTransaction.id}` : '/api/cash-transactions'
      const method = editingTransaction ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        await fetchData()
        setShowForm(false)
        setEditingTransaction(null)
        setForm({
          type: 'INCOME',
          amount: '',
          description: '',
          document: '',
          responsible: '',
          date: new Date().toISOString().split('T')[0],
        })
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleEdit = (transaction: CashTransaction) => {
    setEditingTransaction(transaction)
    setForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      document: transaction.document || '',
      responsible: transaction.responsible,
      date: transaction.date.split('T')[0],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      try {
        await fetch(`/api/cash-transactions/${id}`, { method: 'DELETE' })
        await fetchData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
      }
    }
  }

  const filteredTransactions = transactions

  if (loading) {
    return (
      <Layout title="Control de Caja Chica">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Control de Caja Chica">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'transactions', label: 'Transacciones', icon: '💰' },
            { id: 'reports', label: 'Reportes', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
        {/* Balance Cards */}
        {balance && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Actual</p>
                  <p className={`text-2xl font-bold ${
                    balance.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(balance.currentBalance)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  balance.currentBalance >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`w-6 h-6 ${
                    balance.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(balance.monthlyIncome)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gastos del Mes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(balance.monthlyExpense)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Balance Mensual</p>
                  <p className={`text-2xl font-bold ${
                    balance.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(balance.monthlyNet)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  balance.monthlyNet >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    balance.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-2 items-center">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="ALL">Todas las transacciones</option>
                <option value="INCOME">Solo ingresos</option>
                <option value="EXPENSE">Solo gastos</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('es', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Transacción
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'INCOME'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'INCOME' ? '⬆️ Ingreso' : '⬇️ Gasto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(transaction.date))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.responsible}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.document ? (
                        <div className="flex items-center gap-1">
                          <FileText size={16} />
                          {transaction.document}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin documento</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <DollarSign size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500">No hay transacciones para mostrar</p>
            </div>
          )}
        </div>
      </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && <CashReports />}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="INCOME">Ingreso</option>
                  <option value="EXPENSE">Gasto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (COP)
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Respaldo (opcional)
                </label>
                <input
                  type="text"
                  value={form.document}
                  onChange={(e) => setForm({ ...form, document: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="ej: Factura #123, Recibo #456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable
                </label>
                <input
                  type="text"
                  value={form.responsible}
                  onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingTransaction ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTransaction(null)
                    setForm({
                      type: 'INCOME',
                      amount: '',
                      description: '',
                      document: '',
                      responsible: '',
                      date: new Date().toISOString().split('T')[0],
                    })
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

// Cash Reports Component
function CashReports() {
  const [reportData, setReportData] = useState<CashReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth, selectedYear])  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports/cash?month=${selectedMonth}&year=${selectedYear}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        console.error('Error fetching report data')
        setReportData(null)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      setReportData(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <BarChart3 className="text-yellow-600" size={24} />
          <h2 className="text-xl font-semibold">Reportes de Caja Chica</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando reporte...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Month/Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BarChart3 className="text-yellow-600" size={24} />
          <h2 className="text-xl font-semibold">Reportes de Caja Chica</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transacciones</p>
                <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalTransactions}</p>
              </div>
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.totalIncome)}</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gastos</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.summary.totalExpense)}</p>
              </div>
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Balance Neto</p>
                <p className={`text-2xl font-bold ${reportData.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(reportData.summary.netBalance)}
                </p>
              </div>
              <DollarSign className={`${reportData.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Daily Summary Section */}
      {reportData?.dailySummary && reportData.dailySummary.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <button
              onClick={() => toggleSection('daily')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">Resumen Diario</h3>
              {expandedSection === 'daily' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection === 'daily' && (
            <div className="p-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reportData.dailySummary.map((day) => (
                  <div key={day.date} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-900">
                        {formatDate(day.date)}
                      </span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">+{formatCurrency(day.dailyIncome)}</span>
                        <span className="text-red-600">-{formatCurrency(day.dailyExpense)}</span>
                        <span className={`font-semibold ${day.dailyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(day.dailyBalance)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {day.transactions.map((transaction) => (
                        <div key={transaction.id} className="text-xs text-gray-600 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${transaction.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span>{transaction.description}</span>
                            <span className="text-gray-400">({transaction.responsible})</span>
                          </div>
                          <span className={`font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responsible Summary Section */}
      {reportData?.responsibleSummary && reportData.responsibleSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <button
              onClick={() => toggleSection('responsible')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">Resumen por Responsable</h3>
              {expandedSection === 'responsible' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {expandedSection === 'responsible' && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.responsibleSummary.map((responsible) => (
                  <div key={responsible.name} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-900">{responsible.name}</span>
                      <span className="text-sm text-gray-600">{responsible.totalTransactions} transacciones</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div className="text-center">
                        <p className="text-green-600 font-semibold">{formatCurrency(responsible.totalIncome)}</p>
                        <p className="text-gray-500 text-xs">Ingresos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-red-600 font-semibold">{formatCurrency(responsible.totalExpense)}</p>
                        <p className="text-gray-500 text-xs">Gastos</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${responsible.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(responsible.balance)}
                        </p>
                        <p className="text-gray-500 text-xs">Balance</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {reportData && (!reportData.transactions || reportData.transactions.length === 0) && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos para mostrar</h3>
          <p className="text-gray-600">
            No se encontraron transacciones para {months[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, FileText, Calendar, Filter } from 'lucide-react'
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

export default function CashPage() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([])
  const [balance, setBalance] = useState<CashBalance | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [form, setForm] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    amount: '',
    description: '',
    document: '',
    responsible: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
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
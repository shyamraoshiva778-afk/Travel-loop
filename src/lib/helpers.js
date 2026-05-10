export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const calculateDays = (start, end) => {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')
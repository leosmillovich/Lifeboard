export function formatDateInput(date) {
  return date.toISOString().split('T')[0]
}

export function isValidScore(n) {
  return Number.isInteger(n) && n >= 1 && n <= 5
}

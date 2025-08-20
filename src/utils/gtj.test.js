import test from 'node:test'
import assert from 'node:assert/strict'
import { formatDateInput, isValidScore } from './gtj.js'

test('formatDateInput returns YYYY-MM-DD', () => {
  const d = new Date('2024-05-15T10:00:00Z')
  assert.equal(formatDateInput(d), '2024-05-15')
})

test('isValidScore validates 1-5 range', () => {
  assert.ok(isValidScore(1))
  assert.ok(isValidScore(5))
  assert.ok(!isValidScore(0))
  assert.ok(!isValidScore(6))
  assert.ok(!isValidScore(3.5))
})

/**
 * Normaliza respuestas para comparar sin ser estrictos:
 * - minúsculas, sin tildes, sin espacios extra
 * Ej: " AzÚL " === "azul"
 */
export function normalizeAnswer(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[¡!¿?.,;:'"]+|[¡!¿?.,;:'"]+$/g, '')
    .trim()
}

export function isCorrectAnswer(guess, correct) {
  if (!guess || !correct) return false
  return normalizeAnswer(guess) === normalizeAnswer(correct)
}

import { useEffect, useMemo, useState } from 'react'
import { isCorrectAnswer } from './lib/normalize.js'
import { SECTIONS } from './data/questions.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- Primitivos UI ----------
function Button({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) {
  const styles = {
    primary: 'text-white',
    secondary: 'border',
    ghost: '',
    coral: 'text-white',
  }
  const colors = {
    primary: { background: 'var(--teal)', border: 'var(--teal-deep)' },
    secondary: { background: 'transparent', border: 'var(--line)' },
    ghost: { background: 'transparent', border: 'transparent' },
    coral: { background: 'var(--coral)', border: 'var(--coral-deep)' },
  }
  const c = colors[variant] || colors.primary
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group relative w-full rounded-xl px-6 py-3.5 text-base font-bold tracking-wide transition-soft disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant] || ''} ${className}`}
      style={{
        background: c.background,
        border: `2px solid ${c.border}`,
        borderBottomWidth: variant === 'ghost' ? '1px' : '3px',
        ...(variant === 'primary' || variant === 'coral' ? { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : {}),
      }}
    >
      {children}
    </button>
  )
}

function Panel({ children, className = '', accent = false }) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 ${className}`}
      style={{
        background: 'var(--card)',
        border: accent ? '2px solid var(--line)' : '1px solid var(--line)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  )
}

function PlayerTag({ who, name }) {
  const isP1 = who === 'p1'
  const bg = isP1 ? 'var(--teal)' : 'var(--coral)'
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold text-white"
      style={{ background: bg }}
    >
      {isP1 ? '●' : '●'} {name}
    </span>
  )
}

function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-[1.35rem] font-extrabold leading-tight tracking-tight ${className}`} style={{ color: 'var(--ink)' }}>
      {children}
    </h2>
  )
}

function Eyebrow({ children }) {
  return (
    <span className="block text-[0.7rem] font-extrabold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-faint)' }}>
      {children}
    </span>
  )
}

// ---------- Pantallas ----------
function HomeScreen({ onStartFriends, onStartSchool }) {
  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-10 lg:grid lg:max-w-4xl lg:grid-cols-2 lg:items-center lg:gap-12 lg:space-y-0">
      {/* Logo: más personal, menos genérico */}
      <div className="text-center pt-4 lg:text-left">
        <div className="animate-gentle-bounce inline-block mb-5 text-5xl select-none">🎭</div>
        <h1 className="text-[2.6rem] sm:text-[3.4rem] font-extrabold leading-[1.05] tracking-tight" style={{ color: 'var(--ink)' }}>
          Friend<br />
          <span style={{ color: 'var(--teal)' }}>or</span>{' '}
          <span style={{ color: 'var(--coral)' }}>Fake</span>
        </h1>
        <p className="mt-3 text-base font-semibold" style={{ color: 'var(--ink-soft)' }}>
          ¿Realmente se conocen?
        </p>
        <p className="mt-8 hidden text-sm font-semibold lg:block" style={{ color: 'var(--ink-faint)' }}>
          Pásense el teléfono. No miren las respuestas. 🙈
        </p>
      </div>

      {/* Modos: más peso visual, sin tarjetas genéricas */}
      <div className="space-y-3">
        <Eyebrow>Elige cómo jugar</Eyebrow>
        <button
          onClick={onStartFriends}
          className="group w-full rounded-2xl p-5 text-left transition-soft hover:translate-y-[-1px]"
          style={{ background: 'var(--teal-soft)', border: '2px solid var(--teal)', borderBottomWidth: '4px' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold" style={{ color: 'var(--ink)' }}>👯 Modo Amigos</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                Se preguntan entre sí y adivinan
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-4 py-2 text-sm font-extrabold text-white transition-soft group-hover:scale-105"
              style={{ background: 'var(--teal)' }}
            >
              Jugar →
            </span>
          </div>
        </button>

        <button
          onClick={onStartSchool}
          className="group w-full rounded-2xl p-5 text-left transition-soft hover:translate-y-[-1px]"
          style={{ background: 'var(--coral-soft)', border: '2px solid var(--coral)', borderBottomWidth: '4px' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold" style={{ color: 'var(--ink)' }}>🎒 Preguntas del cole</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                180 preguntas • 3 niveles • 4 materias
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-4 py-2 text-sm font-extrabold text-white transition-soft group-hover:scale-105"
              style={{ background: 'var(--coral)' }}
            >
              Jugar →
            </span>
          </div>
        </button>
      </div>

      {/* Cómo se juega: más sutil, sin tarjetas */}
      <div style={{ borderTop: '1px solid var(--line)' }} className="pt-6 lg:col-span-2 lg:mt-4">
        <Eyebrow>Cómo funciona</Eyebrow>
        <ol className="mt-3 space-y-3">
          {[
            { icon: '✍️', title: 'Preguntan', desc: 'Cada uno escribe sus preguntas secretas' },
            { icon: '🤔', title: 'Adivinan', desc: 'Responden contra el reloj' },
            { icon: '🏆', title: 'Comparan', desc: '1 punto por acierto. Gana quien más sepa' },
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-extrabold" style={{ color: 'var(--ink)' }}>{step.icon} {step.title}</span>
                <span className="ml-1.5 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>{step.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-xs font-semibold pb-4 lg:hidden" style={{ color: 'var(--ink-faint)' }}>
        Pásense el teléfono. No miren las respuestas. 🙈
      </p>
    </div>
  )
}

function SetupScreen({ initial, onBack, onStart }) {
  const [p1, setP1] = useState(initial.p1)
  const [p2, setP2] = useState(initial.p2)
  const [rounds, setRounds] = useState(initial.rounds)
  const [timer, setTimer] = useState(initial.timer)
  const [noLimit, setNoLimit] = useState(initial.noLimit)
  const [sudden, setSudden] = useState(initial.sudden)

  const canStart = p1.trim().length > 0 && p2.trim().length > 0

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-8 lg:max-w-3xl">
      <div>
        <button onClick={onBack} className="mb-4 text-sm font-bold transition-soft hover:opacity-70" style={{ color: 'var(--ink-soft)' }}>
          ← Volver
        </button>
        <SectionTitle>Configura la partida</SectionTitle>
        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
          Nombres, rondas y tiempo.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      {/* Nombres: sin cajas de color, más limpio */}
      <div className="space-y-4">
        <div>
          <Eyebrow>Jugador 1</Eyebrow>
          <input
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            maxLength={20}
            placeholder="Nombre"
            className="mt-1.5 w-full rounded-xl px-4 py-3 text-lg font-bold transition-soft"
            style={{ background: 'var(--card)', border: '2px solid var(--line)', color: 'var(--ink)' }}
          />
        </div>
        <div>
          <Eyebrow>Jugador 2</Eyebrow>
          <input
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            maxLength={20}
            placeholder="Nombre"
            className="mt-1.5 w-full rounded-xl px-4 py-3 text-lg font-bold transition-soft"
            style={{ background: 'var(--card)', border: '2px solid var(--line)', color: 'var(--ink)' }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8 lg:mt-0">
      {/* Rondas */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-bold" style={{ color: 'var(--ink)' }}>Rondas por jugador</span>
          <span className="text-2xl font-extrabold" style={{ color: 'var(--teal)' }}>{rounds}</span>
        </div>
        <input
          type="range" min={1} max={10} value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="mt-3 w-full"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] font-bold" style={{ color: 'var(--ink-faint)' }}>
          <span>1</span><span>5</span><span>10</span>
        </div>
        <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>
          Total: {rounds * 2} preguntas
        </p>
      </div>

      {/* Tiempo */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: 'var(--ink)' }}>Tiempo por respuesta</span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold" style={{ color: 'var(--teal)' }}>{noLimit ? '∞' : `${timer}s`}</span>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>
              <input type="checkbox" checked={noLimit} onChange={(e) => setNoLimit(e.target.checked)} className="h-4 w-4" />
              Sin límite
            </label>
          </div>
        </div>
        {!noLimit && (
          <input
            type="range" min={5} max={60} step={5} value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
            className="mt-3 w-full"
          />
        )}
        <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>
          Si se acaba el tiempo: 0 puntos y sigue.
        </p>
      </div>

      {/* Muerte súbita */}
      <div className="flex items-center justify-between rounded-xl p-4" style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold)' }}>
        <div>
          <div className="font-extrabold" style={{ color: 'var(--ink)' }}>⚡ Muerte súbita</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>1 pregunta extra si empatan</div>
        </div>
        <button
          onClick={() => setSudden(!sudden)}
          className="relative h-7 w-12 rounded-full transition-soft"
          style={{ background: sudden ? 'var(--teal)' : 'var(--line)' }}
          aria-label="muerte subita"
        >
          <span
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all"
            style={{ left: sudden ? 'calc(100% - 1.375rem)' : '0.125rem' }}
          />
        </button>
      </div>
      </div>
      </div>

      <div className="space-y-2 pb-6">
        <Button variant="primary" disabled={!canStart} onClick={() => onStart({ p1: p1.trim() || 'Persona 1', p2: p2.trim() || 'Persona 2', rounds, timer, noLimit, sudden })}>
          ¡A preguntar! →
        </Button>
        {!canStart && (
          <p className="text-center text-sm font-bold" style={{ color: 'var(--coral)' }}>
            Escribe los dos nombres
          </p>
        )}
      </div>
    </div>
  )
}

function CreateQuestionsScreen({ authorName, otherName, authorKey, current, total, roundLabel, isSudden, onSave }) {
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const canSave = q.trim().length >= 3 && a.trim().length >= 1

  const handle = () => {
    if (!canSave) return
    onSave(q.trim(), a.trim())
    setQ('')
    setA('')
  }

  const borderColor = authorKey === 'p1' ? 'var(--teal)' : 'var(--coral)'

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-6 sm:max-w-xl">
      <div className="text-center">
        <Eyebrow>{roundLabel} {isSudden && '· Muerte súbita'}</Eyebrow>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--ink)' }}>
          Turno de {authorName}
        </h2>
        <div className="mt-3 inline-block rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: 'var(--gold-soft)', color: 'var(--ink)', border: '1px solid var(--gold)' }}>
          📱 Pasa el teléfono a {authorName}. {otherName}, no mires.
        </div>
      </div>

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <PlayerTag who={authorKey} name={authorName} />
          <span className="text-sm font-bold" style={{ color: 'var(--ink-faint)' }}>{current}/{total}</span>
        </div>

        <label className="block text-sm font-extrabold" style={{ color: 'var(--ink)' }}>Pregunta</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="¿Cuál es mi color favorito?"
          maxLength={120}
          className="mt-1.5 w-full rounded-xl px-4 py-3 text-base font-semibold transition-soft"
          style={{ background: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}
        />

        <label className="mt-4 block text-sm font-extrabold" style={{ color: 'var(--ink)' }}>
          Respuesta secreta 🔒
        </label>
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Azul"
          maxLength={80}
          className="mt-1.5 w-full rounded-xl px-4 py-3 text-base font-semibold transition-soft"
          style={{ background: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}
        />
        <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>
          Se ignora mayúsculas y tildes: "Azúl" = "azul"
        </p>

        <div className="mt-5">
          <Button variant={authorKey === 'p1' ? 'primary' : 'coral'} disabled={!canSave} onClick={handle}>
            Guardar ({current}/{total}) →
          </Button>
        </div>

        {/* Progreso: más limpio */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current - 1) / total) * 100}%`, background: borderColor }}
          />
        </div>
      </Panel>
    </div>
  )
}

function AnswerScreen({ question, guesserName, authorName, guesserKey, qNumber, qTotal, timerSeconds, noLimit, onAnswer }) {
  const [guess, setGuess] = useState('')
  const [left, setLeft] = useState(timerSeconds)
  const [feedback, setFeedback] = useState(null)
  const total = timerSeconds

  useEffect(() => {
    setGuess('')
    setFeedback(null)
    setLeft(timerSeconds)
  }, [qNumber, timerSeconds])

  useEffect(() => {
    if (noLimit || feedback) return
    if (left <= 0) {
      setFeedback({ isCorrect: false, correct: question.answer, timedOut: true, guessVal: guess })
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, noLimit, feedback, question, guess])

  const submit = () => {
    if (feedback) return
    const ok = isCorrectAnswer(guess, question.answer)
    setFeedback({ isCorrect: ok, correct: question.answer, timedOut: false, guessVal: guess })
  }

  const pct = noLimit ? 100 : Math.max(0, (left / total) * 100)
  const danger = !noLimit && left <= 5 && !feedback

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-5 sm:max-w-xl">
      <div className="text-center">
        <Eyebrow>Respondiendo {qNumber}/{qTotal}</Eyebrow>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--ink)' }}>
          ¡Adivina, {guesserName}!
        </h2>
        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
          Pregunta de {authorName} · +1 punto si aciertas
        </p>
      </div>

      {/* Timer: más minimalista */}
      {!noLimit && !feedback && (
        <div className={`rounded-xl px-4 py-3 ${danger ? 'animate-timer-danger' : ''}`} style={{ background: danger ? 'var(--coral-soft)' : 'var(--card)', border: `1px solid ${danger ? 'var(--coral)' : 'var(--line)'}` }}>
          <div className="flex items-center justify-between text-sm font-extrabold">
            <span style={{ color: danger ? 'var(--coral)' : 'var(--ink)' }}>{left}s</span>
            <span style={{ color: danger ? 'var(--coral)' : 'var(--ink-faint)' }}>{danger ? '¡Corre!' : 'Tú puedes'}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: left <= 5 ? 'var(--coral)' : left <= 10 ? 'var(--gold)' : 'var(--teal)',
              }}
            />
          </div>
        </div>
      )}

      <Panel>
        {/* Pregunta: sin gradiente, más editorial */}
        <div className="rounded-xl p-5 text-center" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <p className="text-xl sm:text-2xl font-extrabold leading-snug" style={{ color: 'var(--ink)' }}>
            "{question.text}"
          </p>
        </div>

        {!feedback ? (
          <div className="mt-5">
            <label className="block text-sm font-extrabold" style={{ color: 'var(--ink)' }}>Tu respuesta</label>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              placeholder="Escribe lo que crees..."
              maxLength={80}
              autoFocus
              className="mt-1.5 w-full rounded-xl px-4 py-3 text-base font-semibold transition-soft"
              style={{ background: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}
            />
            <div className="mt-4">
              <Button variant="primary" disabled={guess.trim().length === 0} onClick={submit}>
                Responder →
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="animate-fade-up mt-5 rounded-xl p-5 text-center"
            style={{
              background: feedback.isCorrect ? 'var(--leaf-soft)' : 'var(--coral-soft)',
              border: `1px solid ${feedback.isCorrect ? 'var(--leaf)' : 'var(--coral)'}`,
            }}
          >
            {feedback.timedOut ? (
              <>
                <div className="text-4xl">⏰</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--ink)' }}>Tiempo agotado</div>
                <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Era: <b style={{ color: 'var(--ink)' }}>"{feedback.correct}"</b>
                </div>
              </>
            ) : feedback.isCorrect ? (
              <>
                <div className="animate-score-pop text-4xl">✓</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--leaf)' }}>¡Correcto! +1 punto</div>
              </>
            ) : (
              <>
                <div className="text-4xl">✗</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--ink)' }}>Era: "{feedback.correct}"</div>
                <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Dijiste: "{feedback.guessVal}"
                </div>
              </>
            )}
            <div className="mt-4">
              <Button variant={feedback.isCorrect ? 'primary' : 'secondary'} onClick={() => onAnswer(feedback)}>
                {qNumber === qTotal ? 'Ver resultados' : 'Siguiente →'}
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

function ResultsScreen({ p1, p2, scores, detail, suddenEnabled, suddenRounds, onSuddenDeath, onReplay, onHome }) {
  const winner = scores.p1 === scores.p2 ? null : scores.p1 > scores.p2 ? 'p1' : 'p2'
  const winnerName = winner === 'p1' ? p1 : winner === 'p2' ? p2 : null
  const totalQs = detail.length

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-8 lg:max-w-3xl">
      <div className="text-center pt-2">
        <div className="text-5xl select-none">{winner ? '🏆' : '🤝'}</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--ink)' }}>
          {winner ? `¡Gana ${winnerName}!` : '¡Empate!'}
        </h2>
        <p className="mt-1.5 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
          {winner
            ? (winner === 'p1' ? `${p1} conoce mejor a ${p2}` : `${p2} conoce mejor a ${p1}`)
            : suddenEnabled
              ? 'Muy parejos... ¡Muerte súbita!'
              : 'Son igual de amigos (o de fakes)'}
        </p>
        {suddenRounds > 0 && (
          <p className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold)' }}>
            ⚡ {suddenRounds} rondas de muerte súbita
          </p>
        )}
      </div>

      {/* Puntajes: más impacto visual */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 rounded-2xl p-5 text-center" style={{ background: 'var(--teal-soft)', border: '2px solid var(--teal)' }}>
          <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--teal)' }}>{p1}</div>
          <div className="animate-score-pop mt-1 text-5xl font-extrabold" style={{ color: 'var(--teal)' }}>{scores.p1}</div>
        </div>
        <div className="flex items-center px-1">
          <span className="text-lg font-extrabold" style={{ color: 'var(--ink-faint)' }}>vs</span>
        </div>
        <div className="flex-1 rounded-2xl p-5 text-center" style={{ background: 'var(--coral-soft)', border: '2px solid var(--coral)' }}>
          <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--coral)' }}>{p2}</div>
          <div className="animate-score-pop mt-1 text-5xl font-extrabold" style={{ color: 'var(--coral)' }}>{scores.p2}</div>
        </div>
      </div>

      {/* Barra proporcional */}
      <div>
        <div className="flex h-3 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <div style={{ width: `${totalQs ? (scores.p1 / totalQs) * 100 : 50}%`, background: 'var(--teal)', transition: 'width 0.6s ease' }} />
          <div style={{ width: `${totalQs ? (scores.p2 / totalQs) * 100 : 50}%`, background: 'var(--coral)', transition: 'width 0.6s ease' }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs font-bold" style={{ color: 'var(--ink-faint)' }}>
          <span>{p1}: {scores.p1}/{totalQs}</span>
          <span>{p2}: {scores.p2}/{totalQs}</span>
        </div>
      </div>

      {!winner && suddenEnabled && (
        <Button variant="coral" onClick={onSuddenDeath}>⚡ Muerte súbita — 1 pregunta extra</Button>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="primary" onClick={onReplay}>Jugar de nuevo</Button>
        <Button variant="secondary" onClick={onHome}>Inicio</Button>
      </div>

      {/* Detalle: más limpio, sin bordes pesados */}
      <div>
        <Eyebrow>Detalle</Eyebrow>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {detail.map((d, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5"
              style={{
                background: d.isCorrect ? 'var(--leaf-soft)' : 'var(--card)',
                border: `1px solid ${d.isCorrect ? 'var(--leaf)' : 'var(--line)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                  {i + 1}. "{d.questionText}"
                </span>
                <span className="shrink-0 text-sm font-extrabold" style={{ color: d.isCorrect ? 'var(--leaf)' : 'var(--coral)' }}>
                  {d.isCorrect ? '✓' : d.timedOut ? '⏰' : '✗'}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
                {d.author === 'p1' ? p1 : p2} preguntó · {d.guesser === 'p1' ? p1 : p2} dijo "{d.guess || '—'}" · Era "{d.correctAnswer}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- Modo Colegio ----------
function SchoolConfigScreen({ onBack, onStart }) {
  const [sectionId, setSectionId] = useState(null)
  const [subjectName, setSubjectName] = useState(null)
  const [qCount, setQCount] = useState(10)
  const [timer, setTimer] = useState(20)
  const [noLimit, setNoLimit] = useState(false)
  const [mode, setMode] = useState('options')

  const section = SECTIONS.find((s) => s.id === sectionId)
  const subject = section?.subjects.find((s) => s.name === subjectName)
  const maxQ = subject ? subject.questions.length : 60
  const canStart = section && qCount >= 1 && qCount <= maxQ

  const pickSection = (id) => {
    setSectionId(id)
    setSubjectName(null)
    setQCount((c) => Math.min(c, 60))
  }

  const pickSubject = (name) => {
    setSubjectName(name)
    const sec = SECTIONS.find((s) => s.id === sectionId)
    const sub = name ? sec.subjects.find((s) => s.name === name) : null
    setQCount((c) => Math.min(c, sub ? sub.questions.length : 60))
  }

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-7 lg:max-w-3xl">
      <div>
        <button onClick={onBack} className="mb-4 text-sm font-bold transition-soft hover:opacity-70" style={{ color: 'var(--ink-soft)' }}>
          ← Volver
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--ink)' }}>
          🎒 Preguntas del Cole
        </h2>
        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
          180 preguntas de Ecuador · 4 materias · 3 niveles
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      <div className="space-y-7">
      {/* Sección */}
      <div>
        <Eyebrow>Nivel</Eyebrow>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => pickSection(s.id)}
              className="rounded-xl p-3 text-center transition-soft"
              style={{
                background: sectionId === s.id ? 'var(--teal-soft)' : 'var(--card)',
                border: `2px solid ${sectionId === s.id ? 'var(--teal)' : 'var(--line)'}`,
              }}
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-1 text-sm font-extrabold" style={{ color: 'var(--ink)' }}>{s.name}</div>
              <div className="text-[0.65rem] font-bold" style={{ color: 'var(--ink-faint)' }}>{s.level}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Materia */}
      {section && (
        <div>
          <Eyebrow>Materia</Eyebrow>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              onClick={() => pickSubject(null)}
              className="rounded-xl px-3 py-2.5 text-sm font-bold transition-soft"
              style={{
                background: subjectName === null ? 'var(--coral-soft)' : 'var(--card)',
                border: `2px solid ${subjectName === null ? 'var(--coral)' : 'var(--line)'}`,
              }}
            >
              🎲 Todas
            </button>
            {section.subjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => pickSubject(sub.name)}
                className="rounded-xl px-3 py-2.5 text-sm font-bold transition-soft"
                style={{
                  background: subjectName === sub.name ? 'var(--coral-soft)' : 'var(--card)',
                  border: `2px solid ${subjectName === sub.name ? 'var(--coral)' : 'var(--line)'}`,
                }}
              >
                {sub.emoji} {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      </div>

      <div className="mt-8 space-y-7 lg:mt-0">
      {/* Cantidad */}
      {section && (
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-bold" style={{ color: 'var(--ink)' }}>Cantidad de preguntas</span>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--teal)' }}>{qCount}</span>
          </div>
          <input
            type="range" min={1} max={maxQ} value={qCount}
            onChange={(e) => setQCount(Number(e.target.value))}
            className="mt-3 w-full"
          />
          <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>{maxQ} disponibles</p>
        </div>
      )}

      {/* Tiempo */}
      {section && (
        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold" style={{ color: 'var(--ink)' }}>Tiempo por pregunta</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold" style={{ color: 'var(--teal)' }}>{noLimit ? '∞' : `${timer}s`}</span>
              <label className="flex cursor-pointer items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>
                <input type="checkbox" checked={noLimit} onChange={(e) => setNoLimit(e.target.checked)} className="h-4 w-4" />
                Sin límite
              </label>
            </div>
          </div>
          {!noLimit && (
            <input
              type="range" min={5} max={60} step={5} value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="mt-3 w-full"
            />
          )}
        </div>
      )}

      {/* Tipo respuesta */}
      {section && (
        <div>
          <Eyebrow>Tipo de respuesta</Eyebrow>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('options')}
              className="rounded-xl p-4 text-center transition-soft"
              style={{
                background: mode === 'options' ? 'var(--teal-soft)' : 'var(--card)',
                border: `2px solid ${mode === 'options' ? 'var(--teal)' : 'var(--line)'}`,
              }}
            >
              <div className="text-2xl">🔘</div>
              <div className="mt-1 font-extrabold" style={{ color: 'var(--ink)' }}>Opción múltiple</div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>Elige A, B o C</div>
            </button>
            <button
              onClick={() => setMode('written')}
              className="rounded-xl p-4 text-center transition-soft"
              style={{
                background: mode === 'written' ? 'var(--teal-soft)' : 'var(--card)',
                border: `2px solid ${mode === 'written' ? 'var(--teal)' : 'var(--line)'}`,
              }}
            >
              <div className="text-2xl">✍️</div>
              <div className="mt-1 font-extrabold" style={{ color: 'var(--ink)' }}>Escribir</div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>Escribe la respuesta</div>
            </button>
          </div>
        </div>
      )}
      </div>
      </div>

      <div className="pb-6">
        <Button variant="primary" disabled={!canStart} onClick={() => onStart({ sectionId, subjectName, qCount, timer, noLimit, mode })}>
          ¡Empezar! →
        </Button>
        {!section && (
          <p className="mt-2 text-center text-sm font-bold" style={{ color: 'var(--ink-faint)' }}>
            Selecciona un nivel arriba
          </p>
        )}
      </div>
    </div>
  )
}

function SchoolQuizScreen({ question, qNumber, qTotal, timerSeconds, noLimit, mode, onAnswer }) {
  const [guess, setGuess] = useState('')
  const [left, setLeft] = useState(timerSeconds)
  const [feedback, setFeedback] = useState(null)
  const total = timerSeconds

  useEffect(() => {
    setGuess('')
    setFeedback(null)
    setLeft(timerSeconds)
  }, [qNumber, timerSeconds])

  useEffect(() => {
    if (noLimit || feedback) return
    if (left <= 0) {
      setFeedback({ isCorrect: false, correctIdx: question.answer, timedOut: true, guessVal: mode === 'written' ? guess : '' })
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, noLimit, feedback, question, guess, mode])

  const optionClick = (idx) => {
    if (feedback) return
    setFeedback({ isCorrect: idx === question.answer, correctIdx: question.answer, timedOut: false, guessVal: question.options[idx] })
  }

  const submitWritten = () => {
    if (feedback || !guess.trim()) return
    const ok = isCorrectAnswer(guess, question.options[question.answer])
    setFeedback({ isCorrect: ok, correctIdx: question.answer, timedOut: false, guessVal: guess.trim() })
  }

  const pct = noLimit ? 100 : Math.max(0, (left / total) * 100)
  const danger = !noLimit && left <= 5 && !feedback
  const optLetters = ['A', 'B', 'C']

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-5 sm:max-w-xl">
      <div className="text-center">
        <Eyebrow>Pregunta {qNumber}/{qTotal}</Eyebrow>
        {/* Progreso como barra limpia */}
        <div className="mx-auto mt-2 h-1.5 max-w-xs overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(qNumber / qTotal) * 100}%`, background: 'var(--teal)' }} />
        </div>
      </div>

      {!noLimit && !feedback && (
        <div className={`rounded-xl px-4 py-3 ${danger ? 'animate-timer-danger' : ''}`} style={{ background: danger ? 'var(--coral-soft)' : 'var(--card)', border: `1px solid ${danger ? 'var(--coral)' : 'var(--line)'}` }}>
          <div className="flex items-center justify-between text-sm font-extrabold">
            <span style={{ color: danger ? 'var(--coral)' : 'var(--ink)' }}>{left}s</span>
            <span style={{ color: danger ? 'var(--coral)' : 'var(--ink-faint)' }}>{danger ? '¡Corre!' : 'Tú puedes'}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: left <= 5 ? 'var(--coral)' : left <= 10 ? 'var(--gold)' : 'var(--teal)',
              }}
            />
          </div>
        </div>
      )}

      <Panel>
        <p className="rounded-xl p-5 text-center text-lg sm:text-xl font-extrabold leading-snug" style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
          "{question.text}"
        </p>

        {mode === 'options' && !feedback && (
          <div className="mt-4 space-y-2.5">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => optionClick(idx)}
                className="group w-full rounded-xl px-4 py-3.5 text-left font-bold transition-soft hover:translate-y-[-1px]"
                style={{ background: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}
              >
                <span
                  className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white transition-soft group-hover:scale-110"
                  style={{ background: 'var(--ink-faint)' }}
                >
                  {optLetters[idx]}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {mode === 'written' && !feedback && (
          <div className="mt-4">
            <label className="block text-sm font-extrabold" style={{ color: 'var(--ink)' }}>Tu respuesta</label>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitWritten() }}
              placeholder="Escribe tu respuesta..."
              maxLength={80}
              autoFocus
              className="mt-1.5 w-full rounded-xl px-4 py-3 text-base font-semibold transition-soft"
              style={{ background: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}
            />
            <div className="mt-4">
              <Button variant="primary" disabled={!guess.trim()} onClick={submitWritten}>Responder →</Button>
            </div>
          </div>
        )}

        {feedback && (
          <div
            className="animate-fade-up mt-4 rounded-xl p-5 text-center"
            style={{
              background: feedback.isCorrect ? 'var(--leaf-soft)' : 'var(--coral-soft)',
              border: `1px solid ${feedback.isCorrect ? 'var(--leaf)' : 'var(--coral)'}`,
            }}
          >
            {feedback.timedOut ? (
              <>
                <div className="text-4xl">⏰</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--ink)' }}>Tiempo agotado</div>
                <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Era: <b style={{ color: 'var(--ink)' }}>{question.options[question.answer]}</b>
                </div>
              </>
            ) : feedback.isCorrect ? (
              <>
                <div className="animate-score-pop text-4xl">✓</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--leaf)' }}>¡Correcto! +1 punto</div>
              </>
            ) : (
              <>
                <div className="text-4xl">✗</div>
                <div className="mt-2 text-xl font-extrabold" style={{ color: 'var(--ink)' }}>Era: {question.options[question.answer]}</div>
                {mode === 'written' && (
                  <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>Dijiste: "{feedback.guessVal}"</div>
                )}
              </>
            )}
            <div className="mt-4">
              <Button variant={feedback.isCorrect ? 'primary' : 'secondary'} onClick={() => onAnswer(feedback)}>
                {qNumber === qTotal ? 'Ver resultado' : 'Siguiente →'}
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

function SchoolResultsScreen({ score, total, detail, sectionName, subjectName, mode, onReplay, onHome }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const emoji = pct >= 90 ? '🌟' : pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '📚'
  const msg = pct >= 90 ? '¡Eres un genio!' : pct >= 70 ? '¡Muy bien!' : pct >= 50 ? '¡Sigue practicando!' : '¡No te rindas!'

  return (
    <div className="animate-fade-up mx-auto w-full max-w-lg space-y-8 lg:max-w-3xl">
      <div className="text-center pt-2">
        <div className="text-5xl select-none">{emoji}</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--ink)' }}>{msg}</h2>
        <p className="mt-1.5 text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
          {sectionName} · {subjectName} · {mode === 'options' ? 'Opción múltiple' : 'Escribir'}
        </p>
      </div>

      <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--teal-soft)', border: '2px solid var(--teal)' }}>
        <div className="animate-score-pop text-5xl font-extrabold" style={{ color: 'var(--teal)' }}>{score}/{total}</div>
        <div className="mt-1 text-base font-bold" style={{ color: 'var(--ink-soft)' }}>{pct}% correcto</div>
      </div>

      <div>
        <div className="h-3 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct >= 70 ? 'var(--leaf)' : pct >= 50 ? 'var(--gold)' : 'var(--coral)',
            }}
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="primary" onClick={onReplay}>Otra vez</Button>
        <Button variant="secondary" onClick={onHome}>Inicio</Button>
      </div>

      <div>
        <Eyebrow>Revisión</Eyebrow>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {detail.map((d, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5"
              style={{
                background: d.isCorrect ? 'var(--leaf-soft)' : 'var(--card)',
                border: `1px solid ${d.isCorrect ? 'var(--leaf)' : 'var(--line)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                  {i + 1}. {d.questionText}
                </span>
                <span className="shrink-0 text-sm font-extrabold" style={{ color: d.isCorrect ? 'var(--leaf)' : 'var(--coral)' }}>
                  {d.isCorrect ? '✓' : d.timedOut ? '⏰' : '✗'}
                </span>
              </div>
              {!d.isCorrect && (
                <div className="mt-1 text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Dijiste: "{d.guessVal || '—'}" · Correcta: "{d.correctAnswer}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- App principal ----------
export default function App() {
  const [phase, setPhase] = useState('home')
  const [config, setConfig] = useState({ p1: 'Vale', p2: 'Santi', rounds: 3, timer: 15, noLimit: false, sudden: true })
  const [dark, setDark] = useState(() => localStorage.getItem('fof-theme') === 'dark')

  const [questions, setQuestions] = useState([])
  const [createIdx, setCreateIdx] = useState(0)
  const [answerIdx, setAnswerIdx] = useState(0)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })
  const [detail, setDetail] = useState([])

  const [suddenDrafts, setSuddenDrafts] = useState([])
  const [suddenCreateIdx, setSuddenCreateIdx] = useState(0)
  const [suddenRounds, setSuddenRounds] = useState(0)

  const [schoolConfig, setSchoolConfig] = useState(null)
  const [schoolQuestions, setSchoolQuestions] = useState([])
  const [schoolIdx, setSchoolIdx] = useState(0)
  const [schoolScore, setSchoolScore] = useState(0)
  const [schoolDetail, setSchoolDetail] = useState([])

  const totalToCreate = useMemo(() => config.rounds * 2, [config.rounds])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('fof-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const resetGame = (newConfig) => {
    const c = newConfig || config
    setConfig(c)
    setQuestions([])
    setCreateIdx(0)
    setAnswerIdx(0)
    setScores({ p1: 0, p2: 0 })
    setDetail([])
    setSuddenDrafts([])
    setSuddenCreateIdx(0)
    setSuddenRounds(0)
  }

  const startFriendsSetup = () => setPhase('setup')
  const startCreating = (c) => { resetGame(c); setPhase('create') }

  const handleSaveQuestion = (text, answer) => {
    const author = createIdx % 2 === 0 ? 'p1' : 'p2'
    const q = { id: Date.now() + createIdx, author, text, answer }
    setQuestions([...questions, q])
    if (createIdx + 1 >= totalToCreate) {
      setAnswerIdx(0)
      setPhase('answer')
    } else {
      setCreateIdx(createIdx + 1)
    }
  }

  const handleAnswer = (fb) => {
    const q = questions[answerIdx]
    const guesser = q.author === 'p1' ? 'p2' : 'p1'
    if (fb.isCorrect) setScores((s) => ({ ...s, [guesser]: s[guesser] + 1 }))
    setDetail((d) => [...d, {
      qId: q.id, questionText: q.text, author: q.author, guesser,
      guess: fb.guessVal, correctAnswer: fb.correct, isCorrect: fb.isCorrect, timedOut: fb.timedOut,
    }])
    if (answerIdx + 1 >= questions.length) setPhase('results')
    else setAnswerIdx(answerIdx + 1)
  }

  const handleSuddenSave = (text, answer) => {
    const author = suddenCreateIdx % 2 === 0 ? 'p1' : 'p2'
    const q = { id: Date.now() + suddenCreateIdx + Math.random(), author, text, answer }
    const drafts = [...suddenDrafts, q]
    if (suddenCreateIdx + 1 >= 2) {
      setQuestions((prev) => [...prev, ...drafts])
      setSuddenDrafts([])
      setSuddenCreateIdx(0)
      setPhase('answer')
    } else {
      setSuddenDrafts(drafts)
      setSuddenCreateIdx(suddenCreateIdx + 1)
    }
  }

  const startSuddenDeath = () => {
    setSuddenRounds((r) => r + 1)
    setSuddenDrafts([])
    setSuddenCreateIdx(0)
    setPhase('sudden-create')
  }

  const startSchoolSetup = () => setPhase('school-config')

  const startSchoolQuiz = (cfg) => {
    const section = SECTIONS.find((s) => s.id === cfg.sectionId)
    let pool = []
    if (cfg.subjectName) {
      const sub = section.subjects.find((s) => s.name === cfg.subjectName)
      pool = [...sub.questions]
    } else {
      pool = section.subjects.flatMap((s) => s.questions)
    }
    const picked = shuffle(pool).slice(0, cfg.qCount)
    setSchoolConfig(cfg)
    setSchoolQuestions(picked)
    setSchoolIdx(0)
    setSchoolScore(0)
    setSchoolDetail([])
    setPhase('school-quiz')
  }

  const handleSchoolAnswer = (fb) => {
    const q = schoolQuestions[schoolIdx]
    if (fb.isCorrect) setSchoolScore((s) => s + 1)
    setSchoolDetail((d) => [...d, {
      questionText: q.text, guessVal: fb.guessVal,
      correctAnswer: q.options[q.answer], isCorrect: fb.isCorrect, timedOut: fb.timedOut,
    }])
    if (schoolIdx + 1 >= schoolQuestions.length) setPhase('school-results')
    else setSchoolIdx(schoolIdx + 1)
  }

  return (
    <div className="relative min-h-dvh" style={{ background: 'var(--paper)' }}>
      {/* Toggle tema: minimalista */}
      <button
        onClick={() => setDark(!dark)}
        aria-label="Cambiar tema"
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-soft hover:scale-110"
        style={{ background: 'var(--card)', border: '1px solid var(--line)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      <main className="mx-auto w-full max-w-xl px-5 pt-6 pb-10 sm:max-w-2xl sm:px-8 sm:pt-10 lg:max-w-5xl">
        {/* Breadcrumb: sutil */}
        {phase !== 'home' && (
          <nav className="mb-6 flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-faint)' }}>
            {phase.startsWith('school') ? (
              <>
                <span style={{ color: phase === 'school-config' ? 'var(--ink)' : undefined }}>Nivel</span>
                <span>›</span>
                <span style={{ color: phase === 'school-quiz' ? 'var(--ink)' : undefined }}>Preguntas</span>
                <span>›</span>
                <span style={{ color: phase === 'school-results' ? 'var(--ink)' : undefined }}>Resultado</span>
              </>
            ) : (
              <>
                <span style={{ color: phase === 'setup' ? 'var(--ink)' : undefined }}>Config</span>
                <span>›</span>
                <span style={{ color: phase === 'create' || phase === 'sudden-create' ? 'var(--ink)' : undefined }}>Preguntan</span>
                <span>›</span>
                <span style={{ color: phase === 'answer' ? 'var(--ink)' : undefined }}>Adivinan</span>
                <span>›</span>
                <span style={{ color: phase === 'results' ? 'var(--ink)' : undefined }}>Resultado</span>
              </>
            )}
          </nav>
        )}

        {phase === 'home' && <HomeScreen onStartFriends={startFriendsSetup} onStartSchool={startSchoolSetup} />}

        {phase === 'setup' && <SetupScreen initial={config} onBack={() => setPhase('home')} onStart={startCreating} />}

        {phase === 'create' && questions.length < totalToCreate && (
          <CreateQuestionsScreen
            authorKey={createIdx % 2 === 0 ? 'p1' : 'p2'}
            authorName={createIdx % 2 === 0 ? config.p1 : config.p2}
            otherName={createIdx % 2 === 0 ? config.p2 : config.p1}
            current={createIdx + 1}
            total={totalToCreate}
            roundLabel={`Ronda ${Math.floor(createIdx / 2) + 1} de ${config.rounds}`}
            isSudden={false}
            onSave={handleSaveQuestion}
          />
        )}

        {phase === 'sudden-create' && (
          <CreateQuestionsScreen
            authorKey={suddenCreateIdx % 2 === 0 ? 'p1' : 'p2'}
            authorName={suddenCreateIdx % 2 === 0 ? config.p1 : config.p2}
            otherName={suddenCreateIdx % 2 === 0 ? config.p2 : config.p1}
            current={suddenCreateIdx + 1}
            total={2}
            roundLabel={`Muerte súbita ${suddenRounds}`}
            isSudden
            onSave={handleSuddenSave}
          />
        )}

        {phase === 'answer' && questions[answerIdx] && (
          <AnswerScreen
            key={answerIdx}
            question={questions[answerIdx]}
            guesserKey={questions[answerIdx].author === 'p1' ? 'p2' : 'p1'}
            guesserName={questions[answerIdx].author === 'p1' ? config.p2 : config.p1}
            authorName={questions[answerIdx].author === 'p1' ? config.p1 : config.p2}
            qNumber={answerIdx + 1}
            qTotal={questions.length}
            timerSeconds={config.timer}
            noLimit={config.noLimit}
            onAnswer={handleAnswer}
          />
        )}

        {phase === 'results' && (
          <ResultsScreen
            p1={config.p1} p2={config.p2} scores={scores} detail={detail}
            suddenEnabled={config.sudden} suddenRounds={suddenRounds}
            onSuddenDeath={startSuddenDeath}
            onReplay={() => { resetGame(); setPhase('setup') }}
            onHome={() => { resetGame(); setPhase('home') }}
          />
        )}

        {phase === 'school-config' && <SchoolConfigScreen onBack={() => setPhase('home')} onStart={startSchoolQuiz} />}

        {phase === 'school-quiz' && schoolQuestions[schoolIdx] && (
          <SchoolQuizScreen
            key={schoolIdx}
            question={schoolQuestions[schoolIdx]}
            qNumber={schoolIdx + 1}
            qTotal={schoolQuestions.length}
            timerSeconds={schoolConfig.timer}
            noLimit={schoolConfig.noLimit}
            mode={schoolConfig.mode}
            onAnswer={handleSchoolAnswer}
          />
        )}

        {phase === 'school-results' && (
          <SchoolResultsScreen
            score={schoolScore}
            total={schoolQuestions.length}
            detail={schoolDetail}
            sectionName={SECTIONS.find((s) => s.id === schoolConfig.sectionId)?.name}
            subjectName={schoolConfig.subjectName || 'Todas las materias'}
            mode={schoolConfig.mode}
            onReplay={() => setPhase('school-config')}
            onHome={() => setPhase('home')}
          />
        )}

        <footer className="mt-12 pb-4 text-center text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>
          Friend or Fake · Hecho para amigos 🎭
        </footer>
      </main>
    </div>
  )
}

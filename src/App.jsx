import { useEffect, useMemo, useState } from 'react'
import { isCorrectAnswer } from './lib/normalize.js'

// ---------- UI pequeñitos estilo juego ----------
function Button({ children, onClick, color = 'green', className = '', disabled = false, type = 'button' }) {
  const colors = {
    green: 'bg-[#58cc02] border-[#58a700] text-white',
    blue: 'bg-[#1cb0f6] border-[#1899d6] text-white',
    yellow: 'bg-[#ffc800] border-[#e0a800] text-[#4b4b00]',
    purple: 'bg-[#ce82ff] border-[#a560ff] text-white',
    pink: 'bg-[#ff86d0] border-[#e068af] text-white',
    white: 'bg-white border-slate-200 text-slate-700',
    red: 'bg-[#ff4b4b] border-[#d33131] text-white',
    dark: 'bg-slate-800 border-slate-950 text-white',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-3d w-full rounded-2xl border-b-4 px-6 py-4 text-lg font-extrabold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]} ${className}`}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

function PlayerBadge({ who, name }) {
  const isP1 = who === 'p1'
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold text-white shadow-sm ${
        isP1 ? 'bg-[#1cb0f6]' : 'bg-[#a560ff]'
      }`}
    >
      <span className="text-base">{isP1 ? '🔵' : '🟣'}</span> {name}
    </span>
  )
}

function Logo() {
  return (
    <div className="text-center">
      <div className="animate-bounce-soft mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-5xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border-2 border-amber-100">
        🎭
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-5xl">
        Friend <span className="text-[#1cb0f6]">or</span> <span className="text-[#a560ff]">Fake</span>
      </h1>
      <p className="mt-2 text-lg font-bold text-slate-500">¿Realmente se conocen? 😏</p>
    </div>
  )
}

function ScorePill({ label, points, color }) {
  return (
    <div className={`flex-1 rounded-2xl border-2 p-4 text-center ${color}`}>
      <div className="text-sm font-extrabold uppercase opacity-70">{label}</div>
      <div className="animate-point-pop text-4xl font-black">{points}</div>
      <div className="text-sm font-bold">pts ✨</div>
    </div>
  )
}

// ---------- Pantallas ----------
function HomeScreen({ onStartFriends }) {
  return (
    <div className="animate-pop-in mx-auto w-full max-w-2xl space-y-6">
      <Logo />
      <Card>
        <h2 className="mb-4 text-center text-2xl font-black text-slate-800">¿Cómo se juega? 🎮</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 border-2 border-blue-100 p-4 text-center">
            <div className="text-3xl">✍️</div>
            <div className="mt-1 font-black text-slate-700">1. Preguntan</div>
            <div className="text-sm font-semibold text-slate-500">Cada uno crea sus preguntas secretas</div>
          </div>
          <div className="rounded-2xl bg-purple-50 border-2 border-purple-100 p-4 text-center">
            <div className="text-3xl">🤔</div>
            <div className="mt-1 font-black text-slate-700">2. Adivinan</div>
            <div className="text-sm font-semibold text-slate-500">Responden contra el reloj ⏱️</div>
          </div>
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-100 p-4 text-center">
            <div className="text-3xl">🏆</div>
            <div className="mt-1 font-black text-slate-700">3. Ganan</div>
            <div className="text-sm font-semibold text-slate-500">1 punto por acierto. ¡Tabla final!</div>
          </div>
        </div>
      </Card>

      <Card className="!bg-gradient-to-br !from-white !to-amber-50">
        <h2 className="mb-3 text-center text-2xl font-black">Elige el modo ✨</h2>
        <div className="grid gap-3">
          <button
            onClick={onStartFriends}
            className="btn-3d rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-left hover:bg-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-slate-800">👯 Modo Amigos</div>
                <div className="text-sm font-bold text-slate-500">Se preguntan entre sí • ¡Disponible ahora!</div>
              </div>
              <div className="rounded-full bg-[#58cc02] px-4 py-2 text-sm font-black text-white">JUGAR ▶</div>
            </div>
          </button>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 opacity-70">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-slate-600">🎒 Preguntas del cole</div>
                <div className="text-sm font-bold text-slate-400">Escuela • Colegio • Bachillerato</div>
              </div>
              <div className="rounded-full bg-slate-200 px-4 py-2 text-sm font-black text-slate-500">PRONTO 🔒</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button color="green" onClick={onStartFriends}>Empezar con amigos 🚀</Button>
        </div>
      </Card>
      <p className="text-center text-sm font-bold text-slate-400">Tip: pásense el teléfono 📱 ¡No miren las respuestas secretas! 🙈</p>
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
    <div className="animate-pop-in mx-auto w-full max-w-2xl space-y-5">
      <Logo />
      <Card>
        <h2 className="text-2xl font-black text-slate-800">⚙️ Configura la partida</h2>
        <p className="font-semibold text-slate-500">Personaliza nombres, rondas y tiempo.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-4">
            <label className="text-sm font-black uppercase text-sky-600">🔵 Persona 1</label>
            <input
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              maxLength={20}
              placeholder="Ej: Vale"
              className="mt-2 w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-lg font-extrabold text-slate-700 outline-none focus:border-[#1cb0f6]"
            />
          </div>
          <div className="rounded-2xl border-2 border-purple-100 bg-purple-50 p-4">
            <label className="text-sm font-black uppercase text-purple-600">🟣 Persona 2</label>
            <input
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              maxLength={20}
              placeholder="Ej: Santi"
              className="mt-2 w-full rounded-xl border-2 border-white bg-white px-4 py-3 text-lg font-extrabold text-slate-700 outline-none focus:border-[#a560ff]"
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <label className="font-black text-slate-700">🔁 Rondas por jugador: <span className="text-xl text-amber-600">{rounds}</span></label>
            <span className="text-xs font-bold text-slate-500">Total preguntas: {rounds * 2}</span>
          </div>
          <input
            type="range" min={1} max={10} value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="mt-3 w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs font-black text-slate-400"><span>1 chill</span><span>5 pro</span><span>10 extremo 🔥</span></div>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-green-100 bg-green-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <label className="font-black text-slate-700">⏱️ Tiempo para responder: <span className="text-xl text-green-700">{noLimit ? '∞' : `${timer}s`}</span></label>
            <label className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-black text-slate-600 border">
              <input type="checkbox" checked={noLimit} onChange={(e) => setNoLimit(e.target.checked)} className="h-4 w-4 accent-green-600" />
              Sin límite
            </label>
          </div>
          {!noLimit && (
            <input type="range" min={5} max={60} step={5} value={timer} onChange={(e) => setTimer(Number(e.target.value))} className="mt-3 w-full accent-green-600" />
          )}
          <div className="text-xs font-bold text-slate-500">Si se acaba el tiempo: 0 puntos y sigue 👉</div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-pink-100 bg-pink-50 p-4">
          <div>
            <div className="font-black text-slate-700">⚡ Muerte súbita</div>
            <div className="text-sm font-semibold text-slate-500">Si empatan: 1 pregunta extra c/u hasta desempatar</div>
          </div>
          <button
            onClick={() => setSudden(!sudden)}
            className={`relative h-8 w-14 rounded-full transition-colors ${sudden ? 'bg-[#58cc02]' : 'bg-slate-300'}`}
            aria-label="muerte subita"
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${sudden ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <Button color="green" disabled={!canStart} onClick={() => onStart({ p1: p1.trim() || 'Persona 1', p2: p2.trim() || 'Persona 2', rounds, timer, noLimit, sudden })}>
            ¡A preguntar! ✍️
          </Button>
          <Button color="white" onClick={onBack}>← Volver</Button>
          {!canStart && <p className="text-center text-sm font-bold text-red-500">Escribe los dos nombres para continuar ✏️</p>}
        </div>
      </Card>
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

  return (
    <div className="animate-pop-in mx-auto w-full max-w-2xl space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-black text-white">
          ✍️ Creando preguntas {current}/{total} {isSudden ? '⚡ MUERTE SÚBITA' : ''}
        </div>
        <h2 className="mt-3 text-3xl font-black text-slate-800">Turno de {authorName} 🎤</h2>
        <p className="mx-auto mt-2 max-w-md rounded-2xl bg-amber-100 border-2 border-amber-200 px-4 py-2 font-bold text-amber-800">
          📱 Pasa el teléfono a <b>{authorName}</b>. <br />{otherName}, ¡no mires! 🙈
        </p>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <PlayerBadge who={authorKey} name={authorName} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-500">{roundLabel}</span>
        </div>
        <label className="font-black text-slate-700">Tu pregunta ❓</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: ¿Cuál es mi color favorito?"
          maxLength={120}
          className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold outline-none focus:border-[#1cb0f6] focus:bg-white"
        />
        <label className="mt-4 block font-black text-slate-700">Tu respuesta secreta 🔒 <span className="font-semibold text-slate-400">(luego hay que adivinarla)</span></label>
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Ej: Azul"
          maxLength={80}
          className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold outline-none focus:border-[#a560ff] focus:bg-white"
        />
        <p className="mt-2 text-sm font-semibold text-slate-400">Se valida sin tildes ni mayúsculas: “Azúl” = “azul” ✅</p>
        <div className="mt-4">
          <Button color={authorKey === 'p1' ? 'blue' : 'purple'} disabled={!canSave} onClick={handle}>
            Guardar y continuar 👉 ({current}/{total})
          </Button>
        </div>
        {/* progreso */}
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-2.5 flex-1 rounded-full ${i < current - 1 ? 'bg-green-400' : i === current - 1 ? 'bg-amber-400' : 'bg-slate-200'}`} />
          ))}
        </div>
      </Card>
    </div>
  )
}

function AnswerScreen({ question, guesserName, authorName, guesserKey, qNumber, qTotal, timerSeconds, noLimit, onAnswer }) {
  const [guess, setGuess] = useState('')
  const [left, setLeft] = useState(timerSeconds)
  const [feedback, setFeedback] = useState(null) // {isCorrect, correct, timedOut, guessVal}
  const total = timerSeconds

  useEffect(() => {
    setGuess('')
    setFeedback(null)
    setLeft(timerSeconds)
  }, [qNumber, timerSeconds])

  useEffect(() => {
    if (noLimit || feedback) return
    if (left <= 0) {
      const fb = { isCorrect: false, correct: question.answer, timedOut: true, guessVal: guess }
      setFeedback(fb)
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
    <div className="animate-pop-in mx-auto w-full max-w-2xl space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-black text-white">
          🤔 Respondiendo {qNumber}/{qTotal}
        </div>
        <h2 className="mt-3 text-3xl font-black text-slate-800">¡Adivina, {guesserName}! ⚡</h2>
        <p className="mt-1 font-bold text-slate-500">Pregunta de {authorName} • +1 punto si aciertas 🎯</p>
      </div>

      {!noLimit && !feedback && (
        <div className={`rounded-2xl border-2 bg-white p-3 ${danger ? 'border-red-200 animate-timer-danger' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between text-sm font-black">
            <span>⏱️ {left}s</span>
            <span className={danger ? 'text-red-500' : 'text-slate-500'}>{danger ? '¡Corre! 🏃' : 'Tú puedes 💪'}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${left <= 5 ? 'bg-red-400' : left <= 10 ? 'bg-amber-400' : 'bg-green-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <PlayerBadge who={guesserKey} name={guesserName} />
          <span className="text-2xl">❓</span>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-slate-100 p-5 text-center">
          <div className="text-sm font-black uppercase tracking-wide text-slate-400">Pregunta</div>
          <div className="mt-1 text-2xl font-black text-slate-800">“{question.text}”</div>
        </div>

        {!feedback ? (
          <div className="mt-4">
            <label className="font-black text-slate-700">Tu respuesta ✏️</label>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              placeholder="Escribe lo que crees..."
              maxLength={80}
              autoFocus
              className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold outline-none focus:border-green-400 focus:bg-white"
            />
            <div className="mt-3">
              <Button color="green" disabled={guess.trim().length === 0} onClick={submit}>Responder ✅</Button>
            </div>
          </div>
        ) : (
          <div className={`animate-pop-in mt-4 rounded-2xl border-2 p-5 text-center ${feedback.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {feedback.timedOut ? (
              <>
                <div className="text-5xl">⏰</div>
                <div className="mt-2 text-2xl font-black text-slate-800">¡Tiempo agotado!</div>
                <div className="font-bold text-slate-500">0 puntos esta vez. Era: <b className="text-slate-800">“{feedback.correct}”</b></div>
                <div className="text-sm font-semibold text-slate-400">Dijiste: “{feedback.guessVal || '—'}”</div>
              </>
            ) : feedback.isCorrect ? (
              <>
                <div className="animate-point-pop text-5xl">🎉</div>
                <div className="mt-2 text-2xl font-black text-green-700">¡Correcto! +1 punto ✨</div>
                <div className="font-bold text-slate-600">“{feedback.correct}” ¡Se conocen! 💛</div>
              </>
            ) : (
              <>
                <div className="text-5xl">😅</div>
                <div className="mt-2 text-2xl font-black text-slate-800">¡Casi! Era: “{feedback.correct}”</div>
                <div className="font-bold text-slate-500">Dijiste: “{feedback.guessVal}” • 0 puntos</div>
              </>
            )}
            <div className="mt-4">
              <Button color={feedback.isCorrect ? 'green' : 'blue'} onClick={() => onAnswer(feedback)}>
                {qNumber === qTotal ? 'Ver resultados 🏆' : 'Siguiente 👉'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function ResultsScreen({ p1, p2, scores, detail, suddenEnabled, suddenRounds, onSuddenDeath, onReplay, onHome }) {
  const winner = scores.p1 === scores.p2 ? null : scores.p1 > scores.p2 ? 'p1' : 'p2'
  const winnerName = winner === 'p1' ? p1 : winner === 'p2' ? p2 : null
  const totalQs = detail.length

  return (
    <div className="animate-pop-in mx-auto w-full max-w-3xl space-y-5">
      <div className="text-center">
        <div className="text-6xl">{winner ? '🏆' : '🤝'}</div>
        <h2 className="mt-2 text-4xl font-black text-slate-800">
          {winner ? `¡Gana ${winnerName}!` : '¡Empate! 😱'}
        </h2>
        <p className="font-bold text-slate-500">
          {winner
            ? (winner === 'p1' ? `${p1} conoce mejor a ${p2} 💛` : `${p2} conoce mejor a ${p1} 💜`)
            : suddenEnabled
              ? 'Están muy parejos... ¡Muerte súbita! ⚡'
              : '¡Son igual de friends (o de fakes)! 😂'}
        </p>
        {suddenRounds > 0 && <p className="mt-1 inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-black text-pink-600">⚡ Rondas de muerte súbita: {suddenRounds}</p>}
      </div>

      <Card>
        <h3 className="text-center text-xl font-black text-slate-700">📊 Tabla final</h3>
        <div className="mt-3 flex gap-3">
          <ScorePill label={`🔵 ${p1}`} points={scores.p1} color="border-sky-200 bg-sky-50 text-sky-700" />
          <div className="flex items-center text-2xl font-black text-slate-300">VS</div>
          <ScorePill label={`🟣 ${p2}`} points={scores.p2} color="border-purple-200 bg-purple-50 text-purple-700" />
        </div>
        {/* barra comparativa */}
        <div className="mt-4">
          <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-[#1cb0f6] transition-all" style={{ width: `${totalQs ? (scores.p1 / totalQs) * 100 : 50}%` }} />
            <div className="bg-[#a560ff] transition-all" style={{ width: `${totalQs ? (scores.p2 / totalQs) * 100 : 50}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs font-black text-slate-400">
            <span>{p1}: {scores.p1}/{totalQs}</span><span>{p2}: {scores.p2}/{totalQs}</span>
          </div>
        </div>

        {!winner && suddenEnabled && (
          <div className="mt-4">
            <Button color="pink" onClick={onSuddenDeath}>⚡ Desempatar: muerte súbita (1 pregunta c/u)</Button>
          </div>
        )}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button color="green" onClick={onReplay}>🔄 Jugar de nuevo</Button>
          <Button color="white" onClick={onHome}>🏠 Inicio</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-black text-slate-700">🧾 Detalle ronda por ronda</h3>
        <div className="mt-3 space-y-2">
          {detail.map((d, i) => (
            <div key={i} className={`rounded-2xl border-2 p-3 ${d.isCorrect ? 'border-green-100 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="font-extrabold text-slate-700">{i + 1}. “{d.questionText}”</div>
                <div className="text-xl">{d.isCorrect ? '✅' : d.timedOut ? '⏰' : '❌'}</div>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-500">
                De <b>{d.author === 'p1' ? p1 : p2}</b> • Adivina <b>{d.guesser === 'p1' ? p1 : p2}</b> • Dijo “{d.guess || '—'}” • Era “{d.correctAnswer}”
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---------- App principal ----------
export default function App() {
  const [phase, setPhase] = useState('home')
  const [config, setConfig] = useState({ p1: 'Vale', p2: 'Santi', rounds: 3, timer: 15, noLimit: false, sudden: true })

  const [questions, setQuestions] = useState([]) // {id, author, text, answer}
  const [createIdx, setCreateIdx] = useState(0)
  const [answerIdx, setAnswerIdx] = useState(0)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })
  const [detail, setDetail] = useState([])

  const [suddenDrafts, setSuddenDrafts] = useState([])
  const [suddenCreateIdx, setSuddenCreateIdx] = useState(0)
  const [suddenRounds, setSuddenRounds] = useState(0)

  const totalToCreate = useMemo(() => config.rounds * 2, [config.rounds])

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

  const startCreating = (c) => {
    resetGame(c)
    setPhase('create')
  }

  const handleSaveQuestion = (text, answer) => {
    const author = createIdx % 2 === 0 ? 'p1' : 'p2'
    const q = { id: Date.now() + createIdx, author, text, answer }
    const next = [...questions, q]
    setQuestions(next)
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
    if (fb.isCorrect) {
      setScores((s) => ({ ...s, [guesser]: s[guesser] + 1 }))
    }
    setDetail((d) => [...d, {
      qId: q.id,
      questionText: q.text,
      author: q.author,
      guesser,
      guess: fb.guessVal,
      correctAnswer: fb.correct,
      isCorrect: fb.isCorrect,
      timedOut: fb.timedOut,
    }])
    if (answerIdx + 1 >= questions.length) {
      setPhase('results')
    } else {
      setAnswerIdx(answerIdx + 1)
    }
  }

  const handleSuddenSave = (text, answer) => {
    const author = suddenCreateIdx % 2 === 0 ? 'p1' : 'p2'
    const q = { id: Date.now() + suddenCreateIdx + Math.random(), author, text, answer }
    const drafts = [...suddenDrafts, q]
    if (suddenCreateIdx + 1 >= 2) {
      setQuestions((prev) => [...prev, ...drafts])
      setSuddenDrafts([])
      setSuddenCreateIdx(0)
      // answerIdx ya apunta al final de las anteriores, seguirá con las nuevas
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

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {phase !== 'home' && (
          <div className="mb-5 flex items-center justify-center gap-2 text-sm font-black text-slate-400">
            <span className={phase === 'setup' ? 'text-slate-800' : ''}>⚙️ Config</span>
            <span>›</span>
            <span className={phase === 'create' || phase === 'sudden-create' ? 'text-slate-800' : ''}>✍️ Preguntas</span>
            <span>›</span>
            <span className={phase === 'answer' ? 'text-slate-800' : ''}>🤔 Respuestas</span>
            <span>›</span>
            <span className={phase === 'results' ? 'text-slate-800' : ''}>🏆 Resultados</span>
          </div>
        )}

        {phase === 'home' && <HomeScreen onStartFriends={startFriendsSetup} />}

        {phase === 'setup' && (
          <SetupScreen initial={config} onBack={() => setPhase('home')} onStart={startCreating} />
        )}

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
            roundLabel={`Muerte súbita ${suddenRounds} ⚡`}
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
            p1={config.p1}
            p2={config.p2}
            scores={scores}
            detail={detail}
            suddenEnabled={config.sudden}
            suddenRounds={suddenRounds}
            onSuddenDeath={startSuddenDeath}
            onReplay={() => { resetGame(); setPhase('setup') }}
            onHome={() => { resetGame(); setPhase('home') }}
          />
        )}

        <footer className="mt-8 text-center text-sm font-bold text-slate-400">
          Hecho con 💛 para saber si son Friend or Fake 🎭
        </footer>
      </div>
    </div>
  )
}

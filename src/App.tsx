import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Copy, Heart, Leaf, LockKeyhole, MailOpen, Sparkles, X } from 'lucide-react'
import { compliments, dateIdeas, letter, questions } from './data/content'
import { Lily } from './components/Lily'
import { BotanicalMark, FinalBouquet, HugGarden, InvitationSprig } from './components/BotanicalScenes'

type Answers = Record<string, string>
const WHATSAPP_NUMBER = '525566742864'
const chapters = ['Una flor bonita para ti', 'Cositas bonitas', 'Días grises', 'Pongámonos al día', 'Otra cita contigo', 'Una cartita']
const freeTextQuestion = '¿Hay algo que te gustaría contarme o que quisieras que supiera?'
const invitationDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Todavía no sabo']
const invitationOptions = ['Sí, me encantaría', 'Podría ser, vamos viendo', 'Prefiero que sigamos platicando pipipip', 'Por ahora necesito mi espacio']
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? ''
const EMAIL_SUBJECT = 'Un detalle para Monita — Nuevas respuestas'
const initialAnswers = (): Answers => {
  try { return JSON.parse(sessionStorage.getItem('jardin-monita') || '{}') as Answers } catch { return {} }
}

function PlanMark({ title, mark }: { title: string; mark: string }) {
  if (title !== 'Cafecito y postre') return <span>{mark}</span>
  return <svg className="coffee-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h11v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9Zm11 2h2a2 2 0 0 1 0 4h-2M8 6c-1-1 .5-2 0-3m4 3c-1-1 .5-2 0-3"/></svg>
}

function ResponseSelect({ label, value, options, disabled, onChange }: { label: string; value: string; options: readonly string[]; disabled: boolean; onChange: (value: string) => void }) {
  return <label className="response-field"><span>{label}</span><select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}><option value="">Sin responder</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
}

export default function App() {
  const [chapter, setChapter] = useState(0)
  const [opened, setOpened] = useState(false)
  const [comfort, setComfort] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [datePick, setDatePick] = useState('')
  const [day, setDay] = useState('')
  const [invitation, setInvitation] = useState('')
  const [letterOpen, setLetterOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [share, setShare] = useState<string[]>([])
  const [editedSummary, setEditedSummary] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'empty' | 'sending' | 'success' | 'error'>('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const submissionInFlight = useRef(false)
  const shareTrigger = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const showArt = chapter === 0 || chapter === 2 || chapter === 4

  useEffect(() => {
    try { sessionStorage.setItem('jardin-monita', JSON.stringify(answers)) } catch { /* session storage may be disabled */ }
  }, [answers])

  const transition = reduceMotion ? { duration: 0.12 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }
  const summary = useMemo(() => {
    const lines = ['Holaaa, ya vi el detalle que me hiciste y estas fueron algunas de mis respuestas…']
    const labels: Record<string, string> = { unwind: 'Para desconectarme', wish: 'Algo que me ilusiona', plan: 'Un plan contigo', date: 'Mi plan favorito', day: 'Un día posible', invite: 'Sobre vernos' }
    for (const key of share) {
      const value = key === 'date' ? datePick : key === 'day' ? day : key === 'invite' ? invitation : answers[key]
      if (value) lines.push(`${labels[key]}: ${value}`)
    }
    return lines.join('\n')
  }, [share, datePick, day, invitation, answers])

  useEffect(() => setEditedSummary(summary), [summary])

  useEffect(() => {
    if (!shareOpen) return
    document.querySelector<HTMLButtonElement>('.dialog-close')?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setShareOpen(false)
      if (event.key !== 'Tab') return
      const items = document.querySelectorAll<HTMLElement>('.share-dialog button, .share-dialog a, .share-dialog input, .share-dialog textarea')
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); shareTrigger.current?.focus() }
  }, [shareOpen])

  function updateAnswer(key: string, value: string) { setAnswers(current => ({ ...current, [key]: value })) }
  function editAnswer(key: string, value: string) { updateAnswer(key, value); setSubmissionStatus('idle'); setSubmissionMessage('') }
  function next() { setChapter(value => Math.min(value + 1, 5)); window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' }) }
  function previous() { setChapter(value => Math.max(value - 1, 0)); window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' }) }
  function toggleShare(key: string) { setShare(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]) }
  async function submitResponses(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submissionInFlight.current) return
    const entries = [
      ...questions.map(question => ({ label: question.title, value: answers[question.key] || '' })),
      { label: freeTextQuestion, value: answers.note || '' },
      { label: '¿Qué se te antoja?', value: datePick },
      { label: '¿Qué día se te acomodaría mejor?', value: day },
      { label: '¿Te gustaría que nos viéramos?', value: invitation },
    ].filter(entry => entry.value.trim())
    if (!entries.length) {
      setSubmissionStatus('empty')
      setSubmissionMessage('Aún no hay respuestas para enviar. Puedes contestar solo lo que te nazca o continuar sin enviar.')
      return
    }
    if (!WEB3FORMS_ACCESS_KEY) {
      setSubmissionStatus('error')
      setSubmissionMessage('El envío por correo no está disponible por ahora. Puedes continuar sin enviar tus respuestas.')
      return
    }
    submissionInFlight.current = true
    setSubmissionStatus('sending')
    setSubmissionMessage('')
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: EMAIL_SUBJECT,
          from_name: 'Un detalle para Monita',
          botcheck: '',
          message: entries.map(entry => `${entry.label}\n${entry.value}`).join('\n\n'),
        }),
      })
      const result = await response.json()
      if (!response.ok || result?.success !== true) throw new Error('Submission was not confirmed')
      setSubmissionStatus('success')
      setSubmissionMessage('Listooo, tus respuestas llegaron. Gracias por compartir un pedacito de ti conmigo. ♡')
    } catch {
      setSubmissionStatus('error')
      setSubmissionMessage('No fue posible enviar tus respuestas. Puedes intentarlo de nuevo o continuar sin enviarlas.')
    } finally {
      submissionInFlight.current = false
    }
  }
  async function copySummary() {
    try {
      let written = false
      try {
        if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(editedSummary); written = true }
      } catch { /* use the selection fallback when clipboard permission is unavailable */ }
      if (!written) {
        const field = document.createElement('textarea')
        field.value = editedSummary
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.append(field)
        field.select()
        const copied = document.execCommand('copy')
        field.remove()
        if (!copied) throw new Error('Clipboard unavailable')
      }
      setCopyStatus('copied')
    } catch { setCopyStatus('failed') }
    window.setTimeout(() => setCopyStatus('idle'), 1800)
  }

  return (
    <main className="garden-shell">
      <div className="paper-grain" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#inicio" onClick={e => { e.preventDefault(); setChapter(0); setOpened(false) }} aria-label="Volver al comienzo">
          <span className="wordmark-icon"><Leaf size={15} strokeWidth={1.6}/></span><span>un detalle <i>para ti</i></span>
        </a>
        <span className="top-note">hecho con cariño <Heart size={12} fill="currentColor" strokeWidth={0}/></span>
      </header>

      <section className="journey" aria-label="Experiencia en seis capítulos">
        <div className="journey-head"><span className="journey-title">UN PEQUEÑO RECORRIDO</span><span>{String(chapter + 1).padStart(2, '0')} <i>/</i> 06</span></div>
        <div className="progress-track" role="progressbar" aria-label="Progreso de la experiencia" aria-valuemin={1} aria-valuemax={6} aria-valuenow={chapter + 1}>
          {chapters.map((item, index) => <span className={`progress-segment ${index <= chapter ? 'active' : ''}`} key={item} />)}
        </div>
        <nav className="chapter-nav" aria-label="Capítulos">
          {chapters.map((item, index) => <button key={item} className={`chapter-dot ${chapter === index ? 'current' : ''} ${index < chapter ? 'passed' : ''}`} aria-label={`Capítulo ${index + 1}: ${item}`} aria-current={chapter === index ? 'step' : undefined} onClick={() => index <= chapter ? setChapter(index) : undefined} disabled={index > chapter}><span>{index < chapter ? <Check size={11}/> : index + 1}</span><small>{item}</small></button>)}
        </nav>
      </section>

      <div className={`main-stage scene-chapter-${chapter} ${showArt ? '' : 'main-stage--quiet'}`}>
        {showArt && <div className={`art-column art-chapter-${chapter}`} aria-hidden="true">
          <div className="art-halo" />
          {chapter === 0 && <>
            <Lily stage={opened ? 'open' : 'closed'} className={`hero-lily ${opened ? 'flowering' : 'breathing'}`} decorative/>
            <span className="art-caption">LILIUM · UNA FLOR PARA TI AMOR DE MI VIDA</span>
            <span className="floating-leaf leaf-a">❧</span><span className="floating-leaf leaf-b">✧</span>
          </>}
          {chapter === 2 && <HugGarden hugged={comfort}/>}
          {chapter === 4 && <InvitationSprig/>}
        </div>}
        <div className="content-column">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={chapter} className="chapter-content" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }} transition={transition}>
              <div className="chapter-kicker"><span className="kicker-mark">✳</span>{chapters[chapter]}</div>
              {chapter === 0 && <>
                {!opened ? <div className="welcome-copy"><p className="eyebrow">una cosita hecha especialmente para ti</p><h1>Tengo algo<br/><em>pequeñito</em> para ti<span className="period">.</span></h1><p className="intro-text">Un pequeño rincón para hacer una pausa,<br className="desktop-break"/> respirar y encontrarte con algo bonito.</p><button className="button button-primary" onClick={() => setOpened(true)}>Descubrir la sorpresa <ArrowRight size={16}/></button><p className="micro-note"><Sparkles size={12}/> toma el tiempo que quieras y necesites</p></div> : <div className="welcome-copy revealed"><p className="eyebrow">floreció algo bonito</p><h1>Un detalle<br/><em>para Monita191102</em><span className="period">.</span></h1><blockquote>Hay personas que, incluso en los días más grises, merecen encontrarse con algo bonito y especial.<br/><br/>Y tú, monita, eres una de ellas.</blockquote><button className="button button-primary" onClick={next}>Continuar <ArrowRight size={16}/></button></div>}
              </>}
              {chapter === 1 && <>
                <p className="eyebrow">pequeñas cosas que quizá ya sabes, pero mereces oír</p><h1>Hay tantas cositas<br/><em>bonitas en ti…</em></h1><p className="body-copy">Y algunas merecen recordarse más seguido.</p>
                <div className="compliment-list">{compliments.map((item, index) => <details className="compliment" key={item.title}><summary><span className="compliment-icon"><BotanicalMark index={index}/></span><span><small>0{index + 1} · UNA COSITA</small><strong>{item.title}</strong></span><span className="plus">+</span></summary><p>{item.text}</p></details>)}</div>
                <div className="chapter-actions"><button className="button button-text" onClick={next}>Seguir a mi ritmo <ArrowRight size={15}/></button></div>
              </>}
              {chapter === 2 && <>
                <p className="eyebrow">sin tener que encontrar las palabras perfectas</p><h1>También mereces cariño<br/><em>en tus días grises amor de mi vida.</em></h1>
                <div className="gentle-note"><span className="note-flower">✿</span><p>Sé que últimamente han sido días difíciles y que hay cosas que duelen mucho más de lo que las palabras pueden explicar.</p><p>No quiero decirte cómo sentirte ni pretender que todo se arregla con una sonrisa.</p><p>Solo quería recordarte que no tienes que estar bien todo el tiempo.</p><p>Eres alguien muy especial para mí, y si algún día necesitas platicar, distraerte o simplemente sentirte acompañada, quiero que sepas que puedes contar conmigo para todo.</p></div>
                <button className="button button-soft" onClick={() => setComfort(value => !value)}>{comfort ? 'Guardar este abracito' : 'Necesito un abracito'} <Heart size={15}/></button>
                <p className={`hug-message-inline ${comfort ? 'visible' : ''}`} aria-live="polite">{comfort ? 'Te mando uno de esos abrazos largos que no necesitan palabras y que te hace sentir segura.' : ''}</p>
                <div className="chapter-actions"><button className="button button-text" onClick={next}>Continuar <ArrowRight size={15}/></button></div>
              </>}
              {chapter === 3 && <>
                <p className="eyebrow">sin prisa, y puedes saltarte lo que quieras</p><h1>Ahora cuéntame<br/><em>un poquito de ti…</em></h1><p className="body-copy">Me gusta saber cómo estás, incluso en las cosas más pequeñas.</p>
                <div className="quiz-progress"><span>UN RATITO PARA PLATICAR</span><span>{Math.min(quizStep + 1, 5)} <i>/</i> 05</span><div><b style={{ width: `${Math.max(10, (quizStep / 5) * 100)}%` }}/></div></div>
                {quizStep < 4 ? <div className="question-panel" key={quizStep}><span className="question-number">0{quizStep + 1}</span><h2>{questions[quizStep].title}</h2><div className="choice-list">{questions[quizStep].options.map(option => <button key={option} className={`choice ${answers[questions[quizStep].key] === option ? 'selected' : ''}`} onClick={() => updateAnswer(questions[quizStep].key, option)}><span>{option}</span><span className="choice-check">{answers[questions[quizStep].key] === option ? <Check size={14}/> : ''}</span></button>)}</div></div> : <div className="question-panel"><span className="question-number">05</span><h2>{freeTextQuestion}</h2><label className="sr-only" htmlFor="note">Tu mensajito (opcional)</label><textarea id="note" maxLength={500} placeholder="Si te nace, aquí te leo…" value={answers.note || ''} onChange={e => updateAnswer('note', e.target.value)}/><span className="field-hint">opcional · {answers.note?.length || 0}/500</span></div>}
                <div className="quiz-controls"><button className="button button-text" onClick={() => quizStep > 0 ? setQuizStep(value => value - 1) : previous()}><ArrowLeft size={15}/> Atrás</button><button className="button button-text" onClick={() => quizStep < 4 ? setQuizStep(value => value + 1) : next()}>{quizStep < 4 ? 'Siguiente' : 'Terminar cuando quiera'} <ArrowRight size={15}/></button></div><button className="skip-link" onClick={next}>Saltar este ratito</button>
              </>}
              {chapter === 4 && <>
                <p className="eyebrow">sin expectativas, solo si te nace</p><h1>¿Y si nos regalamos<br/><em>otro recuerdo bonito más a nuestra bella vida?</em></h1><div className="gentle-note date-intro"><p>Me encantó poder verte y platicar contigo estos días.</p><p>Y aunque me gusta mucho compartir tiempo contigo, también quiero respetar tus tiempos y cómo te sientes.</p><p>Si te nace y te sientes comoda, me encantaría que planeáramos otra salida juntos.</p></div>
                <h2 className="small-question">¿Qué se te antoja?</h2><div className="date-grid">{dateIdeas.map(item => <button className={`date-card ${datePick === item.title ? 'selected' : ''}`} key={item.title} onClick={() => setDatePick(item.title)}><PlanMark {...item}/>{item.title}</button>)}</div>
                <h2 className="small-question">¿Qué día se te acomodaría mejor?</h2><div className="day-row">{invitationDays.map(item => <button className={`day-chip ${day === item ? 'selected' : ''}`} key={item} onClick={() => setDay(item)}>{item}</button>)}</div>
                <h2 className="small-question">¿Te gustaría que nos viéramos?</h2><div className="invite-list">{invitationOptions.map(item => <button className={`invite-choice ${invitation === item ? 'selected' : ''}`} key={item} onClick={() => setInvitation(item)}>{item}<span>{invitation === item ? <Check size={14}/> : <i className="radio-dot"/>}</span></button>)}</div>
                {invitation && <p className="kind-response" role="status">{invitation === 'Sí, me encantaría' ? 'Me haría muy feliz. Ya encontraremos un día bonito.' : invitation === 'Podría ser, vamos viendo' ? 'Claro, sin prisa. Podemos ir viendo cómo te sientes.' : invitation === 'Prefiero que sigamos platicando pipipipi' ? 'Me encanta saber de ti. Sigamos con baby steps.' : 'Lo entiendo y respeto tu espacio. Aquí estoy con todo el amor para ti.'}</p>}
                <form className="email-response-form" onSubmit={submitResponses} aria-busy={submissionStatus === 'sending'}>
                  <h2 className="small-question">¿Quieres compartirme tus respuestas?</h2>
                  <p className="body-copy">Si decides enviarlas, recibiré por correo todas las respuestas que aparecen aquí, incluidas las personales y tu mensaje libre. Puedes editar o dejar sin responder lo que prefieras. No se enviará nada hasta que pulses el botón. «Ir a mi cartita» te permite continuar sin enviar.</p>
                  <span className="preview-label">VISTA PREVIA · EDITABLE</span>
                  <div className="response-review">
                    {questions.map(question => <ResponseSelect key={question.key} label={question.title} value={answers[question.key] || ''} options={question.options} disabled={submissionStatus === 'sending'} onChange={value => editAnswer(question.key, value)}/>)}
                    <label className="response-field"><span>{freeTextQuestion}</span><textarea className="share-preview" maxLength={500} value={answers.note || ''} disabled={submissionStatus === 'sending'} onChange={event => editAnswer('note', event.target.value)}/><small>opcional · {(answers.note || '').length}/500</small></label>
                    <ResponseSelect label="¿Qué se te antoja?" value={datePick} options={dateIdeas.map(item => item.title)} disabled={submissionStatus === 'sending'} onChange={value => { setDatePick(value); setSubmissionStatus('idle'); setSubmissionMessage('') }}/>
                    <ResponseSelect label="¿Qué día se te acomodaría mejor?" value={day} options={invitationDays} disabled={submissionStatus === 'sending'} onChange={value => { setDay(value); setSubmissionStatus('idle'); setSubmissionMessage('') }}/>
                    <ResponseSelect label="¿Te gustaría que nos viéramos?" value={invitation} options={invitationOptions} disabled={submissionStatus === 'sending'} onChange={value => { setInvitation(value); setSubmissionStatus('idle'); setSubmissionMessage('') }}/>
                  </div>
                  <button className="button button-primary" type="submit" disabled={submissionStatus === 'sending' || submissionStatus === 'success'}>{submissionStatus === 'sending' ? 'Enviando…' : submissionStatus === 'success' ? 'Respuestas recibidas' : 'Enviar mis respuestas'}</button>
                  {submissionMessage && <p className={`email-feedback ${submissionStatus}`} role={submissionStatus === 'error' ? 'alert' : 'status'}>{submissionMessage}</p>}
                </form>                <div className="chapter-actions"><button className="button button-text" onClick={next}>Ir a mi cartita <ArrowRight size={15}/></button></div>
              </>}
              {chapter === 5 && <>
                <p className="eyebrow">unas palabras que quería dejarte por ser la persona que más amo y que mas me importa en este munbdo</p><h1>Una cartita<br/><em>para ti amor de mi vida.</em></h1>
                <div className={`envelope ${letterOpen ? 'open' : ''}`}>
                  {letterOpen && <div className="letter-paper"><p>{letter}</p><p className="letter-footer">Hecho con amor, especialmente para ti mi monita191102@hotmail.com.</p></div>}
                  <div className="envelope-back" aria-hidden="true"/><div className="envelope-front" aria-hidden="true"/><div className="envelope-flap" aria-hidden="true"/><span className="envelope-seal" aria-hidden="true"><BotanicalMark index={4}/></span>
                </div>
                {!letterOpen ? <button className="button button-primary" onClick={() => setLetterOpen(true)}>Abrir la cartita <MailOpen size={16}/></button> : <div className="farewell"><FinalBouquet/><p>No tienes que sonreír o estar al 100% todos los días. Solo quería recordarte lo hermosa y especial que eres para mi, incluso cuando el mundo se siente un poquito más pesado.</p><p className="signature">Aquí estoy para ti siempre Montse.</p><div className="end-actions"><button className="button button-soft" onClick={() => { setChapter(0); setOpened(false); setLetterOpen(false) }}>Volver al inicio <Leaf size={15}/></button><button ref={shareTrigger} className="button button-primary" onClick={() => setShareOpen(true)}>Compartir mis respuestas por wasap <ArrowRight size={15}/></button></div></div>}
                <p className="privacy-note"><LockKeyhole size={12}/> Tus respuestas se guardan solo en esta sesión del safaris.</p>
              </>}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <footer className="site-footer"><span>CON CARIÑO, PARA MI MONITA</span><span className="footer-sprig">— &nbsp;un pequeño detalle de amor para una gran mujer&nbsp; —</span><span>HECHO CON AMOR <span className="footer-flower">✿</span></span></footer>
      {shareOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShareOpen(false) }}><section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title"><button className="dialog-close" aria-label="Cerrar" onClick={() => setShareOpen(false)}><X size={18}/></button><p className="eyebrow">tú decides qué compartir</p><h2 id="share-title">Solo lo que te nazca.</h2><p className="body-copy">Espero te puedas abrir conmigo hoy en que no fue un día facil para ti.</p><div className="share-options">{[['unwind','Qué te antoja para desconectarte'],['wish','Algo que te ilusiona'],['plan','El tipo de plan contigo'],['date','El plan que elegiste'],['day','El día que te viene bien'],['invite','Tu respuesta sobre vernos']].map(([key,label]) => <label key={key} className="share-option"><input type="checkbox" checked={share.includes(key)} onChange={() => toggleShare(key)}/><span>{label}</span></label>)}</div><label className="preview-label" htmlFor="share-preview">VISTA PREVIA · PUEDES EDITARLA</label><textarea id="share-preview" className="share-preview" value={editedSummary} onChange={event => setEditedSummary(event.target.value)}/><div className="share-actions"><button className="button button-soft" onClick={copySummary}><Copy size={14}/>{copyStatus === 'copied' ? 'Copiado' : copyStatus === 'failed' ? 'No se pudo copiar' : 'Copiar texto'}</button><a className="button button-primary" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(editedSummary)}`} target="_blank" rel="noreferrer">Abrir Wasap <ArrowRight size={15}/></a></div><p className="privacy-note">WhatsApp se abrirá con el texto listo; no se envía hasta que tú lo confirmes allí.</p></section></div>}
    </main>
  )
}

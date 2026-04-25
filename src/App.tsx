import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { t } from './data/i18n'
import type { Lang } from './data/i18n'
import { BIKE_COLORS } from './data/colors'
import { supabase } from './lib/supabase'

const BEIGE  = '#F5F2EC'
const DARK   = '#1C1C1C'
const GOLD   = '#C9A870'
const MUTED  = '#6A6862'
const BORDER = '#E2DED8'

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  animate: { opacity: 1, x: 0 },
  exit:    (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

type Answers = {
  transport: string
  age: string
  city: string
  bike: string
  intent: string
  colors: string[]
}

const STEPS = ['transport', 'age', 'city', 'bike', 'intent', 'colors', 'lead'] as const
type Step = typeof STEPS[number]

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '16px 20px', borderRadius: '14px', textAlign: 'right',
      border: `2px solid ${selected ? GOLD : BORDER}`,
      backgroundColor: selected ? `${GOLD}18` : '#FFFFFF',
      color: selected ? DARK : MUTED,
      fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: selected ? 700 : 400,
      cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '12px',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      minHeight: '56px',
    }}>
      <span style={{ flex: 1 }}>{label}</span>
      {selected && <span style={{ color: GOLD, fontSize: '20px', flexShrink: 0 }}>✓</span>}
    </button>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ width: '100%', height: '3px', backgroundColor: BORDER, borderRadius: '2px', marginBottom: '32px' }}>
      <motion.div
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '100%', backgroundColor: GOLD, borderRadius: '2px' }}
      />
    </div>
  )
}

function ColorPicker({ answers, setAnswers, lang }: { answers: Answers; setAnswers: (a: Answers) => void; lang: Lang }) {
  const tx = t[lang]
  const toggle = (id: string) => {
    const current = answers.colors
    if (current.includes(id)) {
      setAnswers({ ...answers, colors: current.filter(c => c !== id) })
    } else if (current.length < 3) {
      setAnswers({ ...answers, colors: [...current, id] })
    }
  }
  const rankOf = (id: string) => answers.colors.indexOf(id) + 1
  const img1Colors = BIKE_COLORS.filter(c => c.image === 1)
  const img2Colors = BIKE_COLORS.filter(c => c.image === 2)

  const renderGroup = (colors: typeof BIKE_COLORS, label: string, imgNum: number) => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        width: '100%', aspectRatio: '16/7', borderRadius: '16px',
        backgroundColor: '#E8E4DC', border: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ textAlign: 'center', color: MUTED, fontFamily: "'Heebo', sans-serif" }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🚲</div>
          <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: '11px', marginTop: '4px', color: '#B0A898' }}>
            {lang === 'he' ? `תמונה ${imgNum} — בקרוב` : `Image ${imgNum} — coming soon`}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {colors.map(c => {
          const rank = rankOf(c.id)
          const chosen = rank > 0
          const full = answers.colors.length >= 3 && !chosen
          return (
            <button key={c.id} onClick={() => toggle(c.id)} disabled={full} title={c.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '10px 12px', borderRadius: '12px',
              border: `2px solid ${chosen ? GOLD : BORDER}`,
              backgroundColor: chosen ? `${GOLD}12` : '#FFFFFF',
              cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.4 : 1,
              transition: 'all 0.18s', minWidth: '72px', position: 'relative',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', backgroundColor: c.hex,
                border: `3px solid ${chosen ? GOLD : 'transparent'}`,
                boxShadow: chosen ? `0 0 0 2px ${BEIGE}, 0 0 0 4px ${GOLD}` : '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.18s',
              }} />
              {chosen && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: GOLD, color: '#FFF',
                  fontSize: '11px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Heebo', sans-serif",
                }}>
                  {rank}
                </motion.div>
              )}
              <span style={{
                fontFamily: "'Heebo', sans-serif", fontSize: '11px',
                color: chosen ? DARK : MUTED, fontWeight: chosen ? 700 : 400,
                textAlign: 'center', lineHeight: 1.2,
              }}>
                {c.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      {renderGroup(img1Colors, tx.img1_label, 1)}
      {renderGroup(img2Colors, tx.img2_label, 2)}
      <p style={{ textAlign: 'center', fontFamily: "'Heebo', sans-serif", fontSize: '13px', color: MUTED }}>
        {answers.colors.length === 0 && tx.q_colors_sub}
        {answers.colors.length > 0 && answers.colors.length < 3 && `${lang === 'he' ? 'בחרת' : 'Selected'} ${answers.colors.length}/3`}
        {answers.colors.length === 3 && (lang === 'he' ? '✓ בחרת 3 צבעים' : '✓ 3 colors selected')}
      </p>
    </div>
  )
}

function LeadForm({ lang, onSubmit, onSkip, submitting }: {
  lang: Lang; onSubmit: (n: string, p: string, e: string) => void; onSkip: () => void; submitting: boolean
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const tx = t[lang]
  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: `1px solid ${BORDER}`, backgroundColor: '#FFFFFF',
    fontFamily: "'Heebo', sans-serif", fontSize: '15px', color: DARK,
    outline: 'none', boxSizing: 'border-box',
    direction: lang === 'he' ? 'rtl' : 'ltr',
  }
  const hasAny = name.trim() || phone.trim() || email.trim()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input placeholder={tx.lead_name} value={name} onChange={e => setName(e.target.value)} style={inp} />
      <input placeholder={tx.lead_phone} value={phone} onChange={e => setPhone(e.target.value)} style={inp} type="tel" />
      <input placeholder={tx.lead_email} value={email} onChange={e => setEmail(e.target.value)} style={inp} type="email" />
      <button onClick={() => onSubmit(name, phone, email)} disabled={!hasAny || submitting} style={{
        width: '100%', padding: '17px', borderRadius: '14px', border: 'none',
        backgroundColor: hasAny ? GOLD : BORDER, color: hasAny ? DARK : '#AAA',
        fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: 800,
        cursor: hasAny ? 'pointer' : 'not-allowed', marginTop: '4px',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>
        {submitting ? '...' : tx.lead_submit}
      </button>
      <button onClick={onSkip} disabled={submitting} style={{
        background: 'none', border: 'none', color: MUTED,
        fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer', padding: '12px',
        WebkitTapHighlightColor: 'transparent',
      }}>
        {tx.lead_skip}
      </button>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang | null>(null)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Answers>({ transport: '', age: '', city: '', bike: '', intent: '', colors: [] })

  const tx = lang ? t[lang] : t.he
  const totalSteps = STEPS.length
  const currentStep: Step = STEPS[step]

  const go = (delta: number) => { setDir(delta); setStep(s => s + delta) }

  const canNext = (): boolean => {
    if (currentStep === 'transport') return !!answers.transport
    if (currentStep === 'age')       return !!answers.age
    if (currentStep === 'city')      return !!answers.city
    if (currentStep === 'bike')      return !!answers.bike
    if (currentStep === 'intent')    return !!answers.intent
    if (currentStep === 'colors')    return answers.colors.length === 3
    return true
  }

  const submitSurvey = async (name = '', phone = '', email = '') => {
    setSubmitting(true)
    await supabase.from('survey_responses').insert({
      lang,
      transport:  answers.transport,
      age_group:  answers.age,
      city:       answers.city,
      has_bike:   answers.bike,
      intent:     answers.intent,
      color_1:    answers.colors[0] ?? null,
      color_2:    answers.colors[1] ?? null,
      color_3:    answers.colors[2] ?? null,
      lead_name:  name  || null,
      lead_phone: phone || null,
      lead_email: email || null,
    })
    setSubmitting(false)
    setDone(true)
  }

  if (!lang) return (
    <div style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: '40px', color: DARK, letterSpacing: '0.06em', marginBottom: '4px' }}>
          SPIN<span style={{ color: GOLD }}>Z</span>
        </div>
        <p style={{ fontFamily: "'Heebo', sans-serif", color: MUTED, fontSize: '13px', marginBottom: '48px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Color Survey
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {(['he', 'en'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '18px 40px', borderRadius: '14px', border: `2px solid ${BORDER}`,
              backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.18s',
              fontFamily: "'Heebo', sans-serif", fontSize: '17px', fontWeight: 700, color: DARK,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.backgroundColor = `${GOLD}18` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.backgroundColor = '#FFFFFF' }}>
              {l === 'he' ? '🇮🇱 עברית' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )

  if (done) return (
    <div dir={tx.dir} style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '440px', width: '100%' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
        <div style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: '32px', color: DARK, marginBottom: '12px' }}>{tx.thanks_title}</div>
        <p style={{ fontFamily: "'Heebo', sans-serif", color: MUTED, fontSize: '16px', lineHeight: 1.6 }}>{tx.thanks_sub}</p>
        <div style={{ marginTop: '40px', fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: '28px', color: DARK, letterSpacing: '0.06em' }}>
          SPIN<span style={{ color: GOLD }}>Z</span>
        </div>
      </motion.div>
    </div>
  )

  const questionLabel: Record<Step, string> = {
    transport: tx.q_transport,
    age:       tx.q_age,
    city:      tx.q_city,
    bike:      tx.q_bike,
    intent:    tx.q_intent,
    colors:    tx.q_colors,
    lead:      tx.lead_title,
  }

  const renderStep = () => {
    if (currentStep === 'transport') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['car', tx.opt_car], ['public', tx.opt_public], ['bike', tx.opt_bike], ['scooter', tx.opt_scooter], ['walk', tx.opt_walk]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.transport === v} onClick={() => setAnswers({ ...answers, transport: v })} />
        ))}
      </div>
    )
    if (currentStep === 'age') return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {['16–24', '25–34', '35–44', '45+'].map(a => (
          <OptionBtn key={a} label={a} selected={answers.age === a} onClick={() => setAnswers({ ...answers, age: a })} />
        ))}
      </div>
    )
    if (currentStep === 'city') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['tlv', tx.opt_tlv], ['jlm', tx.opt_jlm], ['haifa', tx.opt_haifa], ['bs', tx.opt_bs], ['other', tx.opt_other]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.city === v} onClick={() => setAnswers({ ...answers, city: v })} />
        ))}
      </div>
    )
    if (currentStep === 'bike') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['yes', tx.opt_yes_bike], ['no', tx.opt_no_bike], ['had', tx.opt_had_bike]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.bike === v} onClick={() => setAnswers({ ...answers, bike: v })} />
        ))}
      </div>
    )
    if (currentStep === 'intent') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['decided', tx.opt_decided], ['considering', tx.opt_considering], ['curious', tx.opt_curious]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.intent === v} onClick={() => setAnswers({ ...answers, intent: v })} />
        ))}
      </div>
    )
    if (currentStep === 'colors') return <ColorPicker answers={answers} setAnswers={setAnswers} lang={lang} />
    if (currentStep === 'lead') return <LeadForm lang={lang} onSubmit={submitSurvey} onSkip={() => submitSurvey()} submitting={submitting} />
  }

  return (
    <div dir={tx.dir} style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 64px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px', paddingTop: '12px' }}>
          <span style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: '26px', color: DARK, letterSpacing: '0.06em' }}>
            SPIN<span style={{ color: GOLD }}>Z</span>
          </span>
        </div>

        <ProgressBar step={step + 1} total={totalSteps} />

        <p style={{ fontFamily: "'Heebo', sans-serif", fontSize: '11px', color: MUTED, marginBottom: '16px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {tx.step} {step + 1} {tx.of} {totalSteps}
        </p>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <h2 style={{
              fontFamily: "'Heebo', sans-serif", fontWeight: 800,
              fontSize: 'clamp(20px, 5vw, 28px)', color: DARK, lineHeight: 1.2,
              marginBottom: currentStep === 'lead' ? '8px' : '24px',
            }}>
              {questionLabel[currentStep]}
            </h2>
            {currentStep === 'lead' && (
              <p style={{ fontFamily: "'Heebo', sans-serif", color: MUTED, fontSize: '14px', marginBottom: '24px' }}>
                {tx.lead_sub}
              </p>
            )}
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {currentStep !== 'lead' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexDirection: tx.dir === 'rtl' ? 'row' : 'row-reverse' }}>
            {step > 0 && (
              <button onClick={() => go(-1)} style={{
                padding: '16px 24px', borderRadius: '14px', border: `1px solid ${BORDER}`,
                backgroundColor: '#FFFFFF', color: MUTED,
                fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minHeight: '56px',
              }}>
                {tx.back}
              </button>
            )}
            <button onClick={() => canNext() && go(1)} disabled={!canNext()} style={{
              flex: 1, padding: '16px', borderRadius: '14px', border: 'none',
              backgroundColor: canNext() ? GOLD : BORDER,
              color: canNext() ? DARK : '#AAA',
              fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: 800,
              cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s',
              WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minHeight: '56px',
            }}>
              {tx.next}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

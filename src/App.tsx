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
  gender: string
  city: string
  colors: string[]
  bike: string
  occupation: string
  intent: string
}

const STEPS = ['gender', 'age', 'city', 'occupation', 'transport', 'bike', 'colors', 'intent', 'lead'] as const
type Step = typeof STEPS[number]

const btn: React.CSSProperties = {
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
}

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      ...btn,
      width: '100%', padding: '16px 20px', borderRadius: '14px', textAlign: 'right',
      border: `2px solid ${selected ? GOLD : BORDER}`,
      backgroundColor: selected ? `${GOLD}18` : '#FFFFFF',
      color: selected ? DARK : MUTED,
      fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: selected ? 700 : 400,
      cursor: 'pointer', transition: 'all 0.18s',
      display: 'flex', alignItems: 'center', gap: '12px', minHeight: '56px',
    }}>
      <span style={{ flex: 1 }}>{label}</span>
      {selected && <span style={{ color: GOLD, fontSize: '20px', flexShrink: 0 }}>✓</span>}
    </button>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ width: '100%', height: '3px', backgroundColor: BORDER, borderRadius: '2px', marginBottom: '28px' }}>
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
    const cur = answers.colors
    if (cur.includes(id)) setAnswers({ ...answers, colors: cur.filter(c => c !== id) })
    else if (cur.length < 3) setAnswers({ ...answers, colors: [...cur, id] })
  }
  const rankOf = (id: string) => answers.colors.indexOf(id) + 1
  const img1 = BIKE_COLORS.filter(c => c.image === 1)
  const img2 = BIKE_COLORS.filter(c => c.image === 2)

  const renderGroup = (colors: typeof BIKE_COLORS, label: string, n: number) => (
    <div style={{ marginBottom: '28px' }}>
      <div style={{
        width: '100%', aspectRatio: '16/7', borderRadius: '16px',
        backgroundColor: '#E8E4DC', border: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
      }}>
        <div style={{ textAlign: 'center', color: MUTED, fontFamily: "'Heebo', sans-serif" }}>
          <div style={{ fontSize: '36px', marginBottom: '6px' }}>🚲</div>
          <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: '11px', marginTop: '3px', color: '#B0A898' }}>
            {lang === 'he' ? `תמונה ${n} — בקרוב` : `Image ${n} — coming soon`}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {colors.map(c => {
          const rank = rankOf(c.id)
          const chosen = rank > 0
          const full = answers.colors.length >= 3 && !chosen
          return (
            <button key={c.id} onClick={() => toggle(c.id)} disabled={full} style={{
              ...btn,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '10px 12px', borderRadius: '12px',
              border: `2px solid ${chosen ? GOLD : BORDER}`,
              backgroundColor: chosen ? `${GOLD}12` : '#FFFFFF',
              cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.4 : 1,
              transition: 'all 0.18s', minWidth: '68px', position: 'relative',
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
                fontFamily: "'Heebo', sans-serif", fontSize: '10px',
                color: chosen ? DARK : MUTED, fontWeight: chosen ? 700 : 400,
                textAlign: 'center', lineHeight: 1.2,
              }}>{c.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      {renderGroup(img1, tx.img1_label, 1)}
      {renderGroup(img2, tx.img2_label, 2)}
      <p style={{ textAlign: 'center', fontFamily: "'Heebo', sans-serif", fontSize: '13px', color: MUTED, margin: '4px 0 0' }}>
        {answers.colors.length === 0 && tx.q_colors_sub}
        {answers.colors.length > 0 && answers.colors.length < 3 && `${lang === 'he' ? 'בחרת' : 'Selected'} ${answers.colors.length}/3`}
        {answers.colors.length === 3 && (lang === 'he' ? '✓ בחרת 3 צבעים' : '✓ 3 colors selected')}
      </p>
    </div>
  )
}

// Beautiful lead capture page
function LeadPage({ lang, onSubmit, onSkip, submitting }: {
  lang: Lang;
  onSubmit: (n: string, p: string, e: string) => void;
  onSkip: () => void; submitting: boolean
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const tx = t[lang]
  const hasAny = name.trim() || phone.trim() || email.trim()
  const canSubmit = hasAny && consent

  const inp: React.CSSProperties = {
    width: '100%', padding: '16px 18px', borderRadius: '14px',
    border: `1.5px solid ${BORDER}`, backgroundColor: '#FFFFFF',
    fontFamily: "'Heebo', sans-serif", fontSize: '16px', color: DARK,
    outline: 'none', boxSizing: 'border-box',
    direction: lang === 'he' ? 'rtl' : 'ltr',
  }

  return (
    <div>
      <p style={{ fontFamily: "'Heebo', sans-serif", fontSize: '14px', color: MUTED, marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
        {tx.lead_sub}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input placeholder={tx.lead_name} value={name} onChange={e => setName(e.target.value)} style={inp} autoComplete="name" />
        <input placeholder={tx.lead_phone} value={phone} onChange={e => setPhone(e.target.value)} style={inp} type="tel" autoComplete="tel" />
        <input placeholder={tx.lead_email} value={email} onChange={e => setEmail(e.target.value)} style={inp} type="email" autoComplete="email" />

        {/* Consent checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
          <input
            type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
            style={{ marginTop: '3px', accentColor: GOLD, width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontFamily: "'Heebo', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.5 }}>
            {tx.lead_consent}
          </span>
        </label>

        <motion.button
          onClick={() => onSubmit(name, phone, email)}
          disabled={!canSubmit || submitting}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          style={{
            ...btn,
            width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
            backgroundColor: canSubmit ? GOLD : BORDER,
            color: canSubmit ? DARK : '#AAA',
            fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: 800,
            cursor: canSubmit ? 'pointer' : 'not-allowed', marginTop: '4px',
          }}
        >
          {submitting ? '...' : tx.lead_submit}
        </motion.button>

        {/* Privacy note */}
        <p style={{ fontFamily: "'Heebo', sans-serif", fontSize: '11px', color: '#B0A898', textAlign: 'center', margin: '0', lineHeight: 1.5 }}>
          {tx.lead_privacy_note} ·{' '}
          <button onClick={() => setShowPrivacy(true)} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: '11px', padding: 0, fontFamily: "'Heebo', sans-serif" }}>
            {tx.lead_privacy}
          </button>
        </p>

        {/* Privacy modal */}
        {showPrivacy && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setShowPrivacy(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              backgroundColor: '#F5F2EC', borderRadius: '24px 24px 0 0',
              padding: '28px 24px 48px', width: '100%', maxWidth: '520px',
              maxHeight: '80vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 800, fontSize: '18px', color: DARK }}>
                  {lang === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
                </span>
                <button onClick={() => setShowPrivacy(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: MUTED, padding: '4px 8px' }}>✕</button>
              </div>
              <div style={{ fontFamily: "'Heebo', sans-serif", fontSize: '14px', color: MUTED, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {lang === 'he' ? <>
                  <p><strong style={{ color: DARK }}>מי אנחנו</strong><br />Spinz הוא מותג אופניים ישראלי. הסקר נועד לאיסוף העדפות ציבוריות לגבי עיצוב המוצר.</p>
                  <p><strong style={{ color: DARK }}>מה אנו אוספים</strong><br />תשובות אנונימיות לשאלות הסקר, ופרטי יצירת קשר (שם, טלפון, מייל) — רק אם בחרת להשאיר אותם מרצונך.</p>
                  <p><strong style={{ color: DARK }}>למה</strong><br />פרטי יצירת קשר ישמשו אך ורק ליצירת קשר חד-פעמית כשהאופניים יגיעו. אנו לא מוכרים או מעבירים נתונים לצדדים שלישיים.</p>
                  <p><strong style={{ color: DARK }}>קטינים</strong><br />אנו לא אוספים פרטים אישיים מאנשים מתחת לגיל 18.</p>
                  <p><strong style={{ color: DARK }}>זכות מחיקה</strong><br />ניתן לפנות בכל עת למחיקת הנתונים: info@spinz.co.il</p>
                </> : <>
                  <p><strong style={{ color: DARK }}>Who we are</strong><br />Spinz is an Israeli bicycle brand. This survey collects public preferences about product design.</p>
                  <p><strong style={{ color: DARK }}>What we collect</strong><br />Anonymous survey answers, and contact details (name, phone, email) — only if you choose to leave them.</p>
                  <p><strong style={{ color: DARK }}>Why</strong><br />Contact details will only be used to reach out once when the bikes arrive. We never sell or share data with third parties.</p>
                  <p><strong style={{ color: DARK }}>Minors</strong><br />We do not collect personal details from anyone under 18.</p>
                  <p><strong style={{ color: DARK }}>Right to deletion</strong><br />You may request deletion at any time: info@spinz.co.il</p>
                </>}
              </div>
              <button onClick={() => setShowPrivacy(false)} style={{
                ...btn,
                width: '100%', marginTop: '24px', padding: '14px', borderRadius: '14px',
                backgroundColor: GOLD, border: 'none', color: DARK,
                fontFamily: "'Heebo', sans-serif", fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              }}>
                {lang === 'he' ? 'חזור למילוי פרטים' : 'Back to form'}
              </button>
            </div>
          </div>
        )}

        <button onClick={onSkip} disabled={submitting} style={{
          ...btn,
          background: 'none', border: 'none', color: MUTED,
          fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer', padding: '8px',
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}>
          {tx.lead_skip}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [intro, setIntro] = useState(true)
  const [lang, setLang] = useState<Lang | null>(null)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [submittedWithLead, setSubmittedWithLead] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Answers>({
    transport: '', age: '', gender: '', city: '', colors: [], bike: '', occupation: '', intent: '',
  })

  const tx = lang ? t[lang] : t.he
  const totalSteps = STEPS.length - 1  // lead step is conditional, not shown in counter
  const currentStep: Step = STEPS[step]

  const go = (delta: number) => { setDir(delta); setStep(s => s + delta) }

  const canNext = (): boolean => {
    if (currentStep === 'transport')  return !!answers.transport
    if (currentStep === 'age')        return !!answers.age
    if (currentStep === 'gender')     return !!answers.gender
    if (currentStep === 'city')       return !!answers.city
    if (currentStep === 'colors')     return answers.colors.length === 3
    if (currentStep === 'bike')       return !!answers.bike
    if (currentStep === 'occupation') return !!answers.occupation
    if (currentStep === 'intent')     return !!answers.intent
    return true
  }

  const submitSurvey = async (name = '', phone = '', email = '') => {
    setSubmitting(true)
    const { error } = await supabase.from('survey_responses').insert({
      lang,
      transport:   answers.transport,
      age_group:   answers.age,
      gender:      answers.gender,
      city:        answers.city,
      has_bike:    answers.bike,
      occupation:  answers.occupation,
      intent:      answers.intent,
      color_1:     answers.colors[0] ?? null,
      color_2:     answers.colors[1] ?? null,
      color_3:     answers.colors[2] ?? null,
      lead_name:   name  || null,
      lead_phone:  phone || null,
      lead_email:  email || null,
    })
    if (error) {
      console.error('Survey insert error:', error)
      alert('שגיאה בשמירה: ' + error.message)
      setSubmitting(false)
      return
    }
    setSubmittedWithLead(!!(name || phone || email))
    setSubmitting(false)
    setDone(true)
  }

  // Language screen
  if (!lang) return (
    <div style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <img src="/logo.png" alt="SPINZ" style={{ height: '60px', marginBottom: '12px', objectFit: 'contain' }} />
        <p style={{ fontFamily: "'Heebo', sans-serif", color: MUTED, fontSize: '12px', marginBottom: '48px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Color Survey
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {(['he', 'en'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              ...btn,
              padding: '18px 36px', borderRadius: '14px', border: `2px solid ${BORDER}`,
              backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.18s',
              fontFamily: "'Heebo', sans-serif", fontSize: '17px', fontWeight: 700, color: DARK,
            }}>
              {l === 'he' ? '🇮🇱 עברית' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )

  // Intro screen (after language selection)
  if (intro) return (
    <div dir={tx.dir} style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative' }}>
      <button onClick={() => setLang(null)} style={{
        ...btn, position: 'absolute', top: '20px', right: tx.dir === 'rtl' ? '20px' : 'auto', left: tx.dir === 'ltr' ? '20px' : 'auto',
        background: 'none', border: 'none', color: MUTED,
        fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer', padding: '8px',
      }}>
        {tx.back}
      </button>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <img src="/logo.png" alt="SPINZ" style={{ height: '52px', objectFit: 'contain', marginBottom: '32px' }} />
        <div style={{ fontFamily: "'Heebo', sans-serif", marginBottom: '32px' }}>
          <p style={{ fontSize: '13px', color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            {tx.intro_sub}
          </p>
          <p style={{ fontSize: '16px', color: DARK, lineHeight: 1.8, margin: '0 0 4px' }}>
            {tx.intro_body1}
          </p>
          <p style={{ fontSize: '16px', color: DARK, lineHeight: 1.8, margin: '0 0 20px', fontWeight: 700 }}>
            {tx.intro_body2}
          </p>
          <div style={{ width: '40px', height: '2px', backgroundColor: GOLD, margin: '0 auto 20px' }} />
          <p style={{ fontSize: '15px', color: MUTED, lineHeight: 1.8, margin: 0 }}>
            {tx.intro_body3}<br />{tx.intro_body4}
          </p>
        </div>
        <motion.button
          onClick={() => setIntro(false)}
          whileTap={{ scale: 0.97 }}
          style={{
            ...btn,
            padding: '18px 48px', borderRadius: '14px', border: 'none',
            backgroundColor: GOLD, color: DARK,
            fontFamily: "'Heebo', sans-serif", fontSize: '17px', fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {tx.intro_cta}
        </motion.button>

      </motion.div>
    </div>
  )

  // Thank you screen
  if (done) return (
    <div dir={tx.dir} style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '440px', width: '100%' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>{submittedWithLead ? '🎉' : '🙌'}</div>
        <div style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: '32px', color: DARK, marginBottom: '12px' }}>{tx.thanks_title}</div>
        <p style={{ fontFamily: "'Heebo', sans-serif", color: MUTED, fontSize: '16px', lineHeight: 1.6 }}>
          {submittedWithLead
            ? (lang === 'he' ? 'נחזור אליך כשהאופניים מגיעים 🚲' : "We'll reach out when the bikes arrive 🚲")
            : tx.thanks_sub}
        </p>
        <img src="/logo.png" alt="SPINZ" style={{ height: '48px', marginTop: '40px', objectFit: 'contain' }} />
      </motion.div>
    </div>
  )

  const questionLabel: Record<Step, string> = {
    transport:  tx.q_transport,
    age:        tx.q_age,
    gender:     tx.q_gender,
    city:       tx.q_city,
    colors:     tx.q_colors,
    bike:       tx.q_bike,
    occupation: tx.q_occupation,
    intent:     tx.q_intent,
    lead:       tx.lead_title,
  }

  const renderStep = () => {
    if (currentStep === 'transport') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['car', tx.opt_car], ['bike', tx.opt_bike], ['escooter', tx.opt_escooter], ['moto', tx.opt_moto], ['public', tx.opt_public]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.transport === v} onClick={() => setAnswers({ ...answers, transport: v })} />
        ))}
      </div>
    )
    if (currentStep === 'age') return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[['under_20', lang === 'he' ? 'מתחת ל-20' : 'Under 20'], ['20-30', '20–30'], ['30-40', '30–40'], ['40+', lang === 'he' ? 'מעל 40' : 'Over 40']].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.age === v} onClick={() => setAnswers({ ...answers, age: v })} />
        ))}
      </div>
    )
    if (currentStep === 'gender') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['male', tx.opt_male], ['female', tx.opt_female], ['other', tx.opt_other_gender]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.gender === v} onClick={() => setAnswers({ ...answers, gender: v })} />
        ))}
      </div>
    )
    if (currentStep === 'city') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['tlv_area', tx.opt_tlv_area], ['south', tx.opt_south], ['jlm_area', tx.opt_jlm_area], ['haifa', tx.opt_haifa], ['other', tx.opt_other]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.city === v} onClick={() => setAnswers({ ...answers, city: v })} />
        ))}
      </div>
    )
    if (currentStep === 'colors') return <ColorPicker answers={answers} setAnswers={setAnswers} lang={lang} />
    if (currentStep === 'bike') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['yes', tx.opt_yes_bike], ['no', tx.opt_no_bike], ['had', tx.opt_had_bike]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.bike === v} onClick={() => setAnswers({ ...answers, bike: v })} />
        ))}
      </div>
    )
    if (currentStep === 'occupation') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['student', tx.opt_student], ['employed', tx.opt_employed], ['self', tx.opt_self], ['other', tx.opt_other_occ]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.occupation === v} onClick={() => setAnswers({ ...answers, occupation: v })} />
        ))}
      </div>
    )
    if (currentStep === 'intent') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[['decided', tx.opt_decided], ['considering', tx.opt_considering], ['curious', tx.opt_curious], ['not_interested', tx.opt_not_interested]].map(([v, l]) => (
          <OptionBtn key={v} label={l} selected={answers.intent === v} onClick={() => setAnswers({ ...answers, intent: v })} />
        ))}
        {answers.intent && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Primary CTA — only for interested users above 18 */}
              {answers.intent !== 'not_interested' && answers.age !== 'under_20' && (
                <button onClick={() => go(1)} style={{
                  ...btn,
                  width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                  backgroundColor: GOLD, color: DARK,
                  fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: 800, cursor: 'pointer',
                  minHeight: '56px',
                }}>
                  {lang === 'he' ? '🔔 כן, אני רוצה לשמוע ראשון/ה!' : '🔔 Yes, notify me first!'}
                </button>
              )}
              {/* Secondary — finish without details */}
              <button onClick={() => submitSurvey()} disabled={submitting} style={{
                ...btn,
                width: '100%', padding: '15px', borderRadius: '14px',
                border: `1.5px solid ${BORDER}`,
                backgroundColor: '#FFFFFF', color: MUTED,
                fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer',
                minHeight: '56px',
              }}>
                {submitting ? '...' : (lang === 'he' ? 'סיים בלי להשאיר פרטים' : 'Finish without details')}
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
    if (currentStep === 'lead') return (
      <LeadPage lang={lang} onSubmit={submitSurvey} onSkip={() => submitSurvey()} submitting={submitting} />
    )
  }

  return (
    <div dir={tx.dir} style={{ minHeight: '100dvh', backgroundColor: BEIGE, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px 64px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Logo bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0 24px' }}>
          <img src="/logo.png" alt="SPINZ" style={{ height: '36px', objectFit: 'contain' }} />
        </div>

        <ProgressBar step={step + 1} total={totalSteps} />

        <p style={{ fontFamily: "'Heebo', sans-serif", fontSize: '11px', color: MUTED, marginBottom: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {tx.step} {step + 1} {tx.of} {totalSteps}
        </p>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <h2 style={{
              fontFamily: "'Heebo', sans-serif", fontWeight: 800,
              fontSize: 'clamp(20px, 5vw, 28px)', color: DARK, lineHeight: 1.25,
              marginBottom: currentStep === 'lead' ? '4px' : '24px',
            }}>
              {questionLabel[currentStep]}
            </h2>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Nav — not on lead or intent (intent has its own CTA) */}
        {currentStep !== 'lead' && currentStep !== 'intent' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexDirection: tx.dir === 'rtl' ? 'row' : 'row-reverse' }}>
            {step >= 0 && (
              <button onClick={() => step === 0 ? setIntro(true) : go(-1)} style={{
                ...btn,
                padding: '16px 24px', borderRadius: '14px', border: `1px solid ${BORDER}`,
                backgroundColor: '#FFFFFF', color: MUTED,
                fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer', minHeight: '56px',
              }}>
                {tx.back}
              </button>
            )}
            <button onClick={() => canNext() && go(1)} disabled={!canNext()} style={{
              ...btn,
              flex: 1, padding: '16px', borderRadius: '14px', border: 'none',
              backgroundColor: canNext() ? GOLD : BORDER,
              color: canNext() ? DARK : '#AAA',
              fontFamily: "'Heebo', sans-serif", fontSize: '16px', fontWeight: 800,
              cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s', minHeight: '56px',
            }}>
              {tx.next}
            </button>
          </div>
        )}

        {/* Back button on intent step */}
        {currentStep === 'intent' && (
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => step === 0 ? setIntro(true) : go(-1)} style={{
              ...btn,
              padding: '14px 24px', borderRadius: '14px', border: `1px solid ${BORDER}`,
              backgroundColor: '#FFFFFF', color: MUTED,
              fontFamily: "'Heebo', sans-serif", fontSize: '15px', cursor: 'pointer',
            }}>
              {tx.back}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

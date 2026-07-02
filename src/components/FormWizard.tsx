'use client'
import { useState, useRef, useEffect, CSSProperties } from 'react'

export type ShowIf = { fieldId: string; equals: string }

export type FieldDef =
  | { type: 'text' | 'email' | 'tel'; id: string; label: string; placeholder?: string; required?: boolean; autoComplete?: string; showIf?: ShowIf }
  | { type: 'textarea'; id: string; label: string; placeholder?: string; required?: boolean; note?: string }
  | { type: 'radio'; id: string; label: string; options: string[]; required?: boolean }
  | { type: 'checkbox'; id: string; label: string; options: string[]; required?: boolean }
  | { type: 'select'; id: string; label: string; options: string[]; required?: boolean }
  | { type: 'col2'; fields: FieldDef[] }
  | { type: 'note'; text: string }

export interface FormConfig {
  color: string; colorDk: string; colorLt: string; colorMid: string
  tag: string; title: string; subtitle: string
  formType: string; subject: string; autoResp: string
  sections: { title: string; fields: FieldDef[] }[]
}

const EXTRA_KEYS = [
  '現在の状況','気になっていること',
  '現在の給与計算方法','給与ソフト名',
  '業種','関心のある助成金','申請経験',
  'service','contact_method','category','category_other','urgency',
]

export default function FormWizard({ config }: { config: FormConfig }) {
  const { color, colorDk, colorLt, colorMid } = config
  const [step, setStep] = useState<1|2|3>(1)
  const [values, setValues] = useState<Record<string, string|string[]>>({})
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendErr, setSendErr] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const cssVars = { ['--c' as string]: color, ['--c-dk' as string]: colorDk, ['--c-lt' as string]: colorLt, ['--c-mid' as string]: colorMid } as CSSProperties

  useEffect(() => {
    const sendHeight = () => {
      if (!rootRef.current) return
      const h = Math.ceil(rootRef.current.getBoundingClientRect().height)
      if (h) window.parent.postMessage({ type: 'spot-form-resize', height: h }, '*')
    }
    const raf = requestAnimationFrame(sendHeight)
    const ro = new ResizeObserver(() => requestAnimationFrame(sendHeight))
    if (rootRef.current) ro.observe(rootRef.current)
    window.addEventListener('resize', sendHeight)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', sendHeight) }
  }, [step, errors, agree])

  const setVal = (id: string, val: string|string[]) => setValues(v => ({ ...v, [id]: val }))
  const toggleCheck = (id: string, opt: string) => {
    const cur = (values[id] as string[]) || []
    setVal(id, cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt])
  }
  const getStr = (id: string) => (values[id] as string) || ''
  const getArr = (id: string) => (values[id] as string[]) || []
  const displayVal = (id: string) => {
    const v = values[id]
    if (!v) return '（未入力）'
    if (Array.isArray(v)) return v.length ? v.join('、') : '（なし）'
    return v
  }

  const getAllFields = (): FieldDef[] => {
    const flat: FieldDef[] = []
    const dig = (f: FieldDef) => { if (f.type === 'col2') f.fields.forEach(dig); else flat.push(f) }
    config.sections.forEach(s => s.fields.forEach(dig))
    return flat
  }

  const isVisible = (f: FieldDef): boolean => {
    if (!('showIf' in f) || !f.showIf) return true
    const depVal = values[f.showIf.fieldId]
    if (Array.isArray(depVal)) return depVal.includes(f.showIf.equals)
    return depVal === f.showIf.equals
  }

  const validate = () => {
    const errs: Record<string, boolean> = {}
    getAllFields().forEach(f => {
      if (f.type === 'col2' || f.type === 'note') return
      if (!('required' in f) || !f.required) return
      if (!isVisible(f)) return
      const v = values[f.id]
      if (f.type === 'checkbox') {
        if (!Array.isArray(v) || v.length === 0) errs[f.id] = true
        return
      }
      if (!v || (typeof v === 'string' && !v.trim())) errs[f.id] = true
      if (f.type === 'email' && typeof v === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errs[f.id] = true
    })
    if (!agree) errs['_agree'] = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const goConfirm = () => {
    if (!validate()) { scrollToTop(); return }
    setStep(2); scrollToTop()
  }

  const doSubmit = async () => {
    setSending(true); setSendErr(false)
    const extraLines = EXTRA_KEYS
      .filter(k => values[k] && (Array.isArray(values[k]) ? (values[k] as string[]).length > 0 : values[k]))
      .map(k => `${k}：${Array.isArray(values[k]) ? (values[k] as string[]).join('、') : values[k]}`)
      .join('\n')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: config.formType, company: getStr('company'),
          name: `${getStr('sei')} ${getStr('mei')}`, email: getStr('email'),
          phone: getStr('phone'), emp: getStr('emp'), message: getStr('message'),
          contact: getStr('contact'), howFound: getStr('howFound'),
          subject: config.subject, autoResponse: config.autoResp, extra: extraLines,
        }),
      })
      if (res.ok) { setStep(3); scrollToTop() }
      else setSendErr(true)
    } catch { setSendErr(true) }
    finally { setSending(false) }
  }

  const renderField = (f: FieldDef, key?: string): React.ReactNode => {
    const k = key || ('id' in f ? f.id : 'field')
    if (!isVisible(f)) return null
    if (f.type === 'col2') return (
      <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {f.fields.map((ff, i) => renderField(ff, `col2-${i}`))}
      </div>
    )
    if (f.type === 'note') return <div key={k} className="fw-note-box">{f.text}</div>
    const hasErr = errors[f.id]
    const label = (
      <div className="fw-label">
        {f.label}
        {'required' in f && f.required ? <span className="fw-req">必須</span> : <span className="fw-opt">任意</span>}
      </div>
    )
    if (f.type === 'text' || f.type === 'email' || f.type === 'tel') return (
      <div key={f.id} className="fw-field">
        {label}
        <input type={f.type} value={getStr(f.id)} placeholder={f.placeholder} name={f.id}
          autoComplete={f.autoComplete || f.id}
          onChange={e => { setVal(f.id, e.target.value); setErrors(er => ({ ...er, [f.id]: false })) }}
          className={`fw-input${hasErr ? ' err' : ''}`} />
        {hasErr && <div className="fw-errmsg">入力してください</div>}
      </div>
    )
    if (f.type === 'textarea') return (
      <div key={f.id} className="fw-field">
        {label}
        {'note' in f && f.note && <div className="fw-note">{f.note}</div>}
        <textarea value={getStr(f.id)} placeholder={f.placeholder} rows={5} name={f.id}
          onChange={e => { setVal(f.id, e.target.value); setErrors(er => ({ ...er, [f.id]: false })) }}
          className={`fw-input fw-ta${hasErr ? ' err' : ''}`} />
        {hasErr && <div className="fw-errmsg">入力してください</div>}
      </div>
    )
    if (f.type === 'radio') return (
      <div key={f.id} className="fw-field">
        {label}
        <div className={`fw-choices${hasErr ? ' err' : ''}`}>
          {f.options.map(opt => (
            <label key={opt} className={`fw-choice${getStr(f.id) === opt ? ' sel' : ''}`}
              onClick={() => { setVal(f.id, opt); setErrors(er => ({ ...er, [f.id]: false })) }}>
              <span className="fw-circle">{getStr(f.id) === opt && <span className="fw-dot" />}</span>{opt}
            </label>
          ))}
        </div>
        {hasErr && <div className="fw-errmsg">選択してください</div>}
      </div>
    )
    if (f.type === 'checkbox') return (
      <div key={f.id} className="fw-field">
        {label}
        <div className="fw-choices fw-choices-wrap">
          {f.options.map(opt => {
            const checked = getArr(f.id).includes(opt)
            return (
              <label key={opt} className={`fw-choice${checked ? ' sel' : ''}`} onClick={() => toggleCheck(f.id, opt)}>
                <span className="fw-square">{checked && <span className="fw-chk">/</span>}</span>{opt}
              </label>
            )
          })}
        </div>
      </div>
    )
    if (f.type === 'select') return (
      <div key={f.id} className="fw-field">
        {label}
        <select value={getStr(f.id)} onChange={e => setVal(f.id, e.target.value)} className="fw-input fw-sel" name={f.id}>
          <option value="">選択してください</option>
          {f.options.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  const TR = ({ label, val }: { label: string; val: string }) => (
    <tr>
      <th style={{ width: '38%', padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748b', textAlign: 'left', verticalAlign: 'top', background: '#fafbfc', borderBottom: '1px solid #f0f4f8' }}>{label}</th>
      <td style={{ padding: '10px 14px', fontSize: 14, verticalAlign: 'top', wordBreak: 'break-all', borderBottom: '1px solid #f0f4f8', whiteSpace: 'pre-wrap' }}>{val}</td>
    </tr>
  )

  return (
    <div ref={rootRef} style={cssVars} className="fw-root">
      <style>{`
        .fw-root{background:var(--c-lt)}
        .fw-hero{background:linear-gradient(135deg,var(--c) 0%,var(--c-dk) 100%);color:#fff;padding:36px 24px 32px;text-align:center}
        .fw-tag{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);font-size:14px;font-weight:700;letter-spacing:.12em;padding:4px 16px;border-radius:20px;margin-bottom:16px;text-transform:uppercase}
        .fw-hero h1{font-size:clamp(23px,5.2vw,34px);font-weight:900;line-height:1.3;margin-bottom:10px;white-space:pre-line}
        .fw-hero-sub{font-size:17px;opacity:.88;line-height:1.7}
        .fw-stepbar{background:#fff;border-bottom:1px solid #e2e8f0;padding:16px 24px;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.04)}
        .fw-steps{display:flex;align-items:center;justify-content:center;max-width:480px;margin:0 auto}
        .fw-st{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;font-size:11px;color:#aaa;font-weight:600}
        .fw-st.active{color:var(--c)}.fw-st.done{color:var(--c-dk)}
        .fw-st-num{width:30px;height:30px;border-radius:50%;border:2px solid #ddd;background:#fff;color:#aaa;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}
        .fw-st.active .fw-st-num{border-color:var(--c);background:var(--c);color:#fff;box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 20%,transparent)}
        .fw-st.done .fw-st-num{border-color:var(--c-dk);background:var(--c-dk);color:#fff}
        .fw-st-line{flex:1;height:2px;background:#e2e8f0;max-width:48px}
        .fw-st-line.done{background:var(--c-dk)}
        .fw-wrap{max-width:660px;margin:0 auto;padding:28px 16px 32px}
        .fw-card{background:#fff;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,.07);padding:24px;margin-bottom:14px;border:1px solid color-mix(in srgb,var(--c) 12%,transparent)}
        .fw-sec-title{font-size:13px;font-weight:800;color:var(--c-dk);display:flex;align-items:center;gap:8px;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid var(--c-lt)}
        .fw-sec-title::before{content:'';display:inline-block;width:4px;height:15px;background:var(--c);border-radius:2px;flex-shrink:0}
        .fw-field{margin-bottom:18px}.fw-field:last-child{margin-bottom:0}
        .fw-label{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:6px}
        .fw-req{background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px}
        .fw-opt{background:#94a3b8;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px}
        .fw-note{font-size:11px;color:#64748b;margin-bottom:5px}
        .fw-note-box{background:var(--c-lt);border:1px solid var(--c-mid);border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:12.5px;color:var(--c-dk);line-height:1.8}
        .fw-input{width:100%;padding:10px 13px;border:1.5px solid #dce3ea;border-radius:7px;font-size:15px;font-family:inherit;color:#1a1a2e;background:#fafbfc;transition:border-color .2s,box-shadow .2s;outline:none;-webkit-appearance:none}
        .fw-input:focus{border-color:var(--c);background:#fff;box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 16%,transparent)}
        .fw-input.err{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.12)}
        .fw-ta{resize:vertical;min-height:140px}
        .fw-sel{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px;cursor:pointer}
        .fw-errmsg{font-size:11px;color:#ef4444;margin-top:4px}
        .fw-choices{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
        .fw-choices-wrap .fw-choice{width:100%}
        .fw-choices.err .fw-choice{border-color:#fca5a5}
        .fw-choice{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;padding:8px 14px;border:1.5px solid #dce3ea;border-radius:7px;background:#fafbfc;transition:all .15s;user-select:none}
        .fw-choice:hover{border-color:var(--c-mid);background:var(--c-lt)}
        .fw-choice.sel{border-color:var(--c);background:var(--c-lt);font-weight:600;color:var(--c-dk)}
        .fw-circle{width:17px;height:17px;border-radius:50%;border:2px solid #cdd5df;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
        .fw-choice.sel .fw-circle{border-color:var(--c);background:var(--c)}
        .fw-dot{width:6px;height:6px;border-radius:50%;background:#fff}
        .fw-square{width:17px;height:17px;border-radius:4px;border:2px solid #cdd5df;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
        .fw-choice.sel .fw-square{border-color:var(--c);background:var(--c)}
        .fw-chk{font-size:11px;font-weight:900;color:#fff;line-height:1;transform:rotate(20deg)}
        .fw-privacy{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:16px;font-size:12px;color:#64748b;line-height:1.8}
        .fw-privacy h4{font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:5px}
        .fw-privacy a{color:var(--c)}
        .fw-agree{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--c-lt);border:1.5px solid var(--c-mid);border-radius:8px;cursor:pointer;margin-bottom:20px}
        .fw-agree input{width:18px;height:18px;flex-shrink:0;accent-color:var(--c);margin-top:2px;cursor:pointer}
        .fw-agree span{font-size:13px;font-weight:600;line-height:1.6}
        .fw-confirm-box{background:var(--c-lt);border:1px solid var(--c-mid);border-left:4px solid var(--c);border-radius:8px;padding:14px 18px;margin-bottom:18px;font-size:13px;color:var(--c-dk);line-height:1.7}
        .fw-confirm-box strong{display:block;font-size:14px;margin-bottom:3px}
        .fw-confirm-table{width:100%;border-collapse:collapse}
        .fw-btn-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .fw-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:800;font-family:inherit;letter-spacing:.04em;cursor:pointer;border:none;transition:all .2s;min-width:150px}
        .fw-btn-p{background:var(--c);color:#fff;box-shadow:0 4px 18px color-mix(in srgb,var(--c) 38%,transparent)}
        .fw-btn-p:hover{background:var(--c-dk);transform:translateY(-2px)}
        .fw-btn-p:disabled{background:#94a3b8;box-shadow:none;cursor:not-allowed;transform:none}
        .fw-btn-s{background:#fff;color:#64748b;border:1.5px solid #dce3ea}
        .fw-btn-s:hover{background:#f8fafc}
        .fw-success{background:#fff;border-radius:10px;padding:48px 28px;text-align:center;border:2px solid var(--c-mid)}
        .fw-success-img{display:block;margin:0 auto 16px;max-width:64px;width:100%;height:auto}
        .fw-success h2{font-size:20px;font-weight:800;color:var(--c-dk);margin-bottom:10px}
        .fw-success p{font-size:14px;color:#64748b;line-height:1.8}
        .fw-success a{color:var(--c)}
        .fw-err-banner{background:#fef2f2;border:1.5px solid #fca5a5;border-radius:8px;padding:12px 16px;font-size:13px;color:#dc2626;margin-bottom:14px}
        .fw-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fw-pane{animation:fadeUp .25s ease-out both}
        @media(max-width:480px){.fw-card{padding:18px 14px}.fw-btn{padding:13px 22px;font-size:14px;min-width:130px}.fw-hero{padding:26px 18px 24px}}
      `}</style>

      <div ref={topRef} />

      <header className="fw-hero">
        <span className="fw-tag">{config.tag}</span>
        <h1>{config.title}</h1>
        <p className="fw-hero-sub">{config.subtitle}</p>
      </header>

      <div className="fw-stepbar">
        <div className="fw-steps">
          {['貴社の情報','ご確認','送信完了'].map((label, i) => {
            const n = i + 1
            const cls = step > n ? 'done' : step === n ? 'active' : ''
            return (
              <div key={label} style={{ display: 'contents' }}>
                <div className={`fw-st ${cls}`}>
                  <div className="fw-st-num">{step > n ? '済' : n}</div>
                  <div>{label}</div>
                </div>
                {i < 2 && <div className={`fw-st-line${step > n ? ' done' : ''}`} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="fw-wrap">
        {step === 1 && (
          <div className="fw-pane">
            {Object.keys(errors).length > 0 && (
              <div className="fw-err-banner">入力内容に不備があります。赤く表示された項目をご確認ください。</div>
            )}
            {config.sections.map(sec => (
              <div key={sec.title} className="fw-card">
                <div className="fw-sec-title">{sec.title}</div>
                {sec.fields.map((f, i) => renderField(f, String(i)))}
              </div>
            ))}
            <div className="fw-card">
              <div className="fw-privacy">
                <h4>個人情報のお取り扱いについて</h4>
                ご入力いただいた個人情報は、お問い合わせへの回答・弊社サービスのご案内のみに使用いたします。
                第三者への開示・提供は行いません。詳細は
                <a href="https://spot-s.or.jp/privacy/" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>をご確認ください。
              </div>
              <label className="fw-agree">
                <input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors(er => ({ ...er, _agree: false })) }} />
                <span>プライバシーポリシーに同意して、確認画面へ進みます。</span>
              </label>
              {errors['_agree'] && <div className="fw-errmsg" style={{ marginBottom: 12 }}>同意にチェックを入れてください</div>}
              <div className="fw-btn-row">
                <button className="fw-btn fw-btn-p" onClick={goConfirm}>確認画面へ進む　→</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fw-pane">
            <div className="fw-card">
              <div className="fw-confirm-box">
                <strong>入力内容のご確認</strong>
                以下の内容でお間違いなければ「送信する」を押してください。修正がある場合は「修正する」で前の画面に戻れます。
              </div>
              <div className="fw-sec-title">貴社情報</div>
              <table className="fw-confirm-table"><tbody>
                <TR label="会社名・屋号" val={getStr('company')} />
                <TR label="担当者名" val={`${getStr('sei')} ${getStr('mei')}`} />
                <TR label="メールアドレス" val={getStr('email')} />
                <TR label="電話番号" val={getStr('phone') || '（なし）'} />
                <TR label="従業員数" val={getStr('emp')} />
              </tbody></table>
              <div className="fw-sec-title" style={{ marginTop: 20 }}>ご相談内容</div>
              <table className="fw-confirm-table"><tbody>
                <TR label="ご相談内容" val={getStr('message') || '（なし）'} />
                <TR label="希望連絡方法" val={getStr('contact')} />
                <TR label="お知りになったきっかけ" val={getStr('howFound') || '（未選択）'} />
                {EXTRA_KEYS.filter(k => values[k]).map(k => (
                  <TR key={k} label={k} val={displayVal(k)} />
                ))}
              </tbody></table>
            </div>
            {sendErr && <div className="fw-err-banner">送信中にエラーが発生しました。しばらくしてから再度お試しください。</div>}
            <div className="fw-btn-row">
              <button className="fw-btn fw-btn-s" onClick={() => { setStep(1); scrollToTop() }}>← 修正する</button>
              <button className="fw-btn fw-btn-p" onClick={doSubmit} disabled={sending}>
                {sending ? <><span className="fw-spinner" /> 送信中…</> : '送信する'}
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
              送信後、入力いただいたアドレスへ自動返信メールが届きます。
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="fw-pane">
            <div className="fw-success">
              <img src="/spot-thanks.png" alt="" className="fw-success-img" />
              <h2>お申し込みを受け付けました</h2>
              <p>
                ご入力のメールアドレスへ確認メールをお送りしました。<br />
                迷惑メールフォルダに入っている場合がございますのでご確認ください。<br /><br />
                担当者より<strong>3営業日以内</strong>にご連絡いたします。<br />
                ご不明な点は <a href="mailto:info@spot-s.jp">info@spot-s.jp</a> までお問い合わせください。
              </p>
              <p style={{ marginTop: 20 }}>
                <a href="https://spot-s.or.jp/" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', background: 'var(--c)', color: '#fff', borderRadius: 50, fontWeight: 800, textDecoration: 'none' }}>
                  ← トップページへ戻る
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

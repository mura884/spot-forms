import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'info@spot-s.jp'

// ドメイン認証なしで動作確認できるFromアドレス
// 独自ドメイン認証後は 'noreply@spot-s.or.jp' に変更する
const FROM_EMAIL = 'onboarding@resend.dev'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      formType, company, name, email, phone,
      emp, message, contact, howFound,
      subject, autoResponse, extra
    } = body

    if (!email || !company || !name) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    const adminBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【スポット社労士くん】申込みがありました
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ 申込み種別
${formType}

──────────────────────────
■ 貴社情報
会社名・屋号　：${company}
担当者名　　　：${name}
メールアドレス：${email}
電話番号　　　：${phone || '（なし）'}
従業員数　　　：${emp}

──────────────────────────
■ ご相談内容
${message || '（なし）'}

──────────────────────────
■ その他
希望連絡方法　　　　：${contact}
お知りになったきっかけ：${howFound || '（未選択）'}
${extra ? '\n──────────────────────────\n■ フォーム固有項目\n' + extra : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
※フォームからの自動送信メールです
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

    // ① 管理者への通知メール
    const { error: adminError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: subject || '【スポット社労士くん】お問い合わせ',
      text: adminBody,
    })
    if (adminError) throw new Error(adminError.message)

    // ② 申込者への自動返信メール
    if (autoResponse) {
      const { error: autoError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        reply_to: ADMIN_EMAIL,
        subject: 'お申し込みを受け付けました【スポット社労士くん】',
        text: autoResponse,
      })
      if (autoError) throw new Error(autoError.message)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 })
  }
}

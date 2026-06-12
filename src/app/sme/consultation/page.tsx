import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color: '#14b4c6', colorDk: '#0e95a5', colorLt: '#e8f9fb', colorMid: '#a8e8ef',
  tag: 'Free Consultation',
  title: 'はじめてのご相談\n無料相談お申し込み',
  subtitle: '「何をしたら良いか分からない」という方のための、まず話してみるだけの無料相談窓口です。',
  formType: 'はじめてのご相談（無料相談）',
  subject: '【スポット社労士くん】はじめてのご相談 お申し込みがありました',
  autoResp: `このたびは「はじめてのご相談」にお申し込みいただき、誠にありがとうございます。

担当者より3営業日以内にご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━
スポット社労士くん
https://spot-s.or.jp/
━━━━━━━━━━━━━━━━━━━━━
※このメールは自動送信です。返信はできません。`,
  sections: [
    {
      title: '貴社情報',
      fields: [
        { type: 'text', id: 'company', label: '会社名・屋号', placeholder: '例：株式会社〇〇', required: true, autoComplete: 'organization' },
        { type: 'col2', fields: [
          { type: 'text', id: 'sei', label: '担当者名（姓）', placeholder: '例：田中', required: true, autoComplete: 'family-name' },
          { type: 'text', id: 'mei', label: '担当者名（名）', placeholder: '例：太郎', required: true, autoComplete: 'given-name' },
        ]},
        { type: 'email', id: 'email', label: 'メールアドレス', placeholder: '例：info@example.co.jp', required: true, autoComplete: 'email' },
        { type: 'tel', id: 'phone', label: '電話番号', placeholder: '例：03-0000-0000', autoComplete: 'tel' },
        { type: 'radio', id: 'emp', label: '従業員数', required: true,
          options: ['1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
      ]
    },
    {
      title: 'ご相談内容',
      fields: [
        { type: 'textarea', id: 'message', label: 'お困りのこと・気になっていること',
          note: '「何が分からないか分からない」でも大丈夫です。思っていることをそのままご記入ください。',
          placeholder: '例：社会保険のことが全然分からない / 手続きが正しいか不安　など' },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

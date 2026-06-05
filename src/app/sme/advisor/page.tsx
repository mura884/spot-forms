import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color: '#00a6e2', colorDk: '#0084b8', colorLt: '#e6f6fd', colorMid: '#9ed9f5',
  tag: 'Advisor Contract',
  title: '顧問契約について\n無料相談お申し込み',
  subtitle: '社労士の顧問契約について詳しく知りたい・相談したい方のための無料相談窓口です。',
  formType: '顧問契約についての無料相談',
  subject: '【スポット社労士くん】顧問契約についての無料相談 お申し込みがありました',
  autoResp: `このたびは「顧問契約についての無料相談」にお申し込みいただき、誠にありがとうございます。

担当者より2営業日以内にご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━
スポット社労士くん
https://spot-s.or.jp/
━━━━━━━━━━━━━━━━━━━━━
※このメールは自動送信です。返信はできません。`,
  sections: [
    {
      title: '貴社情報',
      fields: [
        { type: 'text', id: 'company', label: '会社名・屋号', placeholder: '例：株式会社〇〇', required: true },
        { type: 'col2', fields: [
          { type: 'text', id: 'sei', label: '担当者名（姓）', placeholder: '例：田中', required: true },
          { type: 'text', id: 'mei', label: '担当者名（名）', placeholder: '例：太郎', required: true },
        ]},
        { type: 'email', id: 'email', label: 'メールアドレス', placeholder: '例：info@example.co.jp', required: true },
        { type: 'tel', id: 'phone', label: '電話番号', placeholder: '例：03-0000-0000' },
        { type: 'radio', id: 'emp', label: '従業員数', required: true,
          options: ['1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
        { type: 'radio', id: '現在の状況', label: '現在の状況',
          options: ['社労士と契約中（乗り換え検討）', '社労士なし（新規）', 'まだ検討中'] },
      ]
    },
    {
      title: '顧問契約についてのご相談',
      fields: [
        { type: 'textarea', id: 'message', label: 'お知りになりたいこと・ご相談内容',
          note: '具体的に教えていただけると、より的確なご提案ができます。',
          placeholder: '例：顧問料の目安を知りたい / 乗り換えを検討している　など' },
        { type: 'checkbox', id: '気になっていること', label: '特に気になっていること',
          options: ['顧問料の金額', '対応範囲・サービス内容', '切り替え・乗り換えの手続き', '対応スピード・連絡方法', '実績・信頼性'] },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

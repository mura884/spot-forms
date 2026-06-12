import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color: '#0054ca', colorDk: '#003e9a', colorLt: '#e8effe', colorMid: '#a8bef8',
  tag: 'Subsidy Consultation',
  title: '助成金について\n無料相談お申し込み',
  subtitle: '助成金について知りたい・申請の相談をしたい方のための無料相談窓口です。',
  formType: '助成金についての無料相談',
  subject: '【スポット社労士くん】助成金についての無料相談 お申し込みがありました',
  autoResp: `このたびは「助成金についての無料相談」にお申し込みいただき、誠にありがとうございます。

担当者より3営業日以内にご連絡いたします。

なお、助成金に関するご相談・申請は提携の社会保険労務士が対応いたします。

━━━━━━━━━━━━━━━━━━━━━
スポット社労士くん
https://spot-s.or.jp/
━━━━━━━━━━━━━━━━━━━━━
※このメールは自動送信です。返信はできません。`,
  sections: [
    {
      title: '貴社情報',
      fields: [
        { type: 'note', text: '※ 助成金に関連するご相談・お申し込みは、提携の社会保険労務士による対応となります。' },
        { type: 'text', id: 'company', label: '会社名・屋号', placeholder: '例：株式会社〇〇', required: true, autoComplete: 'organization' },
        { type: 'col2', fields: [
          { type: 'text', id: 'sei', label: '担当者名（姓）', placeholder: '例：田中', required: true, autoComplete: 'family-name' },
          { type: 'text', id: 'mei', label: '担当者名（名）', placeholder: '例：太郎', required: true, autoComplete: 'given-name' },
        ]},
        { type: 'email', id: 'email', label: 'メールアドレス', placeholder: '例：info@example.co.jp', required: true, autoComplete: 'email' },
        { type: 'tel', id: 'phone', label: '電話番号', placeholder: '例：03-0000-0000', autoComplete: 'tel' },
        { type: 'radio', id: 'emp', label: '従業員数', required: true,
          options: ['1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
        { type: 'select', id: '業種', label: '業種',
          options: ['製造業', '建設業', '小売業', '飲食・宿泊業', 'IT・情報通信業', '医療・福祉', 'サービス業', '運輸・物流', '不動産業', 'その他'] },
      ]
    },
    {
      title: '助成金についてのご相談',
      fields: [
        { type: 'textarea', id: 'message', label: 'ご興味のある助成金・ご相談内容',
          note: '具体的な助成金名が分からなくてもOKです。現在の状況をご記入ください。',
          placeholder: '例：採用したので使える助成金を確認したい / キャリアアップ助成金について知りたい　など' },
        { type: 'checkbox', id: '関心のある助成金', label: '関心のある助成金・状況',
          options: ['キャリアアップ助成金', '育休・産休に関する助成金'] },
        { type: 'radio', id: '申請経験', label: '助成金の申請経験',
          options: ['初めて', '過去に申請したことがある', '現在申請中'] },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

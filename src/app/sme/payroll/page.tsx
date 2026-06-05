import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color: '#4f6eea', colorDk: '#3651c7', colorLt: '#eef1fd', colorMid: '#b4c2f7',
  tag: 'Payroll Consultation',
  title: '給与計算について\n無料相談お申し込み',
  subtitle: '給与計算について相談・まるっとお任せしたい方のための無料相談窓口です。',
  formType: '給与計算についての無料相談',
  subject: '【スポット社労士くん】給与計算についての無料相談 お申し込みがありました',
  autoResp: `このたびは「給与計算についての無料相談」にお申し込みいただき、誠にありがとうございます。

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
        { type: 'radio', id: 'emp', label: '給与計算対象の従業員数', required: true,
          options: ['1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
        { type: 'radio', id: '現在の給与計算方法', label: '現在の給与計算方法',
          options: ['手計算・Excel', '給与ソフト（自社）', '税理士・会計士に依頼中', '社労士に依頼中', 'まだ決まっていない'] },
      ]
    },
    {
      title: '給与計算についてのご相談',
      fields: [
        { type: 'textarea', id: 'message', label: 'お困りのこと・ご相談内容',
          note: '現在の状況や課題を教えていただけると、より的確なご提案ができます。',
          placeholder: '例：月次の給与計算をすべてお任せしたい / 残業代計算が複雑　など' },
        { type: 'checkbox', id: 'お困りの点', label: '特にお困りの点',
          options: ['月次の給与計算業務', '残業代・割増賃金の計算', '社会保険料の控除計算', '賞与計算', '年末調整', '給与明細の発行'] },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

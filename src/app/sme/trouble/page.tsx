import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color:    '#7c3aed',
  colorDk:  '#5b21b6',
  colorLt:  '#f3effe',
  colorMid: '#c4b5fd',
  tag:      'Labor Consultation',
  title:    '労務トラブル・就業規則\n有料相談お申し込み',
  subtitle: '労務トラブル・就業規則・労基署対応などの有料相談（30分 11,000円〜）を承ります。',
  formType: '労務トラブル・就業規則相談（有料）',
  subject:  '【スポット社労士くん】労務トラブル・就業規則相談（有料）お申し込みがありました',
  autoResp: `このたびは「労務トラブル・就業規則相談（有料）」にお申し込みいただき、誠にありがとうございます。

担当者より3営業日以内に相談日程・お支払い方法についてご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【有料相談 料金のご案内】
労務相談　30分 11,000円（税込）〜
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

スポット社労士くん
https://spot-s.or.jp/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
※このメールは自動送信です。返信はできません。`,
  sections: [
    {
      title: '貴社情報',
      fields: [
        { type: 'note', text: '有料相談（30分 11,000円〜）のお申し込みフォームです。お申し込み後、担当者より日程・お支払い方法についてご連絡いたします。' },
        { type: 'text', id: 'company', label: '会社名・屋号', placeholder: '例：株式会社〇〇', required: true, autoComplete: 'organization' },
        { type: 'col2', fields: [
          { type: 'text', id: 'sei', label: '担当者名（姓）', placeholder: '例：田中', required: true, autoComplete: 'family-name' },
          { type: 'text', id: 'mei', label: '担当者名（名）', placeholder: '例：太郎', required: true, autoComplete: 'given-name' },
        ]},
        { type: 'email', id: 'email', label: 'メールアドレス', placeholder: '例：info@example.co.jp', required: true, autoComplete: 'email' },
        { type: 'tel', id: 'phone', label: '電話番号', placeholder: '例：03-0000-0000', autoComplete: 'tel' },
        { type: 'radio', id: 'emp', label: '従業員数', required: true,
          options: ['役員のみ', '1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
      ]
    },
    {
      title: 'ご相談内容',
      fields: [
        { type: 'radio', id: 'category', label: 'ご相談のカテゴリ', required: true,
          options: [
            '労務トラブル（未払い残業・解雇・ハラスメント等）',
            '就業規則の作成・見直し',
            '労基署・年金事務所の調査対応',
            '雇用契約書・労使協定の作成・確認',
            '問題社員への対応方法',
            '労働時間管理・36協定',
            'その他（下記に記入）',
          ]},
        { type: 'text', id: 'category_other', label: 'その他の場合はこちらに入力',
          placeholder: '例：退職勧奨の進め方について　など',
          showIf: { fieldId: 'category', equals: 'その他（下記に記入）' } },
        { type: 'radio', id: 'urgency', label: '緊急度', required: true,
          options: ['急ぎ（1週間以内に対応が必要）', '普通（2〜4週間以内）', '余裕あり（1ヶ月以上）'] },
        { type: 'textarea', id: 'message', label: '相談内容の詳細', required: true,
          note: '状況を具体的にご記入いただくと、スムーズな対応が可能です。登場人物の関係性・時系列・現在の状況など教えてください。',
          placeholder: `例：
・従業員Aが〇ヶ月前から無断欠勤を繰り返している
・口頭では注意したが改善がない
・解雇を検討しているが手順が分からない
・就業規則には懲戒規定があるが...` },
        { type: 'radio', id: 'contact_method', label: 'ご希望の相談方法', required: true,
          options: ['Zoom（オンライン）', '電話', 'どちらでも'] },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

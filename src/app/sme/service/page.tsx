import FormWizard, { FormConfig } from '@/components/FormWizard'

const config: FormConfig = {
  color:    '#2d9e6b',
  colorDk:  '#1e7a52',
  colorLt:  '#e8f7f1',
  colorMid: '#96d9bc',
  tag:      'Service Consultation',
  title:    '社労士サービスについて\n無料相談お申し込み',
  subtitle: 'スポット社労士くんのサービスについて、まずはお気軽にご相談ください。',
  formType: '社労士サービスについての無料相談',
  subject:  '【スポット社労士くん】社労士サービスについての無料相談 お申し込みがありました',
  autoResp: `このたびは「社労士サービスについての無料相談」にお申し込みいただき、誠にありがとうございます。

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
          options: ['役員のみ', '1〜4名', '5〜9名', '10〜29名', '30〜99名', '100名以上'] },
      ]
    },
    {
      title: 'ご相談内容',
      fields: [
        { type: 'note', text: '※ 複数選択できます。「どれか分からない」の場合はその選択肢を選んでください。' },
        { type: 'checkbox', id: 'service', label: 'ご興味のあるサービス', options: [
          '給与計算サポート・アウトソーシング',
          '社会保険・労働保険の手続き代行',
          '顧問契約（手続き代行＋労務相談）',
          'はじめて従業員を雇用する際のサポート（社保・労保・給与計算・就業規則まとめてパック）',
          '就業規則の作成・見直し',
          'キャリアアップ助成金の相談・申請',
          '育休・産休に関する助成金の相談・申請',
          '労働者代表の選出サポート（楽楽代表）',
          '採用強化・ハローワーク活用の相談',
          '評価制度の相談',
          '社労士の変更・乗り換えの相談',
          'どれか分からない',
        ]},
        { type: 'text', id: 'service_other', label: 'その他の場合はこちらに入力',
          placeholder: '例：労使協定の作成、外国人雇用の手続きについて　など',
          showIf: { fieldId: 'service', equals: 'その他' } },
        { type: 'radio', id: 'contact_method', label: 'ご希望の相談方法', required: true,
          options: ['Zoom（オンライン）', '電話', 'メール'] },
        { type: 'radio', id: 'contact', label: 'ご希望の連絡方法', required: true,
          options: ['メール', '電話', 'どちらでも'] },
        { type: 'select', id: 'howFound', label: 'このサイトをお知りになったきっかけ',
          options: ['Google検索', 'Yahoo!検索', 'SNS（X・Instagram等）', '知人・紹介', '税理士・会計士から', 'チラシ・DM', 'その他'] },
        { type: 'textarea', id: 'message', label: 'ご相談内容・気になっていること',
          note: '具体的に教えていただけると、より的確なご提案ができます。',
          placeholder: '例：従業員を初めて採用するので何が必要か知りたい / 給与計算を外注したい / 社労士を変えたい　など' },
      ]
    }
  ]
}

export default function Page() { return <FormWizard config={config} /> }

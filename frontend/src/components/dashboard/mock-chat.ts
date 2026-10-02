import {
  IconCalendarStats,
  IconCoin,
  IconFileDescription,
  IconScale,
} from '@tabler/icons-react';

import type {
  IChat,
  IChatMessage,
  IDocument,
  ISource,
  IUserProfile,
  TStreamTransport,
} from '@/types/chat.types';

const NOW = Date.now();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const at = (msAgo: number) => new Date(NOW - msAgo).toISOString();

export const MOCK_USER: IUserProfile = {
  name: 'Anna Kim',
  email: 'anna@pdflyzer.app',
  initials: 'AK',
};

export const MOCK_TRANSPORT: TStreamTransport = 'websocket';

export const MOCK_DOCUMENTS: IDocument[] = [
  {
    id: 'doc-1',
    name: 'Service Agreement 2025.pdf',
    size: 2_412_238,
    pages: 48,
    status: 'ready',
  },
  {
    id: 'doc-2',
    name: 'Statement of Work.pdf',
    size: 696_320,
    pages: 12,
    status: 'ready',
  },
  {
    id: 'doc-3',
    name: 'Renewal Addendum.pdf',
    size: 317_440,
    pages: 6,
    status: 'processing',
  },
  {
    id: 'doc-4',
    name: 'Q3 Vendor Invoices.pdf',
    size: 5_346_304,
    pages: 34,
    status: 'queued',
  },
  {
    id: 'doc-5',
    name: 'Data Processing Terms (scanned).pdf',
    size: 9_961_472,
    pages: 0,
    status: 'failed',
  },
];

export const MOCK_CHATS: IChat[] = [
  {
    _id: 'chat-1',
    name: 'Supplier contract Q&A',
    updated_at: at(7 * MINUTE),
    owner_id: '',
    pinned: true,
  },
  {
    _id: 'chat-2',
    name: 'Annual report 2025 highlights',
    updated_at: at(3 * HOUR),
    owner_id: '',
  },
  {
    _id: 'chat-3',
    name: 'Compliance review checklist',
    updated_at: at(26 * HOUR),
    owner_id: '',
  },
  {
    _id: 'chat-4',
    name: 'Vendor invoice reconciliation',
    updated_at: at(3 * DAY),
    owner_id: '',
  },
  {
    _id: 'chat-5',
    name: 'Data processing terms',
    updated_at: at(6 * DAY),
    owner_id: '',
  },
  {
    _id: 'chat-6',
    name: 'Renewal negotiation notes',
    updated_at: at(19 * DAY),
    owner_id: '',
  },
];

const PAYMENT_SOURCES: ISource[] = [
  { file: 'Service-Agreement-2025.pdf', page: 4, section: 'Invoicing' },
  { file: 'Statement-of-Work.pdf', page: 2, section: 'Milestone Payments' },
  { file: 'Renewal-Addendum.pdf', page: 6, section: 'Payment Terms' },
];

const TERMINATION_SOURCES: ISource[] = [
  {
    file: 'Service-Agreement-2025.pdf',
    page: 9,
    section: 'Termination for Convenience',
  },
  {
    file: 'Service-Agreement-2025.pdf',
    page: 10,
    section: 'Termination for Cause',
  },
  { file: 'Renewal-Addendum.pdf', page: 2, section: 'Fees on Exit' },
];

const FALLBACK_SOURCES: ISource[] = [
  { file: 'Service-Agreement-2025.pdf', page: 31, section: 'Schedules' },
  { file: 'Service-Agreement-2025.pdf', page: 1, section: 'Definitions' },
  { file: 'Statement-of-Work.pdf', page: 11, section: 'Order of Precedence' },
];

export const PAYMENT_REPLY =
  '## Payment terms, side by side\n- **Service Agreement** — **net 30** from the invoice date, no deposit[[1]].\n- **Statement of Work** — **20% deposit** on signature, balance released on milestone acceptance[[2]].\n- **Renewal Addendum** — moves to **net 45** for the second contract year[[3]].\n\n## What actually changes on renewal\nThe Addendum supersedes clause 6.1 of the Service Agreement, but only for invoices raised after the renewal date[[3]]. Anything already in flight stays on **net 30**[[1]].\n\n## Details worth knowing\n- Early-payment terms are referenced in clause 6.2 but are not carried across into the renewed wording[[3]].\n- A purchase order issued by your team overrides the Addendum entirely[[2]].\n- The Addendum defines its own effective date, which is the renewal date rather than the signature date[[3]].';

export const TERMINATION_REPLY =
  '## Notice periods\n- **For convenience** — **60 days** written notice from either side[[1]]. No cure period applies.\n- **For cause** — **14 days** notice, which only takes effect after a **10-day cure period**[[2]].\n- **Insolvency** — immediate, per clause 11.4[[1]].\n\n## Financial exposure on exit\n- Fees for work already performed are due on the termination date[[1]].\n- Unused prepaid balances are refunded pro rata[[3]].\n- There is no wind-down or termination fee in any of the three documents[[1]].\n\n## Operational gaps\n- Notice must name the clause relied upon, or it is deemed to be for convenience[[2]].\n- Purchase orders issued before notice keep their own terms until they expire[[3]].';

export const FALLBACK_REPLY =
  '## What I searched\n- Full text of the three readable documents, including schedules and appendices.\n- Cross-references to the same defined terms across files[[1]].\n\n## Closest matches\n- The schedules attached to the Service Agreement, which override the body of the contract[[1]].\n- The definitions section — Effective Date is defined differently in the Service Agreement than in the Statement of Work[[2]].\n- The precedence clause, which decides which document wins when they disagree[[3]].\n\n## Suggested next step\nRephrase with a clause number or an exact quoted phrase. Literal language from the PDF retrieves far more sharply than paraphrased questions, and I will cite the page it came from[[1]].';

export interface ICannedReply {
  match: RegExp;
  status: string[];
  sources: ISource[];
  reply: string;
}

export const CANNED_REPLIES: ICannedReply[] = [
  {
    match: /pay|invoice|net\s*3|net\s*4|deposit|renew/i,
    status: [
      'Searching 3 documents',
      'Reading clause 6.1 — Invoicing',
      'Cross-checking the Renewal Addendum',
    ],
    sources: PAYMENT_SOURCES,
    reply: PAYMENT_REPLY,
  },
  {
    match: /terminat|notice|cancel|exit|breach|cause/i,
    status: [
      'Searching 3 documents',
      'Reading clause 9 — Termination',
      'Verifying the cure period',
    ],
    sources: TERMINATION_SOURCES,
    reply: TERMINATION_REPLY,
  },
];

export const FALLBACK_REPLY_CANNED: ICannedReply = {
  match: /.*/,
  status: ['Searching 3 documents', 'Ranking passages by relevance'],
  sources: FALLBACK_SOURCES,
  reply: FALLBACK_REPLY,
};

export const MOCK_THREADS: Record<string, IChatMessage[]> = {
  'chat-1': [
    {
      _id: 'm-1',
      sender_role: 'user',
      content:
        'What are the payment terms in both contracts, and do they change on renewal?',
      created_at: at(9 * MINUTE),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
    },
    {
      _id: 'm-2',
      sender_role: 'assistant',
      content: PAYMENT_REPLY,
      created_at: at(8 * MINUTE),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
      sources: PAYMENT_SOURCES,
      rating: 'up',
    },
    {
      _id: 'm-3',
      sender_role: 'user',
      content:
        'And what happens if we need to exit early — how much notice do we owe?',
      created_at: at(7 * MINUTE),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
    },
    {
      _id: 'm-4',
      sender_role: 'assistant',
      content: TERMINATION_REPLY,
      created_at: at(7 * MINUTE),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
      sources: TERMINATION_SOURCES,
    },
  ],
  'chat-2': [
    {
      _id: 'm-5',
      sender_role: 'user',
      content: 'Summarise the risk factors section in under 200 words.',
      created_at: at(3 * HOUR),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
    },
    {
      _id: 'm-6',
      sender_role: 'assistant',
      content: FALLBACK_REPLY,
      created_at: at(3 * HOUR),
      chat_id: '',
      embeddings: [],
      sender_id: '',
      updated_at: '',
      status: 'done',
      sources: FALLBACK_SOURCES,
    },
  ],
};

export const SUGGESTIONS: {
  icon: typeof IconCoin;
  label: string;
  prompt: string;
}[] = [
  {
    icon: IconCoin,
    label: 'Payment terms & renewal',
    prompt:
      'What are the payment terms in both contracts, and do they change on renewal?',
  },
  {
    icon: IconScale,
    label: 'Termination clauses',
    prompt: 'Compare the termination clauses across all three documents.',
  },
  {
    icon: IconFileDescription,
    label: 'Summarise the SOW',
    prompt:
      'Summarise the Statement of Work into a short brief for the leadership review.',
  },
  {
    icon: IconCalendarStats,
    label: 'Key dates & deadlines',
    prompt:
      'List every deadline, renewal window and notice period across these documents.',
  },
];

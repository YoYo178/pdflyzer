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
  TChatMode,
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

export const MOCK_USAGE = { pages: 1284, limit: 2000 };

export const MOCK_DOCUMENTS: IDocument[] = [
  {
    id: 'doc-1',
    name: 'Service Agreement 2025',
    pages: 48,
    size: '2.4 MB',
    status: 'ready',
  },
  {
    id: 'doc-2',
    name: 'Statement of Work',
    pages: 12,
    size: '680 KB',
    status: 'ready',
  },
  {
    id: 'doc-3',
    name: 'Renewal Addendum',
    pages: 6,
    size: '310 KB',
    status: 'ready',
  },
  {
    id: 'doc-4',
    name: 'Q3 Vendor Invoices',
    pages: 34,
    size: '5.1 MB',
    status: 'processing',
    progress: 62,
  },
];

export const MOCK_CHATS: IChat[] = [
  {
    id: 'chat-1',
    title: 'Supplier contract Q&A',
    updatedAt: at(7 * MINUTE),
    pinned: true,
  },
  { id: 'chat-2', title: 'Annual report 2025 highlights', updatedAt: at(3 * HOUR) },
  { id: 'chat-3', title: 'Compliance review checklist', updatedAt: at(26 * HOUR) },
  { id: 'chat-4', title: 'Vendor invoice reconciliation', updatedAt: at(3 * DAY) },
  { id: 'chat-5', title: 'Data processing terms', updatedAt: at(6 * DAY) },
  { id: 'chat-6', title: 'Renewal negotiation notes', updatedAt: at(19 * DAY) },
];

const PAYMENT_SOURCES: ISource[] = [
  { file: 'Service-Agreement-2025.pdf', page: 4, section: 'Invoicing' },
  { file: 'Statement-of-Work.pdf', page: 2, section: 'Milestone Payments' },
  { file: 'Renewal-Addendum.pdf', page: 6, section: 'Payment Terms' },
];

const TERMINATION_SOURCES: ISource[] = [
  { file: 'Service-Agreement-2025.pdf', page: 9, section: 'Termination for Convenience' },
  { file: 'Service-Agreement-2025.pdf', page: 10, section: 'Termination for Cause' },
  { file: 'Renewal-Addendum.pdf', page: 2, section: 'Fees on Exit' },
];

export const PAYMENT_ASK =
  'The Service Agreement sets invoices at **net 30** from the issue date[[1]], and the Statement of Work adds a **20% deposit** on signature with the balance on milestone acceptance[[2]].\n\nThe Renewal Addendum is the part that catches people out: it moves everything to **net 45** for the second contract year[[3]]. So invoices raised after the renewal date are owed 15 days later than they were.\n\nOne condition — the Addendum only overrides the main agreement if it was countersigned. Without a signature, you are still on net 30 plus the deposit[[2]].';

export const PAYMENT_DIVE =
  '## Payment terms, side by side\n- **Service Agreement** — **net 30** from the invoice date, no deposit[[1]].\n- **Statement of Work** — **20% deposit** on signature, balance released on milestone acceptance[[2]].\n- **Renewal Addendum** — moves to **net 45** for the second contract year[[3]].\n\n## What actually changes on renewal\nThe Addendum supersedes clause 6.1 of the Service Agreement, but only for invoices raised after the renewal date[[3]]. Anything already in flight stays on **net 30**[[1]].\n\n## Details worth knowing\n- Early-payment terms are referenced in clause 6.2 but are not carried across into the renewed wording[[3]].\n- A purchase order issued by your team overrides the Addendum entirely[[2]].\n- The Addendum defines its own effective date, which is the renewal date rather than the signature date[[3]].';

export const TERMINATION_ASK =
  'Termination for convenience needs **60 days written notice**[[1]]. For cause it drops to **14 days**, but only after a **10-day cure period**[[2]] — that cure window is the clause most teams miss, because notice only becomes effective once it expires.\n\nOn the money side, fees for work already performed are payable on the termination date itself[[1]], and any unused prepaid balance is refunded pro rata[[3]]. There is no wind-down fee in either document.';

export const TERMINATION_DIVE =
  '## Notice periods\n- **For convenience** — **60 days** written notice from either side[[1]]. No cure period applies.\n- **For cause** — **14 days** notice, which only takes effect after a **10-day cure period**[[2]].\n- **Insolvency** — immediate, per clause 11.4[[1]].\n\n## Financial exposure on exit\n- Fees for work already performed are due on the termination date[[1]].\n- Unused prepaid balances are refunded pro rata[[3]].\n- There is no wind-down or termination fee in any of the three documents[[1]].\n\n## Operational gaps\n- Notice must name the clause relied upon, or it is deemed to be for convenience[[2]].\n- Purchase orders issued before notice keep their own terms until they expire[[3]].';

export const FALLBACK_ASK =
  'I read all 4 documents in this chat, and nothing answers that directly. Rather than guess, two places worth checking:\n\n- The schedules attached to the Service Agreement — they override the body of the contract[[1]].\n- The definitions section, which uses Effective Date differently than the Statement of Work does[[2]].\n\nTry rephrasing with a clause number or an exact phrase from the document. Quoted language retrieves far more sharply than paraphrased questions.';

export const FALLBACK_DIVE =
  '## What I searched\n- Full text of all 4 documents, 100 pages total, including schedules and appendices.\n- Cross-references to the same defined terms across files[[1]].\n\n## Closest matches\n- The schedules attached to the Service Agreement, which override the body of the contract[[1]].\n- The definitions section — Effective Date is defined differently in the Service Agreement than in the Statement of Work[[2]].\n- The precedence clause, which decides which document wins when they disagree[[3]].\n\n## Suggested next step\nRephrase with a clause number or an exact quoted phrase. Literal language from the PDF retrieves far more sharply than paraphrased questions, and I will cite the page it came from[[1]].';

const FALLBACK_SOURCES: ISource[] = [
  { file: 'Service-Agreement-2025.pdf', page: 31, section: 'Schedules' },
  { file: 'Service-Agreement-2025.pdf', page: 1, section: 'Definitions' },
  { file: 'Statement-of-Work.pdf', page: 11, section: 'Order of Precedence' },
];

interface ICannedReply {
  match: RegExp;
  status: string[];
  sources: ISource[];
  ask: string;
  dive: string;
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
    ask: PAYMENT_ASK,
    dive: PAYMENT_DIVE,
  },
  {
    match: /terminat|notice|cancel|exit|breach|cause/i,
    status: [
      'Searching 3 documents',
      'Reading clause 9 — Termination',
      'Verifying the cure period',
    ],
    sources: TERMINATION_SOURCES,
    ask: TERMINATION_ASK,
    dive: TERMINATION_DIVE,
  },
];

export const FALLBACK_REPLY: ICannedReply = {
  match: /.*/,
  status: ['Searching 4 documents', 'Ranking passages by relevance'],
  sources: FALLBACK_SOURCES,
  ask: FALLBACK_ASK,
  dive: FALLBACK_DIVE,
};

export const MOCK_THREADS: Record<string, IChatMessage[]> = {
  'chat-1': [
    {
      id: 'm-1',
      role: 'user',
      content:
        'What are the payment terms in both contracts, and do they change on renewal?',
      createdAt: at(9 * MINUTE),
      status: 'done',
    },
    {
      id: 'm-2',
      role: 'assistant',
      content: PAYMENT_ASK,
      createdAt: at(8 * MINUTE),
      status: 'done',
      sources: PAYMENT_SOURCES,
      rating: 'up',
    },
    {
      id: 'm-3',
      role: 'user',
      content: 'And what happens if we need to exit early — how much notice do we owe?',
      createdAt: at(7 * MINUTE),
      status: 'done',
    },
    {
      id: 'm-4',
      role: 'assistant',
      content: TERMINATION_ASK,
      createdAt: at(7 * MINUTE),
      status: 'done',
      sources: TERMINATION_SOURCES,
    },
  ],
  'chat-2': [
    {
      id: 'm-5',
      role: 'user',
      content: 'Summarise the risk factors section in under 200 words.',
      createdAt: at(3 * HOUR),
      status: 'done',
    },
    {
      id: 'm-6',
      role: 'assistant',
      content: FALLBACK_DIVE,
      createdAt: at(3 * HOUR),
      status: 'done',
      sources: FALLBACK_SOURCES,
    },
  ],
};

export const SUGGESTIONS: {
  icon: typeof IconCoin;
  label: string;
  prompt: string;
  mode: TChatMode;
}[] = [
  {
    icon: IconCoin,
    label: 'Payment terms & renewal',
    prompt: 'What are the payment terms in both contracts, and do they change on renewal?',
    mode: 'ask',
  },
  {
    icon: IconScale,
    label: 'Termination clauses',
    prompt: 'Compare the termination clauses across all three documents.',
    mode: 'dive',
  },
  {
    icon: IconFileDescription,
    label: 'Summarise the SOW',
    prompt: 'Summarise the Statement of Work into a short brief for the leadership review.',
    mode: 'ask',
  },
  {
    icon: IconCalendarStats,
    label: 'Key dates & deadlines',
    prompt: 'List every deadline, renewal window and notice period across these documents.',
    mode: 'dive',
  },
];
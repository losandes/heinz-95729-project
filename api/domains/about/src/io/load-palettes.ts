const palettes = [
  {
    name: 'dracula',
    nameColor: 'text-biloba-flower-500 dark:text-persian-pink-500',
    palette: [
      { name: 'blue', bg: 'bg-dracula-blue', hex: '#97e1f1' },
      { name: 'green', bg: 'bg-dracula-green', hex: '#61e884' },
      { name: 'yellow', bg: 'bg-dracula-yellow', hex: '#dee493' },
      { name: 'orange', bg: 'bg-dracula-orange', hex: '#ffb86c' },
      { name: 'pink', bg: 'bg-dracula-pink', hex: '#f385c4' },
      { name: 'purple', bg: 'bg-dracula-purple', hex: '#b898e6' },
    ],
  },
  {
    name: 'smoke',
    nameColor: 'text-smoke-500 dark:text-smoke-300',
    palette: [
      { name: '900', bg: 'bg-smoke-900', hex: '#121318' },
      { name: '800', bg: 'bg-smoke-800', hex: '#1b1c25' },
      { name: '700', bg: 'bg-smoke-700', hex: '#282a36' },
      { name: '600', bg: 'bg-smoke-600', hex: '#3e4255' },
      { name: '500', bg: 'bg-smoke-500', hex: '#696f8f' },
      { name: '400', bg: 'bg-smoke-400', hex: '#9da4ca' },
      { name: '300', bg: 'bg-smoke-300', hex: '#c7ceec' },
      { name: '200', bg: 'bg-smoke-200', hex: '#dbe1f8' },
      { name: '100', bg: 'bg-smoke-100', hex: '#eaecf9' },
      { name: '50', bg: 'bg-smoke-50', hex: '#eff1fc' },
    ],
  },
  {
    name: 'slate',
    nameColor: 'text-slate-500 dark:text-slate-300',
    palette: [
      { name: '900', bg: 'bg-slate-900', hex: '#0F172A' },
      { name: '800', bg: 'bg-slate-800', hex: '#1E293B' },
      { name: '700', bg: 'bg-slate-700', hex: '#334155' },
      { name: '600', bg: 'bg-slate-600', hex: '#475569' },
      { name: '500', bg: 'bg-slate-500', hex: '#64748B' },
      { name: '400', bg: 'bg-slate-400', hex: '#94A3B8' },
      { name: '300', bg: 'bg-slate-300', hex: '#CBD5E1' },
      { name: '200', bg: 'bg-slate-200', hex: '#E2E8F0' },
      { name: '100', bg: 'bg-slate-100', hex: '#F1F5F9' },
      { name: '50', bg: 'bg-slate-50', hex: '#F8FAFC' },
    ],
  },
]

// async to mimic a call to a database
const loadPalettes = async () => palettes
export default loadPalettes

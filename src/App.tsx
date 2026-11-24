import { useEffect, useState } from 'react'
import { SERVICE } from './data'
import { Overview } from './pages/Overview'
import { DocView } from './pages/DocView'
import { Demo } from './pages/Demo'

const DEFAULT = '#/doc/W1'
function useHash() {
  const [h, setH] = useState(location.hash || DEFAULT)
  useEffect(() => {
    const f = () => setH(location.hash || DEFAULT)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return h
}

export default function App() {
  const hash = useHash()
  const [, kind, id = 'W1'] = hash.split('/')
  const tab = kind === 'flow' ? 'flow' : kind === 'demo' ? 'demo' : 'doc'
  const link = (t: string, href: string, label: string) => (
    <a href={href} aria-current={tab === t ? 'page' : undefined}
      className={`px-4 py-2 rounded-full text-sm font-bold ${tab === t ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{label}</a>
  )
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-doc mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span aria-hidden className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold shrink-0">☕</span>
            <div className="min-w-0">
              <div className="font-extrabold truncate">{SERVICE.name} <span className="text-gray-500 font-medium">{SERVICE.sub}</span></div>
              <div className="text-xs text-gray-500">{SERVICE.version} · {SERVICE.project}</div>
            </div>
          </div>
          <nav className="no-print flex items-center gap-1" aria-label="주 메뉴">
            {link('flow', '#/flow', '전체 흐름 보기')}{link('doc', '#/doc/W1', '문서 보기')}{link('demo', '#/demo/W1', '시연하기')}
            <button onClick={() => window.print()} className="ml-2 px-3 py-2 rounded-full border border-gray-300 text-sm">문서 인쇄</button>
          </nav>
        </div>
      </header>
      <main className="max-w-doc mx-auto px-4 md:px-8 py-6">
        {tab === 'flow' && <Overview />}
        {tab === 'doc' && <DocView key={id} id={id} />}
        {tab === 'demo' && <Demo key={id} id={id} />}
      </main>
    </div>
  )
}

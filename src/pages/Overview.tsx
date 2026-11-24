import { FLOW, SCREENS } from '../data'
import { Screen } from '../screens'
import { STATIC_CTX } from '../demo'

export function Thumb({ id }: { id: (typeof SCREENS)[number]['id'] }) {
  const k = 0.42
  return (
    <div className="mx-auto overflow-hidden rounded-lg border border-gray-200" style={{ width: 390 * k, height: 844 * k }} aria-hidden>
      <div {...({ inert: '' } as object)} style={{ width: 390, height: 844, transform: `scale(${k})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <Screen id={id} ctx={STATIC_CTX} />
      </div>
    </div>
  )
}

export function Overview() {
  return (
    <div className="flex flex-col gap-6">
      <section className="doc-card bg-white border border-gray-200 rounded-2xl p-5">
        <h1 className="text-xl font-extrabold mb-2">전체 흐름 보기</h1>
        <p className="text-sm text-gray-600 mb-3">화면 {SCREENS.length}개 · 기획 대화에서 만든 IA / User Flow 기준 (Notion 원문 링크는 읽지 못해 반영하지 못했습니다).</p>
        <ol className="list-decimal pl-5 text-sm leading-7 text-gray-800">{FLOW.map(f => <li key={f}>{f}</li>)}</ol>
      </section>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {SCREENS.map(s => (
          <li key={s.id} className="doc-card bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-xs text-gray-500">{s.id} · {s.type}</div>
            <h2 className="font-extrabold text-lg">{s.name}</h2>
            <Thumb id={s.id} />
            <p className="text-sm text-gray-700">{s.purpose}</p>
            <p className="text-sm"><b>다음 이동</b> {s.to.join(' · ')}</p>
            <div className="mt-auto flex gap-2 no-print">
              <a href={`#/doc/${s.id}`} className="flex-1 text-center py-2 rounded-lg border border-gray-300 text-sm font-bold">문서 보기</a>
              <a href={`#/demo/${s.id}`} className="flex-1 text-center py-2 rounded-lg bg-brand text-white text-sm font-bold">시연하기</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

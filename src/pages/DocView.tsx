import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FEATURES, NA, SCREENS, SRC, TBD, byId, next, prev } from '../data'
import type { Feature, ScreenDoc } from '../data'
import { Screen } from '../screens'
import { STATIC_CTX } from '../demo'

interface Mark { no: string; x: number; y: number; w: number; h: number }
const W = 390, H = 844

function Frame({ doc, sel, onSel }: { doc: ScreenDoc; sel: string | null; onSel: (no: string) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [cw, setCw] = useState(560)
  const [fit, setFit] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [marks, setMarks] = useState<Mark[]>([])
  const [hover, setHover] = useState<string | null>(null)
  const fitScale = Math.max(0.1, (cw - 2) / W)
  const scale = fit ? fitScale : zoom

  useEffect(() => {
    if (!box.current) return
    const ro = new ResizeObserver(e => setCw(e[0].contentRect.width))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const measure = useCallback(() => {
    const r = root.current
    if (!r) return
    const base = r.getBoundingClientRect()
    const s = base.width / W
    const list: Mark[] = []
    r.querySelectorAll<HTMLElement>('[data-no]').forEach(el => {
      const b = el.getBoundingClientRect()
      list.push({ no: el.dataset.no!, x: (b.left - base.left) / s, y: (b.top - base.top) / s, w: b.width / s, h: b.height / s })
    })
    setMarks(list)
  }, [])
  useLayoutEffect(measure, [measure, doc.id, scale])
  useEffect(() => { document.fonts?.ready.then(measure) }, [measure, doc.id])

  const setZ = (z: number) => { setFit(false); setZoom(Math.min(1.6, Math.max(0.25, z))) }
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="no-print flex flex-wrap items-center gap-2 text-sm">
        <button aria-label="축소" onClick={() => setZ(scale - 0.1)} className="w-9 h-9 rounded-lg border border-gray-300 font-bold">−</button>
        <input aria-label="배율" type="range" min={25} max={160} value={Math.round(scale * 100)} onChange={e => setZ(+e.target.value / 100)} className="flex-1 min-w-24 accent-green-700" />
        <button aria-label="확대" onClick={() => setZ(scale + 0.1)} className="w-9 h-9 rounded-lg border border-gray-300 font-bold">+</button>
        <span className="w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
        <button onClick={() => setFit(true)} className="px-3 h-9 rounded-lg border border-gray-300 font-bold">화면 맞춤</button>
      </div>
      <div ref={box} className="frame-scroll border border-gray-200 rounded-xl bg-gray-50 overflow-auto" style={{ maxHeight: fit ? undefined : '85vh' }}>
        <div style={{ width: W * scale, height: H * scale, position: 'relative' }}>
          <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0 }}>
            <div ref={root} {...({ inert: '' } as object)} style={{ width: W, height: H, pointerEvents: 'none' }}><Screen id={doc.id} ctx={STATIC_CTX} /></div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {marks.map((m, i) => {
                const on = sel === m.no || hover === m.no
                return (
                  <div key={i}>
                    {on && <div style={{ position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, border: `${2 / scale}px solid #6d28d9`, background: 'rgba(109,40,217,.07)' }} />}
                    <button aria-label={`구성 요소 ${m.no} 설명으로 이동`} onClick={() => onSel(m.no)} onMouseEnter={() => setHover(m.no)} onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(m.no)} onBlur={() => setHover(null)}
                      style={{ position: 'absolute', left: m.x + 4, top: m.y + 4, width: 24, height: 24, pointerEvents: 'auto', transform: `scale(${1 / scale})`, transformOrigin: 'top left' }}
                      className={`rounded-full text-[11px] font-bold text-white flex items-center justify-center bg-mark ${sel === m.no ? 'ring-2 ring-offset-1 ring-mark' : ''}`}>{m.no}</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Muted = ({ v }: { v: string }) => (v === NA || v.includes(TBD) || v.includes(NA) ? <span className="text-amber-800">{v}</span> : <>{v}</>)
const Row = ({ k, v }: { k: string; v: string }) => (<div className="grid grid-cols-[110px_1fr] gap-2 py-1.5 border-b border-gray-100 text-sm"><dt className="font-bold text-gray-600">{k}</dt><dd><Muted v={v} /></dd></div>)

function FeatureCard({ f }: { f: Feature }) {
  return (
    <article id={f.id} className="doc-card bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex flex-wrap items-baseline gap-x-3"><span className="text-brand font-extrabold">{f.id}</span><h3 className="text-lg font-extrabold">{f.name}</h3><span className="text-xs text-gray-500">{f.type} · {f.priority}</span></div>
      <p className="text-sm mt-1 mb-3">{f.purpose}</p>
      <dl>
        <Row k="연결 화면" v={f.screens.map(s => `${s} ${byId(s).name}`).join(', ')} />
        <Row k="출처" v={SRC} />
        <Row k="기획된 동작" v={f.planned} />
        <Row k="현재 구현 상태" v={f.impl} />
      </dl>
      <details className="mt-3 group" open>
        <summary className="cursor-pointer text-sm font-bold text-brand no-print">상세 명세 접기·펼치기</summary>
        <dl className="mt-2">
          <Row k="Actor" v={f.actor} /><Row k="Trigger" v={f.trigger} /><Row k="선행 조건" v={f.pre} /><Row k="입력·유효성" v={f.input} />
          <div className="grid grid-cols-[110px_1fr] gap-2 py-1.5 border-b border-gray-100 text-sm"><dt className="font-bold text-gray-600">처리 순서</dt><dd><ol className="list-decimal pl-4">{f.steps.map(s => <li key={s}>{s}</li>)}</ol></dd></div>
          <Row k="데이터 변화" v={f.data} /><Row k="성공·실패·취소" v={f.result} /><Row k="권한" v={f.permission} /><Row k="중복 실행" v={f.dup} />
          <Row k="최댓값·경계값" v={f.boundary} /><Row k="저장·동기화" v={f.storage} />
          <div className="grid grid-cols-[110px_1fr] gap-2 py-1.5 text-sm"><dt className="font-bold text-gray-600">QA 기준</dt><dd><ul className="list-disc pl-4">{f.qa.map(s => <li key={s}>{s}</li>)}</ul></dd></div>
        </dl>
      </details>
    </article>
  )
}

export function DocView({ id }: { id: string }) {
  const doc = byId(id)
  const [sel, setSel] = useState<string | null>(null)
  const pv = prev(doc.id), nx = next(doc.id)
  const pick = (no: string) => { setSel(no); document.getElementById(`comp-${no}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
  const card = 'doc-card bg-white border border-gray-200 rounded-2xl p-5'
  const feats = FEATURES.filter(f => f.screens.includes(doc.id))
  return (
    <div className="flex flex-col gap-6">
      <section className={card} aria-labelledby="a">
        <div className="no-print flex items-center justify-between gap-2 text-sm mb-4">
          {pv ? <a href={`#/doc/${pv.id}`} className="px-3 py-2 rounded-lg border border-gray-300">‹ 이전 문서 {pv.id} {pv.name}</a> : <span />}
          <span className="text-xs text-gray-500 hidden sm:inline">이전·다음은 문서 탐색 순서이며 실제 서비스 이동 흐름이 아닙니다.</span>
          {nx ? <a href={`#/doc/${nx.id}`} className="px-3 py-2 rounded-lg border border-gray-300">다음 문서 {nx.id} {nx.name} ›</a> : <span />}
        </div>
        <div className="text-xs text-gray-500">{doc.id} · {doc.type}</div>
        <h1 id="a" className="text-2xl font-extrabold mb-3">{doc.name}</h1>
        <dl>
          <Row k="화면 목적" v={doc.purpose} /><Row k="들어오는 곳" v={doc.from.join(' / ')} /><Row k="나가는 곳" v={doc.to.join(' / ')} />
          <Row k="서비스 Route" v={doc.route} /><Row k="문서 원본" v="기획 대화에서 작성한 화면 정의 · 기능명세" /><Row k="Figma 자료 출처" v={`${doc.frame} (Dev Mode 추출 코드 미제공, Figma 링크 ${NA})`} />
        </dl>
      </section>

      <section className={card}>
        <h2 className="text-lg font-extrabold mb-3">화면 설명 · 구성 요소와 동작</h2>
        <p className="text-sm mb-1"><b>표시 정보</b> {doc.info}</p>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div><h3 className="font-bold mb-2">주요 동작</h3><ul className="flex flex-col gap-2">{doc.actions.map(a => <li key={a.t} className="border border-gray-200 rounded-xl p-3 text-sm"><b>{a.t}</b><br />{a.d}</li>)}</ul></div>
          <div><h3 className="font-bold mb-2">상태 · 예외 처리</h3><ul className="flex flex-col gap-2">{doc.states.map(a => <li key={a.t} className="border border-gray-200 rounded-xl p-3 text-sm"><b>{a.t}</b><br /><Muted v={a.d} /></li>)}</ul></div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-lg font-extrabold mb-1">화면과 번호별 구성 요소</h2>
        <p className="text-xs text-gray-500 mb-3">문서용 번호 · 화면 정의서 구성 순서 (원본 번호 아님). 프레임은 설명용이라 눌러도 동작하지 않습니다.</p>
        <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
          <Frame doc={doc} sel={sel} onSel={pick} />
          <ol className="flex flex-col gap-2">
            {doc.comps.map(c => (
              <li key={c.no} id={`comp-${c.no}`}>
                <button onClick={() => setSel(c.no)} aria-pressed={sel === c.no}
                  className={`w-full text-left border rounded-xl p-3 flex gap-3 ${sel === c.no ? 'border-mark bg-violet-50' : 'border-gray-200'}`}>
                  <span className="w-7 h-7 rounded-full bg-mark text-white text-xs font-bold flex items-center justify-center shrink-0">{c.no}</span>
                  <span className="text-sm"><b>{c.name}</b><br />{c.desc}<br /><span className="text-xs text-gray-500">Feature {c.features.length ? c.features.join(', ') : '해당 없음'}</span></span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold">기능명세 ({feats.length}건)</h2>
        {feats.length ? feats.map(f => <FeatureCard key={f.id} f={f} />) : <p className="text-sm text-gray-600">연결된 Feature가 없습니다.</p>}
      </section>
      <p className="text-xs text-gray-500">전체 화면 {SCREENS.length}개 · 기능 {FEATURES.length}개 (자료에서 계산)</p>
    </div>
  )
}

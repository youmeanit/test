import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ScreenId } from './data'
import { CATS, MENUS, RECENT, SLOTS, count, summary, total, won } from './demo'
import type { Ctx } from './demo'

const ROOT = 'flex flex-col bg-white text-gray-900 border border-gray-300 overflow-hidden text-[15px]'
const primary = 'w-full h-[52px] rounded-[10px] bg-gray-900 text-white font-bold disabled:bg-gray-300 disabled:text-gray-500'

function Header({ title, back }: { title: ReactNode; back?: () => void }) {
  return (
    <header data-no="01" className="h-14 shrink-0 flex items-center gap-1 px-2 border-b border-gray-200">
      {back && <button aria-label="뒤로" onClick={back} className="w-11 h-11 flex items-center justify-center text-xl">‹</button>}
      <span className={`text-[17px] font-extrabold ${back ? '' : 'px-2'}`}>{title}</span>
    </header>
  )
}
function Tabs({ cur, ctx }: { cur: 'W1' | 'W4'; ctx: Ctx }) {
  const t = (id: 'W1' | 'W4', label: string) => (
    <button onClick={() => ctx.go(id)} className={`h-full ${cur === id ? 'font-extrabold text-gray-900' : 'text-gray-500'}`}>{cur === id ? '■' : '□'}<br />{label}</button>
  )
  return (
    <nav data-no="05" className="h-16 shrink-0 border-t border-gray-200 grid grid-cols-3 text-center text-xs">
      {t('W1', '홈')}{t('W4', '주문 현황')}
      <button disabled className="h-full text-gray-400">□<br />MY (준비 중)</button>
    </nav>
  )
}
function Seg({ opts, val, on }: { opts: string[]; val: string; on: (v: string) => void }) {
  return (
    <div className="grid border border-gray-400 rounded-lg overflow-hidden text-sm text-center" style={{ gridTemplateColumns: `repeat(${opts.length},1fr)` }}>
      {opts.map(o => <button key={o} onClick={() => on(o)} className={`py-3 ${o === val ? 'bg-gray-900 text-white font-bold' : 'text-gray-600'}`}>{o}</button>)}
    </div>
  )
}
function Stepper({ v, min, max, on, label }: { v: number; min: number; max: number; on: (n: number) => void; label: string }) {
  return (
    <span className="flex items-center gap-1 border border-gray-400 rounded-full px-1">
      <button aria-label={`${label} 줄이기`} disabled={v <= min} onClick={() => on(v - 1)} className="w-9 h-9 font-bold disabled:text-gray-300">−</button>
      <span className="w-5 text-center">{v}</span>
      <button aria-label={`${label} 늘리기`} disabled={v >= max} onClick={() => on(v + 1)} className="w-9 h-9 font-bold disabled:text-gray-300">+</button>
    </span>
  )
}
const Thumb = () => <div className="w-12 h-12 rounded-md bg-gray-200 shrink-0" />

function W1({ ctx }: { ctx: Ctx }) {
  const [cat, setCat] = useState('커피')
  return (
    <div className={ROOT} style={{ width: 390, height: 844 }}>
      <header data-no="01" className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-gray-200">
        <span className="text-[17px] font-extrabold">학생회관 카페 ▾</span>
        <span className="text-xs border border-gray-400 rounded-full px-2.5 py-1">예상 대기 8분</span>
      </header>
      <main className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-5">
        <section data-no="02">
          <div className="flex justify-between items-baseline mb-2"><h2 className="font-extrabold">최근 주문</h2><span className="text-xs text-gray-500">다시 주문하면 바로 결제 단계로</span></div>
          <div className="flex gap-2.5">
            {RECENT.map((r, i) => (
              <div key={i} className="flex-1 border border-gray-400 rounded-[10px] p-2.5 flex flex-col gap-2">
                <div className="h-14 rounded-md bg-gray-200" />
                <div className="text-sm leading-5"><b>{r.name}</b><br /><span className="text-xs text-gray-500">{summary(r)} · {won(r.price)}</span></div>
                <button onClick={() => ctx.reorder(r)} className="h-9 border border-gray-900 rounded-lg text-[13px] font-bold">다시 주문</button>
              </div>
            ))}
          </div>
        </section>
        <section data-no="03" className="flex flex-col gap-2 pb-3">
          <h2 className="font-extrabold">메뉴</h2>
          <div className="flex gap-2 text-[13px]">
            {CATS.map(c => <button key={c} onClick={() => setCat(c)} className={`px-3.5 py-1.5 rounded-full ${c === cat ? 'bg-gray-900 text-white font-bold' : 'border border-gray-400'}`}>{c}</button>)}
          </div>
          {MENUS.filter(m => m.cat === cat).map(m => (
            <div key={m.name} className="border border-gray-400 rounded-[10px] p-2.5 flex items-center gap-3">
              <button onClick={() => ctx.openMenu(m)} className="flex-1 flex items-center gap-3 text-left"><Thumb /><span className="text-sm leading-5"><b>{m.name}</b><br /><span className="text-gray-500">{won(m.price)}</span></span></button>
              <button aria-label={`${m.name} 담기`} onClick={() => ctx.quickAdd(m)} className="w-11 h-11 rounded-full border border-gray-400 text-lg">+</button>
            </div>
          ))}
        </section>
      </main>
      {ctx.cart.length > 0 && (
        <div data-no="04" className="shrink-0 px-4 py-2.5">
          <button onClick={() => ctx.go('W3')} className={`${primary} flex items-center justify-between px-[18px]`}><span>담은 메뉴 {count(ctx.cart)}개</span><span>주문하기 →</span></button>
        </div>
      )}
      <Tabs cur="W1" ctx={ctx} />
    </div>
  )
}

function W2({ ctx }: { ctx: Ctx }) {
  const [temp, setTemp] = useState<'HOT' | 'ICED'>('ICED')
  const [size, setSize] = useState<'Regular' | 'Large'>('Regular')
  const [shots, setShots] = useState(0)
  const [syrup, setSyrup] = useState(false)
  const [qty, setQty] = useState(1)
  const unit = ctx.menu.price + (size === 'Large' ? 500 : 0) + shots * 500 + (syrup ? 300 : 0)
  const item = () => ({ name: ctx.menu.name, temp, size, shots, qty, price: unit })
  return (
    <div className={ROOT} style={{ width: 390, height: 844 }}>
      <Header title="메뉴 상세" back={() => ctx.go('W1')} />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div data-no="02">
          <div className="h-[180px] bg-gray-200 flex items-center justify-center text-sm text-gray-500">메뉴 이미지</div>
          <div className="px-4 pt-4 flex flex-col gap-1"><h1 className="text-[22px] font-extrabold">{ctx.menu.name}</h1><span className="font-bold">{won(ctx.menu.price)}</span><span className="text-[13px] text-gray-500">메뉴 설명 한 줄</span></div>
        </div>
        <div className="px-4 pt-4 flex flex-col gap-4">
          <div data-no="03" className="flex flex-col gap-3">
            <div><div className="text-sm font-bold mb-2">온도 <span className="font-normal text-gray-500">(필수)</span></div><Seg opts={['HOT', 'ICED']} val={temp} on={v => setTemp(v as 'HOT' | 'ICED')} /></div>
            <div><div className="text-sm font-bold mb-2">사이즈 <span className="font-normal text-gray-500">(필수)</span></div><Seg opts={['Regular', 'Large']} val={size} on={v => setSize(v as 'Regular' | 'Large')} /></div>
          </div>
          <div data-no="04" className="border-t border-gray-200 pt-3 flex flex-col gap-2 text-sm">
            <b>추가 옵션 <span className="font-normal text-gray-500">(선택)</span></b>
            <div className="flex items-center justify-between"><span>샷 추가 <span className="text-gray-500">+500원</span></span><Stepper v={shots} min={0} max={3} on={setShots} label="샷" /></div>
            <label className="flex items-center gap-2.5 min-h-[44px]"><input type="checkbox" checked={syrup} onChange={e => setSyrup(e.target.checked)} className="w-[18px] h-[18px]" />시럽 추가 <span className="text-gray-500">+300원</span></label>
          </div>
          <div data-no="05" className="border-t border-gray-200 pt-3 flex items-center justify-between text-sm"><b>수량</b><Stepper v={qty} min={1} max={5} on={setQty} label="수량" /></div>
        </div>
      </main>
      <div data-no="06" className="shrink-0 border-t border-gray-200 px-4 pt-3 pb-5 grid gap-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <button onClick={() => { ctx.add(item()); ctx.go('W1') }} className="h-[52px] rounded-[10px] border border-gray-900 font-bold">담기</button>
        <button onClick={() => { ctx.add(item()); ctx.go('W3') }} className={primary}>바로 주문 · {won(unit * qty)}</button>
      </div>
    </div>
  )
}

function W3({ ctx }: { ctx: Ctx }) {
  const empty = ctx.cart.length === 0
  const needSlot = ctx.mode === 'slot' && !ctx.slot
  const when = ctx.mode === 'now' ? '지금 바로' : ctx.slot
  const label = ctx.paying ? '결제 처리 중…' : empty ? '메뉴를 담아주세요' : needSlot ? '픽업 시간을 선택해주세요' : `${when} 픽업 · ${won(total(ctx.cart))} 결제하기`
  return (
    <div className={ROOT} style={{ width: 390, height: 844 }}>
      <Header title="주문하기" back={() => ctx.go('W1')} />
      <main className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-5">
        <section data-no="02" className="flex flex-col gap-2">
          <h2 className="font-extrabold">주문 메뉴</h2>
          {empty && <div className="border border-dashed border-gray-400 rounded-[10px] p-4 text-sm text-center text-gray-600">담은 메뉴가 없어요.<br /><button onClick={() => ctx.go('W1')} className="mt-2 underline font-bold">홈에서 메뉴 고르기</button></div>}
          {ctx.cart.map((c, i) => (
            <div key={i} className="border border-gray-400 rounded-[10px] p-3 flex items-center gap-3">
              <Thumb /><div className="flex-1 text-sm leading-5"><b>{c.name} × {c.qty}</b><br /><span className="text-xs text-gray-500">{summary(c)}</span></div>
              <span className="text-sm font-bold">{won(c.price * c.qty)}</span>
              <button aria-label={`${c.name} 삭제`} onClick={() => ctx.removeAt(i)} className="w-8 h-8 text-gray-500">✕</button>
            </div>
          ))}
          {!empty && <button onClick={() => ctx.go('W1')} className="self-start min-h-8 text-[13px] text-gray-600 underline">+ 메뉴 추가</button>}
        </section>
        <section data-no="03" className="border-2 border-gray-900 rounded-xl p-3.5 flex flex-col gap-3">
          <div><h2 className="font-extrabold">픽업 시간</h2><span className="text-xs text-gray-500">선택한 시간에 맞춰 제조를 시작해요</span></div>
          <Seg opts={['지금 바로', '시간 지정']} val={ctx.mode === 'now' ? '지금 바로' : '시간 지정'} on={v => ctx.setMode(v === '지금 바로' ? 'now' : 'slot')} />
          {ctx.mode === 'now' && <p className="text-sm text-gray-600">주문 후 약 8분 뒤에 받을 수 있어요.</p>}
          {ctx.mode === 'slot' && (
            <div className="grid grid-cols-3 gap-2 text-[13px] text-center leading-[18px]">
              {SLOTS.map(s => {
                const closed = s.s === '마감', on = ctx.slot === s.t
                return (
                  <button key={s.t} disabled={closed} aria-pressed={on} onClick={() => ctx.setSlot(s.t)}
                    className={`rounded-lg py-2 border ${closed ? 'border-dashed border-gray-300 bg-gray-100 text-gray-500' : on ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-400'}`}>
                    <b className={closed ? 'line-through' : ''}>{s.t}</b><br />{on ? '선택됨' : s.s}
                  </button>
                )
              })}
            </div>
          )}
        </section>
        <section data-no="04" className="flex flex-col gap-2">
          <h2 className="font-extrabold">결제 수단</h2>
          <div className="border border-gray-400 rounded-[10px] px-3 h-[52px] flex items-center justify-between text-sm"><span>등록 카드 ****</span><span className="text-gray-500 underline">변경</span></div>
        </section>
        <div className="flex justify-between font-bold border-t border-gray-200 pt-3 pb-2"><span>총 결제 금액</span><span>{won(total(ctx.cart))}</span></div>
      </main>
      <div data-no="05" className="shrink-0 border-t border-gray-200 px-4 pt-3 pb-5">
        {ctx.payError && <p role="alert" className="text-sm text-red-700 mb-2">{ctx.payError}</p>}
        <button disabled={empty || needSlot || ctx.paying} onClick={ctx.pay} className={primary}>{label}</button>
      </div>
    </div>
  )
}

function W4({ ctx }: { ctx: Ctx }) {
  const o = ctx.order
  const steps = ['주문 접수', '제조 중', '준비 완료']
  return (
    <div className={ROOT} style={{ width: 390, height: 844 }}>
      <Header title="주문 현황" />
      {!o ? (
        <main className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <p className="font-bold">진행 중인 주문이 없어요.</p><p className="text-sm text-gray-600">메뉴를 골라 픽업 시간을 예약해 보세요.</p>
          <button onClick={() => ctx.go('W1')} className="h-11 px-5 rounded-[10px] border border-gray-900 font-bold">홈으로</button>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto px-4 pt-6 flex flex-col gap-5">
          <section data-no="01" className="border-2 border-gray-900 rounded-[14px] py-6 px-4 text-center flex flex-col items-center gap-1">
            <span className="text-[13px] font-bold text-gray-500">픽업 번호</span>
            <span className="text-[56px] leading-[64px] font-extrabold">{o.no}</span>
            <span className="font-bold">{o.time === '지금 바로' ? '지금 바로 픽업' : `${o.time} 픽업 예정`}</span>
            <span className="text-[13px] text-gray-500">학생회관 카페 · 픽업대</span>
          </section>
          <section data-no="02" className="flex flex-col gap-3">
            <h2 className="font-extrabold">주문 상태</h2>
            <ol className="grid grid-cols-3 text-center text-[13px]">
              {steps.map((s, i) => {
                const n = i + 1, done = n < o.step, cur = n === o.step
                return (
                  <li key={s} aria-current={cur ? 'step' : undefined} className={`flex flex-col items-center gap-1.5 ${cur ? 'font-extrabold' : done ? '' : 'text-gray-500'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-gray-900 text-white' : cur ? 'border-2 border-gray-900' : 'border border-gray-400'}`}>{done ? '✓' : n}</span>{s}
                  </li>
                )
              })}
            </ol>
          </section>
          <p data-no="03" className="bg-gray-100 rounded-[10px] p-3 text-[13px] leading-5 text-gray-700">
            {o.step === 3 ? '준비가 끝났어요. 픽업대에서 번호를 확인하고 가져가세요.' : '준비가 끝나면 푸시 알림으로 알려드려요. 알림을 받으면 픽업대에서 번호를 확인하세요.'}
          </p>
          <section data-no="04" className="border-t border-gray-200 pt-4 flex flex-col gap-2 text-sm">
            <h2 className="font-extrabold">주문 내용</h2>
            {o.items.map((c, i) => <div key={i} className="flex justify-between"><span>{c.name} × {c.qty} <span className="text-xs text-gray-500">{summary(c)}</span></span><span>{won(c.price * c.qty)}</span></div>)}
            <div className="flex justify-between font-bold"><span>결제 완료</span><span>{won(o.total)}</span></div>
          </section>
        </main>
      )}
      <Tabs cur="W4" ctx={ctx} />
    </div>
  )
}

export function Screen({ id, ctx }: { id: ScreenId; ctx: Ctx }) {
  return id === 'W1' ? <W1 ctx={ctx} /> : id === 'W2' ? <W2 ctx={ctx} /> : id === 'W3' ? <W3 ctx={ctx} /> : <W4 ctx={ctx} />
}

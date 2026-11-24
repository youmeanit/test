import { useState } from 'react'
import type { ScreenId } from './data'

export interface Menu { name: string; cat: string; price: number }
export interface Item { name: string; temp: 'HOT' | 'ICED'; size: 'Regular' | 'Large'; shots: number; qty: number; price: number }
export interface Order { no: string; time: string; items: Item[]; total: number; step: 1 | 2 | 3 }
export type Mode = 'now' | 'slot'

export const MENUS: Menu[] = [
  { name: '아메리카노', cat: '커피', price: 4000 }, { name: '카페 라떼', cat: '커피', price: 4500 },
  { name: '바닐라 라떼', cat: '커피', price: 5000 }, { name: '콜드브루', cat: '커피', price: 4800 },
  { name: '초콜릿 음료', cat: '논커피', price: 5000 }, { name: '캐모마일', cat: '티', price: 4500 }, { name: '쿠키', cat: '디저트', price: 3000 },
]
export const CATS = ['커피', '논커피', '티', '디저트']
export const SLOTS = [
  { t: '10:20', s: '마감' }, { t: '10:30', s: '혼잡' }, { t: '10:40', s: '여유' },
  { t: '10:50', s: '여유' }, { t: '11:00', s: '여유' }, { t: '11:10', s: '여유' },
]
export const won = (n: number) => n.toLocaleString('ko-KR') + '원'
export const total = (c: Item[]) => c.reduce((a, i) => a + i.price * i.qty, 0)
export const count = (c: Item[]) => c.reduce((a, i) => a + i.qty, 0)
export const summary = (i: Item) => `${i.temp} · ${i.size}${i.shots ? ` · 샷 ${i.shots}` : ''}`

const LATTE: Item = { name: '카페 라떼', temp: 'ICED', size: 'Regular', shots: 1, qty: 1, price: 5000 }
export const RECENT: Item[] = [
  { name: '아이스 아메리카노', temp: 'ICED', size: 'Regular', shots: 1, qty: 1, price: 4500 },
  { name: '카페 라떼', temp: 'ICED', size: 'Large', shots: 0, qty: 1, price: 5000 },
]
const SAMPLE_ORDER: Order = { no: 'A-12', time: '10:40', items: [LATTE], total: 5000, step: 2 }

export interface Ctx {
  screen: ScreenId; go: (s: ScreenId) => void
  menu: Menu; openMenu: (m: Menu) => void
  cart: Item[]; add: (i: Item) => void; removeAt: (n: number) => void; quickAdd: (m: Menu) => void; reorder: (i: Item) => void
  mode: Mode; setMode: (m: Mode) => void; slot: string | null; setSlot: (s: string | null) => void
  order: Order | null; pay: () => void; paying: boolean; payError: string | null
  failNext: boolean; setFailNext: (b: boolean) => void; advance: () => void
}

const noop = () => {}
export const STATIC_CTX: Ctx = {
  screen: 'W1', go: noop, menu: MENUS[1], openMenu: noop, cart: [LATTE], add: noop, removeAt: noop, quickAdd: noop, reorder: noop,
  mode: 'slot', setMode: noop, slot: '10:40', setSlot: noop, order: SAMPLE_ORDER, pay: noop, paying: false, payError: null,
  failNext: false, setFailNext: noop, advance: noop,
}

export function useDemo(initial: ScreenId): Ctx {
  const [screen, go] = useState<ScreenId>(initial)
  const [menu, setMenu] = useState<Menu>(MENUS[1])
  const [cart, setCart] = useState<Item[]>(initial === 'W3' ? [LATTE] : [])
  const [mode, setMode] = useState<Mode>('now')
  const [slot, setSlot] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(initial === 'W4' ? SAMPLE_ORDER : null)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [failNext, setFailNext] = useState(false)

  const add = (i: Item) => setCart(c => [...c, i])
  return {
    screen, go, menu, openMenu: m => { setMenu(m); go('W2') },
    cart, add, removeAt: n => setCart(c => c.filter((_, k) => k !== n)),
    quickAdd: m => add({ name: m.name, temp: 'ICED', size: 'Regular', shots: 0, qty: 1, price: m.price }),
    reorder: i => { setCart([i]); setMode('now'); setSlot(null); setPayError(null); go('W3') },
    mode, setMode: m => { setMode(m); if (m === 'now') setSlot(null) }, slot, setSlot,
    order, paying, payError, failNext, setFailNext,
    pay: () => {
      if (paying) return
      setPaying(true); setPayError(null)
      setTimeout(() => {
        if (failNext) { setFailNext(false); setPayError('결제에 실패했어요. 다시 시도해 주세요.'); setPaying(false); return }
        setOrder({ no: 'A-' + (10 + Math.floor(Math.random() * 80)), time: mode === 'now' ? '지금 바로' : slot ?? '', items: cart, total: total(cart), step: 1 })
        setCart([]); setPaying(false); go('W4')
      }, 700)
    },
    advance: () => setOrder(o => (o && o.step < 3 ? { ...o, step: (o.step + 1) as 2 | 3 } : o)),
  }
}

import { byId } from '../data'
import type { ScreenId } from '../data'
import { Screen } from '../screens'
import { useDemo } from '../demo'

export function Demo({ id }: { id: string }) {
  const ctx = useDemo(byId(id).id as ScreenId)
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      <div className="mx-auto lg:mx-0 shadow-lg"><Screen id={ctx.screen} ctx={ctx} /></div>
      <aside className="no-print doc-card bg-white border border-gray-200 rounded-2xl p-5 w-full lg:max-w-sm flex flex-col gap-3 text-sm">
        <h1 className="font-extrabold text-lg">시연 안내</h1>
        <p className="text-gray-700">모든 데이터는 Mock입니다. 결제는 실제로 처리되지 않고, 주문·알림은 서버로 전송되지 않습니다.</p>
        <p className="text-gray-700">새로고침하면 상태가 초기화됩니다. (유지 여부는 기획 확인 필요)</p>
        <label className="flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={ctx.failNext} onChange={e => ctx.setFailNext(e.target.checked)} className="w-[18px] h-[18px]" />다음 결제를 실패로 처리</label>
        <button onClick={ctx.advance} disabled={!ctx.order || ctx.order.step === 3} className="h-11 rounded-lg border border-gray-300 font-bold disabled:text-gray-400">주문 상태 다음 단계로 (데모)</button>
      </aside>
    </div>
  )
}

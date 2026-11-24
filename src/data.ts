export type ScreenId = 'W1' | 'W2' | 'W3' | 'W4'
export const NA = '원문 미기재'
export const TBD = '확인 필요'
export const SRC = '와이어프레임 W1~W4 (기획 대화에서 작성) · Figma 추출 코드 미제공'

export interface Comp { no: string; name: string; desc: string; features: string[] }
export interface ScreenDoc {
  id: ScreenId; name: string; type: string; route: string; purpose: string
  from: string[]; to: string[]; frame: string
  info: string; actions: { t: string; d: string }[]; states: { t: string; d: string }[]
  comps: Comp[]
}
export interface Feature {
  id: string; name: string; purpose: string; type: string; priority: string; screens: ScreenId[]
  actor: string; trigger: string; pre: string; input: string; steps: string[]; data: string
  result: string; permission: string; dup: string; boundary: string; storage: string; qa: string[]
  planned: string; impl: string
}

export const SERVICE = { name: '교내 카페 서비스', sub: '화면설계서와 기능명세서', version: 'ver1.0', project: '교내 카페 미리 주문 · 픽업 예약' }

export const SCREENS: ScreenDoc[] = [
  {
    id: 'W1', name: '홈', type: '화면', route: '/home (#/demo/W1)', frame: '와이어프레임 W1',
    purpose: '앱을 열자마자 예상 대기 시간을 확인하고, 재주문 또는 메뉴 선택으로 바로 주문을 시작한다.',
    from: ['앱 실행', 'W4 주문 현황 (탭)', 'W3 + 메뉴 추가'], to: ['W2 메뉴 상세', 'W3 주문하기 (다시 주문 / 담은 메뉴 바)', 'W4 주문 현황 (탭)'],
    info: '매장명, 예상 대기 시간, 최근 주문 2건, 카테고리 탭, 메뉴 목록(이름·가격), 담은 메뉴 수.',
    actions: [
      { t: '다시 주문', d: '최근 주문 메뉴를 장바구니에 담고 W3로 이동한다 (메뉴 탐색 생략).' },
      { t: '메뉴 카드 선택', d: 'W2 메뉴 상세로 이동한다.' },
      { t: '+ 버튼', d: '기본 옵션(Regular)으로 즉시 담는다. 담은 메뉴 바가 나타난다.' },
      { t: '담은 메뉴 바', d: 'W3 주문하기로 이동한다.' },
    ],
    states: [
      { t: '기본', d: '최근 주문과 메뉴 목록을 표시한다.' },
      { t: '비활성', d: 'MY 탭은 이번 MVP 범위 밖이라 "준비 중"으로 비활성이다.' },
      { t: '빈 상태', d: '담은 메뉴가 없으면 담은 메뉴 바를 숨긴다. 최근 주문 없을 때의 표시는 ' + TBD },
      { t: '로딩·오류', d: '대기 시간 조회 실패 등 ' + NA },
    ],
    comps: [
      { no: '01', name: '앱 헤더', desc: '매장명과 실시간 예상 대기 시간을 보여준다.', features: ['F-03'] },
      { no: '02', name: '최근 주문', desc: '최근 주문 카드와 [다시 주문] 버튼. 누르면 바로 W3로 이동한다.', features: ['F-02'] },
      { no: '03', name: '카테고리 탭 · 메뉴 목록', desc: '카테고리별 메뉴 카드. 카드는 W2, + 버튼은 바로 담기.', features: ['F-03'] },
      { no: '04', name: '담은 메뉴 바', desc: '담은 개수를 보여주고 W3로 이동한다.', features: ['F-01'] },
      { no: '05', name: '하단 탭바', desc: '홈 / 주문 현황 / MY 3개 탭.', features: [] },
    ],
  },
  {
    id: 'W2', name: '메뉴 상세', type: '화면', route: '/menu/:id (#/demo/W2)', frame: '와이어프레임 W2',
    purpose: '필수 옵션(온도·사이즈)만 빠르게 고르고 담거나 바로 주문한다.',
    from: ['W1 메뉴 카드'], to: ['W1 (담기 / 뒤로)', 'W3 (바로 주문)'],
    info: '메뉴 이미지, 이름, 가격, 설명, 온도, 사이즈, 샷·시럽, 수량, 합계 금액.',
    actions: [
      { t: '옵션 선택', d: '온도·사이즈는 하나만 선택한다. 선택에 따라 금액이 바뀐다.' },
      { t: '담기', d: '장바구니에 담고 W1로 돌아간다.' },
      { t: '바로 주문', d: '장바구니에 담고 W3로 이동한다.' },
    ],
    states: [
      { t: '기본', d: 'ICED / Regular / 샷 0 / 수량 1 이 기본 선택이다.' },
      { t: '경계값', d: '샷 0~3, 수량 1~5로 제한하고 범위 밖 버튼은 비활성이다. (상한값은 ' + TBD + ')' },
      { t: '오류', d: NA },
    ],
    comps: [
      { no: '01', name: '앱 헤더', desc: '뒤로가기와 화면 제목.', features: [] },
      { no: '02', name: '메뉴 정보', desc: '이미지, 메뉴명, 기본 가격, 설명.', features: ['F-03'] },
      { no: '03', name: '필수 옵션', desc: '온도(HOT/ICED), 사이즈(Regular/Large) 세그먼트.', features: ['F-03'] },
      { no: '04', name: '추가 옵션', desc: '샷 추가(스테퍼), 시럽 추가(체크).', features: ['F-03'] },
      { no: '05', name: '수량', desc: '수량 스테퍼.', features: ['F-03'] },
      { no: '06', name: '하단 버튼', desc: '[담기] / [바로 주문 · 금액].', features: ['F-03', 'F-01'] },
    ],
  },
  {
    id: 'W3', name: '주문하기', type: '화면 (핵심)', route: '/order (#/demo/W3)', frame: '와이어프레임 W3',
    purpose: '픽업 시간을 정하고 결제까지 한 화면에서 끝낸다. 장바구니 화면은 이 화면에 통합했다.',
    from: ['W1 다시 주문 / 담은 메뉴 바', 'W2 바로 주문'], to: ['W4 주문 현황 (결제 성공)', 'W1 (+ 메뉴 추가)'],
    info: '주문 메뉴·옵션·금액, 픽업 방식, 시간 슬롯 상태, 결제 수단, 총 결제 금액.',
    actions: [
      { t: '픽업 방식 전환', d: '"지금 바로"(기본) 또는 "시간 지정". 시간 지정 시 슬롯 목록이 보인다.' },
      { t: '슬롯 선택', d: '여유·혼잡 슬롯만 선택할 수 있고, 선택하면 결제 버튼 문구에 시간이 반영된다.' },
      { t: '결제하기', d: '결제(Mock) 후 W4로 이동한다. 중복 클릭은 막는다.' },
      { t: '메뉴 삭제 · 추가', d: '메뉴를 지우거나 W1로 가서 더 담는다.' },
    ],
    states: [
      { t: '비활성', d: '장바구니가 비었거나, 시간 지정인데 슬롯을 고르지 않았으면 결제 버튼이 비활성이다.' },
      { t: '마감 슬롯', d: '마감 슬롯은 선택할 수 없다.' },
      { t: '로딩', d: '결제 처리 중에는 버튼이 "결제 처리 중…"으로 바뀌고 비활성이다.' },
      { t: '오류', d: '결제 실패 시 안내 문구를 보여주고 같은 화면에서 재시도할 수 있다.' },
      { t: '빈 상태', d: '장바구니가 비었으면 홈으로 돌아가는 안내를 보여준다.' },
    ],
    comps: [
      { no: '01', name: '앱 헤더', desc: '뒤로가기와 화면 제목.', features: [] },
      { no: '02', name: '주문 메뉴', desc: '담은 메뉴·옵션·금액, 삭제, + 메뉴 추가.', features: ['F-01'] },
      { no: '03', name: '픽업 시간', desc: '지금 바로 / 시간 지정, 10분 단위 슬롯(여유·혼잡·마감).', features: ['F-01'] },
      { no: '04', name: '결제 수단', desc: '등록 카드 표시와 변경.', features: ['F-04'] },
      { no: '05', name: '결제 버튼', desc: '픽업 시간과 금액을 함께 보여주는 하단 고정 버튼.', features: ['F-04', 'F-01'] },
    ],
  },
  {
    id: 'W4', name: '주문 현황', type: '화면', route: '/status (#/demo/W4)', frame: '와이어프레임 W4',
    purpose: '언제 가지러 가면 되는지 한눈에 알려준다. 결제 완료 화면 없이 바로 진입한다.',
    from: ['W3 결제 성공', 'W1 탭'], to: ['W1 (탭)'],
    info: '픽업 번호, 픽업 예정 시간·장소, 주문 상태 3단계, 주문 내용, 결제 금액.',
    actions: [{ t: '탭 이동', d: '홈 탭으로 돌아갈 수 있다.' }, { t: '상태 확인', d: '접수 → 제조 중 → 준비 완료. 준비 완료 시 푸시 알림(데모에서는 미발송).' }],
    states: [
      { t: '기본', d: '진행 중인 주문의 번호와 상태를 보여준다.' },
      { t: '빈 상태', d: '진행 중인 주문이 없으면 안내와 [홈으로] 버튼을 보여준다.' },
      { t: '완료', d: '준비 완료 단계에서는 "픽업대에서 번호를 확인하세요"로 문구가 바뀐다.' },
      { t: '주문 취소', d: TBD },
    ],
    comps: [
      { no: '01', name: '픽업 번호', desc: '가장 크게 표시하고 픽업 예정 시간·장소를 함께 보여준다.', features: ['F-05'] },
      { no: '02', name: '주문 상태', desc: '접수 · 제조 중 · 준비 완료 스테퍼.', features: ['F-05'] },
      { no: '03', name: '알림 안내', desc: '준비 완료 시 푸시 알림이 온다는 안내.', features: ['F-05'] },
      { no: '04', name: '주문 내용', desc: '주문 메뉴와 결제 금액.', features: ['F-05'] },
      { no: '05', name: '하단 탭바', desc: '홈 / 주문 현황 / MY.', features: [] },
    ],
  },
]

export const FEATURES: Feature[] = [
  {
    id: 'F-01', name: '픽업 시간 예약 주문', purpose: '수업 시간에 맞춰 픽업 시간을 정해 현장 대기를 없앤다.', type: '핵심 기능', priority: 'Must ★', screens: ['W3'],
    actor: '학생(사용자)', trigger: 'W3 진입 후 픽업 시간 영역에서 방식·슬롯 선택', pre: '장바구니에 메뉴가 1개 이상 있다.',
    input: '픽업 방식(지금 바로 / 시간 지정), 시간 슬롯(10분 단위)',
    steps: ['기본값은 "지금 바로"로 예상 소요 시간을 보여준다.', '"시간 지정"을 고르면 슬롯 목록과 상태(여유·혼잡·마감)를 보여준다.', '마감 슬롯은 선택할 수 없다.', '선택한 시간이 결제 버튼 문구에 반영된다.'],
    data: '주문의 pickupTime(지금 바로 또는 슬롯 시각)', result: '성공: 결제 버튼 활성 / 실패·취소: 슬롯 미선택 시 버튼 비활성', permission: NA,
    dup: '슬롯은 한 번에 하나만 선택한다.', boundary: '10분 단위. 영업 시간, 슬롯당 최대 주문 수: ' + TBD, storage: '새로고침 후 유지 여부: ' + TBD,
    qa: ['시간 지정에서 슬롯 미선택이면 결제 버튼이 비활성이다.', '마감 슬롯을 눌러도 선택되지 않는다.', '선택 시간이 버튼 문구에 표시된다.'],
    planned: '슬롯 상태를 실시간 혼잡도에 따라 계산하고 제조 시작 시각을 매장에 전달한다.', impl: '데모 구현: 고정 Mock 슬롯(10:20 마감, 10:30 혼잡, 나머지 여유). 매장 전달은 미구현.',
  },
  {
    id: 'F-02', name: '빠른 재주문', purpose: '같은 메뉴를 고르는 시간을 줄인다.', type: '핵심 기능', priority: 'Must', screens: ['W1'],
    actor: '학생(사용자)', trigger: 'W1 최근 주문 카드의 [다시 주문] 선택', pre: '최근 주문 이력이 있다.', input: NA,
    steps: ['선택한 최근 주문의 메뉴·옵션을 장바구니에 넣는다.', '픽업 방식을 "지금 바로"로 초기화한다.', 'W3로 이동한다.'],
    data: '장바구니 교체', result: '성공: W3 진입 / 실패: ' + NA, permission: NA, dup: '장바구니를 덮어쓴다. 기존 장바구니가 있을 때의 정책: ' + TBD,
    boundary: '최근 주문 표시 개수: 2건(예시), 기준은 ' + TBD, storage: '주문 이력 저장 방식: ' + TBD,
    qa: ['다시 주문을 누르면 W3에 해당 메뉴가 담겨 있다.', '홈 → 주문하기 → 결제 3단계로 끝난다.'],
    planned: '로그인 사용자의 실제 주문 이력을 불러온다.', impl: '데모 구현: Mock 최근 주문 2건.',
  },
  {
    id: 'F-03', name: '메뉴 조회 · 옵션 선택', purpose: '주문에 필요한 메뉴와 옵션을 최소 단계로 고른다.', type: '기본 기능', priority: 'Must', screens: ['W1', 'W2'],
    actor: '학생(사용자)', trigger: 'W1 메뉴 카드 / + 버튼, W2 옵션 조작', pre: NA, input: '카테고리, 온도, 사이즈, 샷(0~3), 시럽, 수량(1~5)',
    steps: ['카테고리 탭으로 목록을 바꾼다.', '카드를 누르면 W2에서 옵션을 고른다.', '[담기]는 장바구니에 담고 W1로, [바로 주문]은 W3로 이동한다.'],
    data: '장바구니 항목 추가', result: '성공: 담김 / 실패: ' + NA, permission: NA, dup: '같은 메뉴·옵션의 합치기 정책: ' + TBD,
    boundary: '샷 0~3, 수량 1~5 (상한은 ' + TBD + ')', storage: '새로고침 후 유지 여부: ' + TBD,
    qa: ['옵션 변경 시 금액이 즉시 바뀐다.', '샷·수량이 범위를 넘지 않는다.'],
    planned: '품절 메뉴 표시, 알레르기 정보 등은 ' + NA, impl: '데모 구현: Mock 메뉴 7종과 고정 가격.',
  },
  {
    id: 'F-04', name: '간편 결제', purpose: '결제 단계를 한 번의 버튼으로 줄인다.', type: '기본 기능', priority: 'Must', screens: ['W3'],
    actor: '학생(사용자)', trigger: 'W3 결제 버튼 선택', pre: '장바구니가 비어 있지 않고, 시간 지정이면 슬롯이 선택되어 있다.', input: '등록된 결제 수단',
    steps: ['결제 버튼을 비활성화하고 "결제 처리 중…"을 표시한다.', '결제를 요청한다.', '성공하면 주문을 만들고 W4로 이동한다.', '실패하면 안내 문구를 보이고 재시도할 수 있게 버튼을 다시 활성화한다.'],
    data: '주문 생성, 장바구니 비움', result: '성공: W4 이동 / 실패: 오류 문구 후 재시도 / 취소: 뒤로가기로 W1·W2 복귀', permission: '로그인 필요 여부: ' + TBD,
    dup: '처리 중에는 버튼이 비활성이라 중복 결제를 막는다.', boundary: '결제 한도: ' + NA, storage: '결제 수단 저장·보안 정책: ' + TBD,
    qa: ['결제 중 버튼을 연속으로 눌러도 주문이 1건만 생긴다.', '실패 후 같은 화면에서 다시 결제할 수 있다.'],
    planned: '실제 PG 연동으로 결제를 처리한다.', impl: '데모 구현: 실제 결제 없음. 0.7초 후 성공하며, 데모 패널에서 다음 결제를 실패로 설정할 수 있다.',
  },
  {
    id: 'F-05', name: '주문 현황 · 준비 완료 알림', purpose: '픽업 타이밍을 알려 일찍 와서 기다리는 일을 없앤다.', type: '핵심 기능', priority: 'Must', screens: ['W4'],
    actor: '학생(사용자), 매장 직원(상태 변경)', trigger: '결제 성공 후 자동 진입 / 상태 변경', pre: '주문이 생성되어 있다.', input: NA,
    steps: ['주문 번호와 픽업 시간을 보여준다.', '접수 → 제조 중 → 준비 완료 순으로 상태를 갱신한다.', '준비 완료가 되면 푸시 알림을 보낸다.'],
    data: '주문 상태(1~3)', result: '성공: 상태 표시 / 실패(알림 미수신): ' + NA, permission: '직원 상태 변경 권한: ' + NA,
    dup: NA, boundary: '동시에 진행 중인 주문 수: ' + TBD, storage: '새로고침 후 주문 유지: ' + TBD,
    qa: ['결제 직후 별도 완료 화면 없이 W4가 열린다.', '상태 단계가 순서대로만 진행된다.'],
    planned: '서버와 푸시 알림으로 실시간 갱신한다.', impl: '데모 구현: 상태는 데모 패널의 [다음 단계] 버튼으로만 바뀐다. 푸시 알림은 미구현.',
  },
]

export const FLOW = [
  '앱 실행 → W1 홈 (예상 대기 시간 확인)',
  'W1: 최근 메뉴를 다시 주문하면 W3로 바로, 아니면 W2에서 옵션 선택 후 W3',
  'W3: 픽업 시간 선택 → 선택 시간이 마감이면 다른 시간 선택',
  'W3: 간편 결제 → 실패하면 재시도, 성공하면 W4',
  'W4: 픽업 번호 확인 → 준비 완료 알림 → 픽업',
]

export const next = (id: ScreenId): ScreenDoc | undefined => SCREENS[SCREENS.findIndex(s => s.id === id) + 1]
export const prev = (id: ScreenId): ScreenDoc | undefined => SCREENS[SCREENS.findIndex(s => s.id === id) - 1]
export const byId = (id: string): ScreenDoc => SCREENS.find(s => s.id === id) ?? SCREENS[0]

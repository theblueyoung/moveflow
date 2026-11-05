const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-5 5h2"/>',
  grid: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  box: '<path d="m3 7 9-4 9 4-9 5zM3 7v10l9 4 9-4V7M12 12v9"/>',
  scale: '<path d="M12 3v18m-7-3h14M5 6h14M7 6l-4 8h8L7 6zm10 0-4 8h8l-4-8z"/>',
  truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="18" cy="18.5" r="1.5"/>',
  pen: '<path d="m4 16-.8 4.8L8 20 19.5 8.5a2.8 2.8 0 0 0-4-4zM13.5 6.5l4 4"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2"/>'
};
const svg = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
const phases = [
  { id: 'sale', label: '매도' },
  { id: 'interim', label: '중도금' },
  { id: 'balance', label: '잔금' },
  { id: 'move', label: '이사' }
];
const navItems = [
  ['home', '홈', 'home'], ['schedule', '일정', 'calendar'],
  ['funds', '자금', 'wallet'], ['services', '서비스', 'grid'], ['my', '함께', 'people']
];
let tasks = [
  { phase: 'sale', date: '2026-11-06', name: '매매 계약서 특약 확인', owner: '유영님', done: false },
  { phase: 'sale', date: '2026-11-07', name: '등기부등본 최신본 발급', owner: '민수님', done: false },
  { phase: 'sale', date: '2026-11-09', name: '대출 서류 은행 제출', owner: '유영님', done: true },
  { phase: 'interim', date: '2026-11-17', name: '중도금 계좌 한도 확인', owner: '민수님', done: false },
  { phase: 'interim', date: '2026-11-20', name: '이사업체 방문 견적 받기', owner: '함께', done: false },
  { phase: 'balance', date: '2026-12-01', name: '잔금일 계좌 잔액 확인', owner: '유영님', done: false },
  { phase: 'move', date: '2026-12-05', name: '전입신고 준비물 확인', owner: '민수님', done: false },
  { phase: 'move', date: '2026-12-07', name: '입주청소 시간 확인', owner: '함께', done: false }
];
let balances = [
  { name: '계약금', amount: '1억 5,000만 원', status: '납부 완료' },
  { name: '중도금', amount: '2억 원', status: '11월 17일 예정' },
  { name: '잔금', amount: '3억 5,000만 원', status: '12월 7일 예정' }
];
const moveDate = '2026-12-07';
let active = 'home';
let filter = '전체';
let serviceType = '';
const nav = document.getElementById('bottom-nav');
const content = document.getElementById('content');
const toastEl = document.querySelector('.toast');
document.getElementById('brand-mark').innerHTML = svg('home', 21);
document.getElementById('share-icon').innerHTML = svg('people', 18);

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 1800);
}
function phaseName(id) { return phases.find(p => p.id === id)?.label || id; }
function completion() {
  return tasks.length ? Math.round(tasks.filter(task => task.done).length / tasks.length * 100) : 0;
}
function header(title, subtitle, action = '') {
  return `<div class="page-head"><div><h1 class="page-title">${title}</h1><p class="page-sub">${subtitle}</p></div>${action}</div>`;
}
function sectionTitle(title, action = '') {
  return `<div class="section-title"><span>${title}</span>${action}</div>`;
}
function taskRows(list) {
  return list.map(task => {
    const index = tasks.indexOf(task);
    return `<label class="checkline ${task.done ? 'done' : ''}"><input type="checkbox" data-task="${index}" ${task.done ? 'checked' : ''}><span>${task.name}</span><small>${task.owner}</small></label>`;
  }).join('');
}
function home() {
  const pct = completion();
  const days = Math.max(0, Math.ceil((new Date(`${moveDate}T00:00:00`) - new Date()) / 86400000));
  const stageIndex = Math.max(0, phases.findIndex(phase => tasks.some(task => task.phase === phase.id && !task.done)));
  const roadmap = phases.map((phase, i) => {
    const list = tasks.filter(task => task.phase === phase.id);
    const done = list.length > 0 && list.every(task => task.done);
    return `<div class="step ${done ? 'done' : i === stageIndex ? 'current' : ''}"><div class="step-dot">${done ? svg('check', 17) : i + 1}</div><strong>${phase.label}</strong><small>${i === 3 ? '12/07' : `${list.filter(task => task.done).length}/${list.length} 완료`}</small></div>`;
  }).join('');
  const nextTasks = tasks.filter(task => !task.done).slice(0, 3);
  const milestones = [
    { title: '매도 계약 마무리', detail: '계약서와 대출 서류를 확인해요', amount: '1억 5,000만 원', phase: 'sale' },
    { title: '중도금 준비', detail: '중도금 일정과 계좌를 확인해요', amount: '2억 원', phase: 'interim' },
    { title: '잔금과 이사', detail: '새집 잔금일과 이사 준비를 챙겨요', amount: '12월 7일', phase: 'balance' }
  ];
  return `<section class="hero"><div class="hero-head"><span class="dday">이사까지 D-${days}</span><div class="percent"><small>전체 준비</small><strong>${pct}%</strong></div></div><h1>새집으로 가는 여정</h1><p class="address">서울 마포구 → 서울 성동구</p><div class="roadmap">${roadmap}</div></section>
    <div class="share-note"><span>${svg('people', 16)} 유영님과 민수님이 함께 준비 중</span><span>함께 관리</span></div>
    <section class="section"><div class="card task-card">${sectionTitle('오늘 꼭 해야 할 일', `<button class="text-btn" data-go="schedule">전체 보기 →</button>`)}${taskRows(nextTasks)}</div></section>
    <section class="section">${sectionTitle(`<span class="home-calendar">${svg('calendar', 18)} 단계별 주요 일정</span>`, `<button class="text-btn" data-go="schedule">전체 일정</button>`)}<div class="timeline">${milestones.map(item => {
      const list = tasks.filter(task => task.phase === item.phase);
      const done = list.length > 0 && list.every(task => task.done);
      return `<article class="card milestone ${done ? 'done' : ''}"><div class="mile-top"><span class="tag">${done ? '✓ ' : ''}${item.title}</span><span class="cost">${item.amount}</span></div><h3>${item.detail}</h3><p>${list.slice(0, 2).map(task => task.name).join(' · ') || '할 일을 추가해 보세요.'}</p></article>`;
    }).join('')}</div></section>`;
}
function schedule() {
  const visiblePhases = filter === '전체' ? phases : phases.filter(phase => phase.label === filter);
  return `${header('우리 집 이사 일정', '매도부터 입주까지, 중요한 날짜를 한곳에서 확인해요.', `<button class="add-btn" data-add-task aria-label="일정 추가">${svg('plus', 22)}</button>`)}
    <div class="month-bar"><strong>2026년 11–12월</strong><span>이사일 12월 7일 · D-${Math.max(0, Math.ceil((new Date(`${moveDate}T00:00:00`) - new Date()) / 86400000))}</span></div>
    <div class="filters">${['전체', ...phases.map(phase => phase.label)].map(label => `<button class="filter ${filter === label ? 'active' : ''}" data-filter="${label}">${label}</button>`).join('')}</div>
    ${visiblePhases.map(phase => {
      const list = tasks.filter(task => task.phase === phase.id);
      if (!list.length) return '';
      return `<section class="card phase-card"><div class="phase-head"><span>${phase.label} 단계</span><span class="count">${list.filter(task => task.done).length}/${list.length} 완료</span></div>${list.map(task => taskRows([task])).join('')}</section>`;
    }).join('')}`;
}
function funds() {
  return `${header('자금 계획', '계약금·중도금·잔금 일정을 한눈에 살펴봐요.')}
    <section class="fund-hero"><small>준비할 자금</small><div class="fund-total"><strong>7억 원</strong><span>예상 필요 금액</span></div><div class="fund-track"><i style="width:42%"></i></div><div class="fund-foot"><span>확인한 자금 <b>3억 원</b></span><b>42%</b></div></section>
    <section class="card payment-card">${sectionTitle('납부 일정')}${balances.map((item, i) => `<div class="payment-row"><span class="bank-dot">${i + 1}</span><span><strong>${item.name}</strong><small>${item.status}</small></span><b>${item.amount}</b></div>`).join('')}</section>
    <section class="card bank-card">${sectionTitle('자금 메모')}<p class="page-sub">금액은 예시예요. 실제 계약 내용에 맞게 확인해 주세요.</p><button class="add-wide" data-funds-help>자금 확인 항목 보기</button></section>`;
}
const services = [
  ['법무사', 'scale', '등기·계약 상담'], ['이사업체', 'truck', '방문 견적 비교'],
  ['인테리어', 'pen', '업체와 비용 비교'], ['입주청소', 'spark', '청소 견적 비교'],
  ['가구·가전 처분', 'box', '중고 판매·나눔'], ['폐기물 처리', 'trash', '대형 폐기물 안내']
];
function serviceView() {
  if (!serviceType) return `${header('이사 서비스', '필요한 도움을 골라 비교해 보세요.')}<div class="service-grid">${services.map(([name, icon, description]) => `<button class="service-tile" data-service="${name}"><span class="tile-icon">${svg(icon, 20)}</span><strong>${name}</strong><small>${description}</small></button>`).join('')}</div><section class="card task-card"><strong>필요한 서비스를 한곳에서</strong><p class="page-sub">업체 연결과 견적 요청을 돕는 예시 화면입니다.</p></section>`;
  const chosen = services.find(item => item[0] === serviceType);
  return `<button class="text-btn service-back" data-service="">← 서비스 목록</button>${header(`${serviceType} 알아보기`, '조건을 정리해 문의할 내용을 준비해요.')}<section class="card task-card"><div class="expert-card"><span class="expert-icon">${svg(chosen?.[1] || 'spark', 20)}</span><div class="expert-info"><strong>${serviceType} 견적 요청</strong><small>${chosen?.[2] || '필요한 조건을 입력해 주세요.'}</small></div></div><label class="field"><span>지역</span><input placeholder="예: 서울 성동구"></label><label class="field"><span>희망 날짜</span><input type="date" value="2026-12-07"></label><button class="add-wide" data-service-request>견적 요청 준비하기</button></section>`;
}
function my() {
  return `${header('함께 준비하기', '가족과 역할을 나누고 이사 정보를 관리해요.')}
    <section class="card my-card"><div class="my-person"><span class="my-avatar profile-me-badge">유</span><span class="my-profile-copy"><strong>유영님</strong><small>MOVE FLOW 이사 준비 중</small></span><button class="request-btn" data-invite>초대하기</button></div></section>
    <section class="card my-card">${sectionTitle('함께 준비하는 사람')}<div class="member-row"><span class="person-dot me">유</span><span class="member-copy"><strong>유영님</strong><small>이사 일정과 서류</small></span><b class="status">나</b></div><div class="member-row"><span class="person-dot partner">민</span><span class="member-copy"><strong>민수님</strong><small>견적과 입주 준비</small></span><b class="status">함께</b></div></section>
    <section class="card setting-card">${sectionTitle('내 이사 정보')}<div class="setting-line"><span>이사 날짜</span><strong>2026년 12월 7일</strong></div><div class="setting-line"><span>이사 유형</span><strong>집 매도 + 새집 매수</strong></div></section>`;
}
function render() {
  nav.innerHTML = navItems.map(([id, label, icon]) => `<button class="nav-btn ${active === id ? 'active' : ''}" data-go="${id}">${svg(icon, 22)}<span>${label}</span></button>`).join('');
  content.innerHTML = ({ home, schedule, funds, services: serviceView, my })[active]();
}
function openTaskForm() {
  content.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" data-close><form class="modal" data-task-form><h2>일정 추가</h2><label class="field"><span>할 일</span><input name="name" placeholder="예: 이사 견적 비교하기" required></label><label class="field"><span>단계</span><select name="phase">${phases.map(phase => `<option value="${phase.id}">${phase.label}</option>`).join('')}</select></label><label class="field"><span>날짜</span><input name="date" type="date" value="2026-11-20"></label><div class="modal-actions"><button type="button" class="cancel" data-close>취소</button><button type="submit" class="save">추가</button></div></form></div>`);
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go) { active = button.dataset.go; serviceType = ''; render(); }
  if (button.dataset.filter) { filter = button.dataset.filter; render(); }
  if (button.hasAttribute('data-add-task')) openTaskForm();
  if (button.hasAttribute('data-service')) { serviceType = button.dataset.service; active = 'services'; render(); }
  if (button.hasAttribute('data-service-request')) showToast('견적 요청 내용을 준비했어요. 실제 업체 연결은 아직 제공되지 않아요.');
  if (button.hasAttribute('data-funds-help')) showToast('은행과 계약서에서 납부일·계좌 한도를 확인해 주세요.');
  if (button.hasAttribute('data-invite')) showToast('가족 초대 기능은 프로토타입 예시예요.');
  if (button.hasAttribute('data-close') || event.target.classList.contains('modal-backdrop')) content.querySelector('.modal-backdrop')?.remove();
});
document.addEventListener('change', event => {
  if (!event.target.matches('[data-task]')) return;
  const task = tasks[Number(event.target.dataset.task)];
  if (task) task.done = event.target.checked;
  render();
});
document.addEventListener('submit', event => {
  if (!event.target.matches('[data-task-form]')) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  tasks.push({ ...data, owner: '함께', done: false });
  render();
  showToast('일정을 추가했어요.');
});
document.querySelector('.topbar [data-action]')?.addEventListener('click', () => showToast('가족과 함께 준비하는 이사예요.'));
render();

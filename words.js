import { terms, termSets, comparisons, branches, branchQuestion, checkBranches, checkAnswer } from './words-model.mjs?v=20261025-role-feedback';

const app = document.querySelector('#app');
const announcement = document.querySelector('#announcement');
const roleDialog = document.querySelector('#role-dialog');
const items = [...terms, ...comparisons];
const progress = new Map();
let started = false;
let unit = 0;
let finish = false;
let feedbackView = false;
let branchHintView = false;
let returnFocusSelector;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initial = () => ({ opened: false, branch: [], branchSolved: false, answers: [], selected: '', hint: false, feedback: null });
const followups = item => item.connections ? item.questions : item.questions.slice(1);
const stateFor = item => {
  if (!progress.has(item.id)) progress.set(item.id, initial());
  return progress.get(item.id);
};
const isComplete = item => {
  const state = progress.get(item.id);
  return Boolean(state && (item.questions ? state.branchSolved && state.answers.length === followups(item).length : state.answers.length === 1));
};

function landing() {
  const arrow = '<img src="./assets/words/arrow-long-right.svg" alt="" aria-hidden="true">';
  return `<header class="site-header landing-header"><a class="brand" href="./index.html">말뜻 카드<span class="brand-dot" aria-hidden="true">.</span></a></header>
    <main class="landing" aria-labelledby="landing-title"><div class="landing-intro"><h1 id="landing-title"><span>이름을 펼치면,</span> <span>역할이 보인다.</span></h1><p>뜻으로 읽고, 기관과 역할에 연결해요.</p></div>
    <section class="card-stack landing-stage" aria-label="국무위원 뜻 나누기 미리보기"><div class="landing-card"><dl class="landing-terms"><div class="landing-term"><dt>국무</dt><dd>나라의 일</dd></div><div class="landing-cut" aria-hidden="true"><img src="./assets/words/code-bracket.svg" alt=""></div><div class="landing-term"><dt>위원</dt><dd>맡은 일을 담당하는 구성원</dd></div></dl></div></section>
    <div class="landing-actions"><div class="landing-orientation"><ol class="landing-flow" aria-label="활동 순서"><li>뜻 나누기</li><li>${arrow}기관 연결</li><li>${arrow}역할 확인</li></ol></div><button class="primary landing-start" data-action="start">활동 시작하기 ${arrow}</button></div></main>`;
}

function navigation() {
  return `<nav class="word-navigation" aria-label="단어 선택">${termSets.map(set => `<section class="word-set" aria-labelledby="${set.id}-label"><h2 id="${set.id}-label">${set.label} <span>${set.terms.length}</span></h2><div class="word-links">${set.terms.map(term => {
    const i = terms.indexOf(term);
    return `<button data-unit="${i}" ${unit === i && !finish ? 'aria-current="step"' : ''} class="${isComplete(term) ? 'completed' : ''}">${isComplete(term) ? '<span aria-hidden="true">✓ </span><span class="sr-only">완료: </span>' : ''}${term.word}</button>`;
  }).join('')}</div></section>`).join('')}<button class="compare-link" data-unit="${terms.length}" ${unit >= terms.length && !finish ? 'aria-current="step"' : ''}>비교 연습 <span aria-hidden="true">↗</span></button></nav>`;
}

function header(comparison) {
  const current = comparison ? unit - terms.length + 1 : unit + 1;
  const total = comparison ? comparisons.length : terms.length;
  return `<header class="site-header"><a class="brand" href="./index.html">말뜻 카드<span class="brand-dot" aria-hidden="true">.</span></a><div class="progress-track" role="progressbar" aria-label="${comparison ? '비교 연습' : '단어'} 순서" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${current}"><span style="width:${current / total * 100}%"></span></div><span class="counter">${comparison ? '<small>비교</small>' : ''}${String(current).padStart(2, '0')} <span>/ ${String(total).padStart(2, '0')}</span></span></header>`;
}

function wordCard(item, state, comparison) {
  const relatedTerm = comparison ? terms.find(term => term.word === item.word) : item;
  const parts = relatedTerm?.parts;
  const badge = comparison ? '헷갈리는 말' : item.tag || (item.target ? '헌법기관' : item.source ? '권한 · 의원 내각제' : '정부 형태');
  const longWord = item.word.replaceAll(' ', '').length > 5 ? 'long-word' : '';
  const word = parts ? `<div class="word-pieces whole-word ${longWord} ${state.opened ? 'is-open' : ''}" data-parts="${parts.length}" style="--part-count:${parts.length};grid-template-columns:${parts.map(([text]) => `${Math.max(2, text.length)}fr`).join(' ')}" aria-label="${escape(item.word)}">${parts.map(([text, meaning], i) => `<div class="word-piece" data-space-before="${i > 0 && item.word.includes(`${parts[i - 1][0]} ${text}`)}"><strong>${text}</strong><span class="piece-meaning" aria-hidden="${!state.opened}"><span>${meaning}</span></span></div>`).join('')}</div>` : `<h2 class="whole-word ${longWord}">${item.word}</h2>`;
  return `<section class="card-stack" aria-label="${escape(item.word)} 단어 카드"><div class="word-card"><div class="card-top"><span class="card-tag">${badge}</span><span class="card-index" aria-hidden="true">${String(unit + 1).padStart(2, '0')}</span></div><div class="card-content">${word}</div><div class="card-bottom">${parts ? `<button class="split-button" data-action="split" aria-pressed="${state.opened}" aria-expanded="${state.opened}">${state.opened ? '단어로 모으기' : '뜻으로 나누기'} <span aria-hidden="true">${state.opened ? '−' : '+'}</span></button>` : '<span class="card-note">이름을 찬찬히 읽어 보세요.</span>'}</div></div></section>`;
}

function layoutWord() {
  const pieces = app.querySelector('.word-pieces');
  if (!pieces) return;
  const card = app.querySelector('.word-card');
  const labels = [...pieces.querySelectorAll('strong')];
  const space = parseFloat(getComputedStyle(pieces).fontSize) * .25;
  const widths = labels.map(label => label.offsetWidth);
  const gaps = labels.map(label => label.parentElement.dataset.spaceBefore === 'true' ? space : 0);
  let left = (pieces.clientWidth - widths.reduce((sum, width, i) => sum + width + gaps[i], 0)) / 2;
  labels.forEach((label, i) => {
    left += gaps[i];
    label.style.setProperty('--joined-x', `${left - label.parentElement.offsetLeft - label.offsetLeft}px`);
    left += widths[i];
  });
  const meaningHeight = Math.max(...[...pieces.querySelectorAll('.piece-meaning > span')].map(meaning => meaning.scrollHeight));
  pieces.style.setProperty('--meaning-height', `${meaningHeight}px`);
  const baseHeight = parseFloat(getComputedStyle(card).getPropertyValue('--card-height'));
  const extraHeight = meaningHeight + parseFloat(getComputedStyle(pieces).getPropertyValue('--meaning-gap'));
  card.style.height = `${baseHeight + (pieces.classList.contains('is-open') ? extraHeight : 0)}px`;
  requestAnimationFrame(() => {
    if (!pieces.isConnected) return;
    pieces.classList.add('is-ready');
    card.classList.add('is-ready');
  });
}

function branchButtons(item, state) {
  const q = branchQuestion(item);
  return `<div class="branch-area"><div class="branch-label"><span>${item.source || item.tag === '국가 기관의 권한' ? '권한을 행사하는 쪽' : item.connections ? '두 권력 · 모두 선택' : '기관과 역할 연결'}</span><span>입법 · 행정 · 사법</span></div><div class="branch-choices" role="group" aria-label="${q.title}">${branches.map((branch, i) => {
    const selected = state.branch.includes(branch.id);
    return `<button class="branch-choice ${selected ? 'selected' : ''}" data-branch="${branch.id}" aria-pressed="${selected}" ${state.branchSolved ? 'aria-disabled="true"' : ''}><span class="choice-number" aria-hidden="true">${i + 1}</span><span class="branch-name">${branch.label}</span><span class="institution-name">${branch.institution}</span></button>`;
  }).join('')}</div></div>`;
}

function roleOptions(q, state) {
  const longChoices = q.options.some(option => option.label.replaceAll(' ', '').length > 8);
  return `<div class="role-choices ${longChoices ? 'long-choices' : ''}" role="group" aria-label="${escape(q.title)}">${q.options.map(option => `<button data-choice="${option.id}" class="role-choice ${state.selected === option.id ? 'selected' : ''}" aria-pressed="${state.selected === option.id}">${escape(option.label)}<span class="option-check" aria-hidden="true">${state.selected === option.id ? '✓' : ''}</span></button>`).join('')}</div>`;
}

function renderRoleDialog(focusSelector) {
  const item = items[unit];
  const state = stateFor(item);
  roleDialog.classList.toggle('is-feedback', !finish && !branchHintView && feedbackView && Boolean(state.feedback));
  roleDialog.classList.toggle('is-question', !finish && !branchHintView && !feedbackView);
  if (finish) {
    roleDialog.innerHTML = `<div class="dialog-top"><span>활동 마무리</span><button class="dialog-close" data-action="close-role" aria-label="결과 닫기">×</button></div><h2 id="role-question" tabindex="-1">활동 결과를 확인해요.</h2><p class="dialog-hint">단어 ${terms.filter(isComplete).length} / ${terms.length}개 · 비교 ${comparisons.filter(isComplete).length} / ${comparisons.length}개 확인</p><div class="recap">${terms.map((term, i) => `<button data-unit="${i}"><strong>${term.word}</strong><span>${isComplete(term) ? escape(term.result) : '아직 확인하지 않은 단어 →'}</span></button>`).join('')}</div><div class="dialog-actions"><button class="primary" data-action="restart">처음부터 다시</button></div>`;
    roleDialog.querySelector('#role-question')?.focus({ preventScroll: true });
    return;
  }
  if (branchHintView) {
    roleDialog.innerHTML = `<div class="dialog-top"><span>${item.word}</span><button class="dialog-close" data-action="close-role" aria-label="힌트 닫기">×</button></div><h2 id="role-question" tabindex="-1">힌트</h2><p class="dialog-hint">${escape(branchQuestion(item).hint)}</p><div class="dialog-actions"><button class="primary" data-action="close-role">선택으로 돌아가기</button></div>`;
    roleDialog.querySelector('#role-question')?.focus({ preventScroll: true });
    return;
  }
  if (feedbackView && state.feedback) {
    const feedback = state.feedback;
    const continueAction = feedback.correct ? isComplete(item) ? 'next' : 'continue-role' : 'retry-choice';
    const continueLabel = feedback.correct ? isComplete(item) ? nextLabel() : '다음 질문으로' : '다시 선택하기';
    const stage = feedback.kind === 'branch' ? '기관 연결' : unit >= terms.length ? '비교 연습' : '역할 확인';
    const connection = feedback.correct && unit < terms.length;
    const branchConnection = feedback.kind === 'branch';
    const result = connection
      ? `<div class="feedback-connection ${branchConnection ? '' : 'is-role'}" role="group" aria-label="${escape(item.word)} → ${escape(feedback.selection)}"><div class="feedback-term"><span>단어</span><strong>${escape(item.word)}</strong></div><img class="feedback-arrow" src="./assets/words/arrow-long-right.svg" alt=""><div class="feedback-answer"><span>${branchConnection ? '연결한 권력' : escape(feedback.question)}</span>${branchConnection ? `<div class="feedback-chips">${feedback.selection.split(' · ').map(label => `<strong>${escape(label)}</strong>`).join('')}</div>` : `<div class="feedback-role"><strong>${escape(feedback.selection)}</strong></div>`}</div></div>${!branchConnection && item.resultNote ? `<p class="feedback-role-note">${escape(item.resultNote)}</p>` : ''}`
      : `<p class="feedback-question">${escape(feedback.question)}</p><div class="feedback-answer-card ${feedback.correct ? 'is-correct' : ''}"><span>${escape(item.word)} · 선택한 ${feedback.kind === 'branch' ? '권력' : '답'}</span><strong>${escape(feedback.selection)}</strong></div><div class="feedback-description"><span>${feedback.correct ? '기억할 연결' : '생각해 볼 힌트'}</span><p>${escape(feedback.detail)}</p></div>`;
    roleDialog.innerHTML = `<div class="dialog-top"><span class="feedback-kicker">${stage}</span><button class="dialog-close" data-action="close-role" aria-label="결과 닫기">×</button></div><div class="feedback-status"><span class="feedback-symbol ${feedback.correct ? 'is-correct' : ''}" aria-hidden="true">${feedback.correct ? '✓' : '↻'}</span><h2 id="role-question" tabindex="-1">${feedback.correct ? '맞았어요!' : '다시 살펴봐요'}</h2></div>${result}<div class="dialog-actions feedback-actions"><button class="primary" data-action="${continueAction}">${continueLabel}<img src="./assets/words/arrow-long-right.svg" alt=""></button></div>`;
    roleDialog.scrollTop = 0;
    roleDialog.querySelector(focusSelector || '#role-question')?.focus({ preventScroll: true });
    return;
  }
  const comparison = unit >= terms.length;
  const q = comparison ? item : followups(item)[state.answers.length];
  if (!q) return;
  const hint = state.hint ? q.hint : '';
  roleDialog.innerHTML = `<div class="dialog-top"><span>${item.word}</span><button class="dialog-close" data-action="close-role" aria-label="질문 닫기">×</button></div><h2 id="role-question" tabindex="-1">${q.title}</h2>${roleOptions(q, state)}<p class="dialog-hint" aria-live="polite">${escape(hint)}</p><div class="dialog-actions"><button class="primary" data-action="check" ${state.selected ? '' : 'disabled'}>확인하기 →</button><button class="quiet" data-action="hint" aria-pressed="${state.hint}">힌트</button></div>`;
  if (focusSelector) roleDialog.querySelector(focusSelector)?.focus({ preventScroll: true });
}

function openRoleDialog() {
  branchHintView = false;
  const item = items[unit];
  if (finish || (unit < terms.length && !stateFor(item).branchSolved)) return;
  if (isComplete(item)) return openFeedbackDialog();
  feedbackView = false;
  renderRoleDialog();
  if (!roleDialog.open) roleDialog.showModal();
  roleDialog.querySelector('#role-question').focus({ preventScroll: true });
}

function openFeedbackDialog() {
  branchHintView = false;
  if (!stateFor(items[unit]).feedback) return;
  feedbackView = true;
  renderRoleDialog();
  if (!roleDialog.open) roleDialog.showModal();
  roleDialog.querySelector('#role-question').focus({ preventScroll: true });
}

function openHintDialog() {
  branchHintView = true;
  renderRoleDialog();
  if (!roleDialog.open) roleDialog.showModal();
  roleDialog.querySelector('#role-question').focus({ preventScroll: true });
}

function openSummaryDialog() {
  renderRoleDialog();
  if (!roleDialog.open) roleDialog.showModal();
  roleDialog.querySelector('#role-question').focus({ preventScroll: true });
}

function closeRoleDialog(selector) {
  returnFocusSelector = selector || (branchHintView ? '[data-action="hint"]' : undefined);
  branchHintView = false;
  roleDialog.close();
}

function nextLabel() {
  return unit === items.length - 1 ? '마무리' : unit === terms.length - 1 ? '비교 연습으로' : unit >= terms.length ? '다음 비교' : '다음 단어';
}

function render(focusSelector) {
  app.classList.toggle('is-landing', !started);
  if (!started) {
    app.innerHTML = landing();
    return;
  }
  const item = items[unit];
  const comparison = unit >= terms.length;
  if (finish) {
    app.innerHTML = `<header class="site-header"><a class="brand" href="./index.html">말뜻 카드<span class="brand-dot">.</span></a></header><main class="finish"><h1 id="screen-title" tabindex="-1">활동 마무리</h1><button class="primary" data-action="open-summary">결과 보기</button></main>${navigation()}`;
  } else {
    const state = stateFor(item);
    const complete = isComplete(item);
    const choosingBranch = !comparison && !state.branchSolved;
    const q = choosingBranch ? branchQuestion(item) : comparison ? item : followups(item)[state.answers.length];
    const title = comparison ? '헷갈리는 말을 구별해 볼까요?' : branchQuestion(item).title;
    const canCheck = choosingBranch ? state.branch.length > 0 : Boolean(state.selected);
    app.innerHTML = `${header(comparison)}<main class="activity ${comparison ? 'comparison' : ''}"><h1 id="screen-title" tabindex="-1">${title}</h1>${wordCard(item, state, comparison)}${!comparison ? branchButtons(item, state) : ''}<div class="action-gap" aria-hidden="true"></div><div class="actions"><button class="quiet previous" data-action="back" ${unit === 0 ? 'disabled' : ''}>← 이전</button><div class="main-actions">${state.feedback ? '<button class="quiet" data-action="open-result">결과 다시 보기</button>' : ''}${complete ? `<button class="primary" data-action="next">${nextLabel()} <span aria-hidden="true">→</span></button><button class="quiet" data-action="retry">다시 풀기</button>` : choosingBranch ? `<button class="primary" data-action="check" ${canCheck ? '' : 'disabled'}>확인하기 <span aria-hidden="true">→</span></button><button class="quiet hint-button" data-action="hint">힌트</button>` : `<button class="primary" data-action="open-role">${comparison ? '비교' : '역할'} 문제 풀기 ↗</button>`}</div><span class="action-balance" aria-hidden="true"></span></div></main>${navigation()}<footer class="page-footer"><span>${comparison ? '헷갈리는 말 비교하기' : item.context || (item.target ? '대한민국의 국가 기관 · 권한' : '의원 내각제 · 기본모형')}</span></footer>`;
  }
  layoutWord();
  if (roleDialog.open) renderRoleDialog(focusSelector);
  else if (focusSelector) app.querySelector(focusSelector)?.focus({ preventScroll: true });
  if (focusSelector === '#screen-title') window.scrollTo({ top: 0, behavior: 'instant' });
}

function handleClick(event) {
  const button = event.target.closest('button');
  if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
  if (button.dataset.action === 'start') {
    started = true;
    render('#screen-title');
    return;
  }
  if (button.dataset.unit !== undefined) {
    const next = Number(button.dataset.unit);
    if (!Number.isInteger(next) || next < 0 || next > terms.length) return;
    closeRoleDialog();
    feedbackView = false;
    unit = next;
    finish = false;
    announcement.textContent = '';
    render('#screen-title');
    openRoleDialog();
    return;
  }
  const item = items[unit];
  const state = stateFor(item);
  const comparison = unit >= terms.length;
  const choosingBranch = !comparison && !state.branchSolved;
  const q = choosingBranch ? branchQuestion(item) : comparison ? item : followups(item)[state.answers.length];
  if (button.dataset.branch) {
    if (!choosingBranch) return;
    const id = button.dataset.branch;
    state.branch = q.correct.length > 1 ? state.branch.includes(id) ? state.branch.filter(choice => choice !== id) : [...state.branch, id] : state.branch.includes(id) ? [] : [id];
    state.hint = false;
    render(`[data-branch="${id}"]`);
    return;
  }
  if (button.dataset.choice) {
    if (choosingBranch || isComplete(item)) return;
    state.selected = button.dataset.choice;
    state.hint = false;
    render(`[data-choice="${state.selected}"]`);
    return;
  }
  const action = button.dataset.action;
  if (action === 'open-summary' && finish) {
    openSummaryDialog();
  } else if (action === 'open-result') {
    openFeedbackDialog();
  } else if (action === 'continue-role') {
    openRoleDialog();
  } else if (action === 'retry-choice') {
    if (state.feedback.kind === 'branch') {
      closeRoleDialog(`[data-branch="${state.branch[0]}"]`);
      render();
    } else openRoleDialog();
  } else if (action === 'open-role') {
    openRoleDialog();
  } else if (action === 'close-role') {
    closeRoleDialog();
  } else if (action === 'split') {
    state.opened = !state.opened;
    const pieces = app.querySelector('.word-pieces');
    pieces.classList.toggle('is-open', state.opened);
    pieces.querySelectorAll('.piece-meaning').forEach(meaning => meaning.setAttribute('aria-hidden', String(!state.opened)));
    button.setAttribute('aria-pressed', String(state.opened));
    button.setAttribute('aria-expanded', String(state.opened));
    button.innerHTML = `${state.opened ? '단어로 모으기' : '뜻으로 나누기'} <span aria-hidden="true">${state.opened ? '−' : '+'}</span>`;
    layoutWord();
  } else if (action === 'hint') {
    if (choosingBranch) openHintDialog();
    else {
      state.hint = !state.hint;
      render('[data-action="hint"]');
    }
  } else if (action === 'check') {
    if (isComplete(item) || (choosingBranch ? !state.branch.length : !state.selected)) return;
    const result = choosingBranch ? checkBranches(item, state.branch) : checkAnswer(q, state.selected);
    state.hint = false;
    state.feedback = {
      kind: choosingBranch ? 'branch' : 'role',
      correct: result.correct,
      question: q.title,
      selection: choosingBranch ? state.branch.map(id => branches.find(branch => branch.id === id).label).join(' · ') : q.options.find(option => option.id === state.selected).label,
      detail: result.correct ? choosingBranch ? `${item.word} → ${state.branch.map(id => branches.find(branch => branch.id === id).label).join(' · ')}` : item.result : result.hint,
    };
    if (result.correct) {
      if (choosingBranch) state.branchSolved = true;
      else state.answers.push(state.selected);
      state.selected = '';
    }
    feedbackView = true;
    announcement.textContent = '';
    render();
    openFeedbackDialog();
  } else if (action === 'retry') {
    closeRoleDialog();
    feedbackView = false;
    progress.set(item.id, initial());
    render('#screen-title');
    openRoleDialog();
  } else if (action === 'next' && isComplete(item)) {
    closeRoleDialog();
    feedbackView = false;
    if (unit === items.length - 1) finish = true;
    else unit++;
    announcement.textContent = '';
    render('#screen-title');
    if (finish) openSummaryDialog();
    else openRoleDialog();
  } else if (action === 'back' && unit > 0) {
    closeRoleDialog();
    feedbackView = false;
    unit--;
    announcement.textContent = '';
    render('#screen-title');
    openRoleDialog();
  } else if (action === 'restart') {
    closeRoleDialog();
    feedbackView = false;
    progress.clear();
    unit = 0;
    finish = false;
    announcement.textContent = '';
    render('#screen-title');
  }
}

app.addEventListener('click', handleClick);
window.addEventListener('resize', layoutWord);
roleDialog.addEventListener('click', handleClick);
roleDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeRoleDialog();
});
roleDialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...roleDialog.querySelectorAll('button:not(:disabled)')];
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
roleDialog.addEventListener('close', () => {
  if (roleDialog.open) return;
  const state = stateFor(items[unit]);
  const selector = returnFocusSelector || (finish ? '[data-action="open-summary"]' : state.feedback ? '[data-action="open-result"]' : state.branchSolved ? '[data-action="open-role"]' : '[data-action="check"]');
  returnFocusSelector = undefined;
  app.querySelector(selector)?.focus({ preventScroll: true });
});

render();

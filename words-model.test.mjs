import test from 'node:test';
import assert from 'node:assert/strict';
import { terms, termSets, comparisons, checkAnswer, branches, branchQuestion, checkBranches } from './words-model.mjs';

test('기존 아홉 단어와 추가 열다섯 개념의 한글 뜻 조각을 빠짐없이 제공한다', () => {
  assert.deepEqual(termSets[0].terms.map(t => t.word), ['국회의원', '국회의장', '국무총리', '국무위원', '국무회의', '대법원장', '의원 내각제', '내각 불신임권', '의회 해산권']);
  assert.deepEqual(termSets[1].terms.map(t => t.word), ['입법부', '행정부', '사법부', '행정 각부', '감사원', '국정 감사권', '국정 조사권', '법률안 거부권', '탄핵 소추권', '대통령제', '헌법재판소', '행정법원', '위헌 법률 심판', '헌법 소원 심판', '탄핵 심판']);
  assert.equal(terms.length, 24);
  assert.equal(new Set([...terms, ...comparisons].map(t => t.id)).size, terms.length + comparisons.length);
  assert.doesNotMatch(JSON.stringify({ terms, comparisons }), /[\u3400-\u9fff]/u);
  for (const t of terms) {
    assert.equal(t.parts.map(p => p[0]).join(''), t.word.replaceAll(' ', ''));
    assert.equal(t.questions.length, 2);
    for (const [part, meaning] of t.parts) assert.ok(part && meaning);
  }
});

test('국회·행정부·법원과 두 권한의 주체와 대상을 혼동하지 않는다', () => {
  assert.deepEqual(terms.slice(0, 6).map(t => t.target), ['assembly', 'assembly', 'executive', 'executive', 'executive', 'court']);
  for (const t of terms.filter(t => t.source)) {
    assert.notEqual(t.source, t.destination);
    assert.equal(t.questions[0].correct, t.source);
    assert.equal(t.questions[1].correct, t.destination);
  }
  assert.equal(terms.find(t => t.id === 'confidence').source, 'assembly');
  assert.equal(terms.find(t => t.id === 'dissolution').source, 'cabinet');
  assert.equal(comparisons.find(q => q.id === 'chair').correct, 'president');
  assert.equal(comparisons.find(q => q.id === 'two-words').correct, 'institution');
});

test('모든 연습에서 정답 하나만 인정하고 오답에는 재선택 힌트를 제공한다', () => {
  for (const q of [...terms.flatMap(t => t.questions), ...comparisons]) {
    assert.equal(q.options.filter(o => o.id === q.correct).length, 1);
    assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
    assert.ok(q.options.length >= 2 && q.options.length <= 3);
    for (const option of q.options) {
      const result = checkAnswer(q, option.id);
      assert.equal(result.correct, option.id === q.correct);
      assert.equal(Boolean(result.hint), option.id !== q.correct);
    }
    assert.throws(() => checkAnswer(q, 'unknown'), RangeError);
  }
  assert.throws(() => checkAnswer(null, 'unknown'), RangeError);
});

test('세 권력 선택은 기관의 소속과 권한의 주체를 구별하고 복수 정답을 정확히 채점한다', () => {
  const expected = [
    ['assembly'], ['assembly'], ['executive'], ['executive'], ['executive'], ['court'], ['assembly', 'executive'], ['assembly'], ['executive'],
    ['assembly'], ['executive'], ['court'], ['executive'], ['executive'], ['assembly'], ['assembly'], ['executive'], ['assembly'],
    ['assembly', 'executive'], ['court'], ['court'], ['court'], ['court'], ['court'],
  ];
  for (const [index, term] of terms.entries()) {
    assert.deepEqual(branchQuestion(term).correct, expected[index]);
    for (let mask = 0; mask < 8; mask++) {
      const selected = branches.filter((_, i) => mask & (1 << i)).map(branch => branch.id);
      const correct = selected.length === expected[index].length && selected.every(id => expected[index].includes(id));
      assert.equal(checkBranches(term, selected).correct, correct, `${term.word}: ${selected}`);
      assert.equal(Boolean(checkBranches(term, selected).hint), !correct);
    }
  }
  assert.equal(checkBranches(terms[6], ['executive', 'assembly']).correct, true);
  assert.throws(() => checkBranches(terms[0], ['assembly', 'assembly']), RangeError);
  assert.throws(() => checkBranches(terms[0], ['unknown']), RangeError);
  assert.throws(() => checkBranches(null, []), RangeError);
});

test('감사·탄핵·헌법재판에서 기관과 단계의 구분을 유지한다', () => {
  const term = id => terms.find(t => t.id === id);
  assert.equal(term('audit-board').target, 'executive');
  assert.equal(term('national-audit').target, 'assembly');
  assert.equal(term('national-investigation').target, 'assembly');
  assert.equal(term('bill-veto').target, 'executive');
  assert.equal(term('impeachment-motion').target, 'assembly');
  assert.equal(term('impeachment-trial').questions[1].correct, 'constitutional');
  assert.equal(term('constitutional-review').questions[1].correct, 'constitutional');
  assert.equal(term('constitutional-complaint').questions[1].correct, 'constitutional');
  assert.equal(term('administrative-court').target, 'court');
  assert.match(term('constitutional-court').result, /일반 법원과 별도/);
  assert.match(branchQuestion(term('constitutional-court')).title, /국가 작용/);
  assert.match(branchQuestion(term('national-audit')).title, /행사하는 권한/);
  assert.equal(comparisons.length, 9);
  assert.equal(comparisons.find(q => q.id === 'motion-versus-trial').correct, 'correct-order');
  assert.equal(comparisons.find(q => q.id === 'referral-versus-review').correct, 'correct-order');
});

test('두 정부 형태 모두 두 권력을 연결하되 구성 방식은 구분한다', () => {
  for (const id of ['parliamentary', 'presidential']) {
    const term = terms.find(t => t.id === id);
    assert.equal(checkBranches(term, ['executive', 'assembly']).correct, true);
    assert.equal(checkBranches(term, ['executive']).correct, false);
  }
  assert.equal(terms.find(t => t.id === 'parliamentary').questions[0].correct, 'majority');
  assert.equal(terms.find(t => t.id === 'presidential').questions[0].correct, 'separate');
});

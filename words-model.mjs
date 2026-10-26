const institutions = [
  { id: 'assembly', label: '국회' },
  { id: 'executive', label: '행정부' },
  { id: 'court', label: '법원' },
];
const sides = [{ id: 'assembly', label: '의회' }, { id: 'cabinet', label: '내각' }];
const question = (title, options, correct, hint) => ({ title, options, correct, hint });

const originalTerms = [
  {
    id: 'member', word: '국회의원', parts: [['국회', '국민 대표들이 모인 기관'], ['의원', '의논에 참여하는 구성원']],
    group: '국회', target: 'assembly', scene: 'member',
    questions: [
      question('어느 기관의 구성원일까요?', institutions, 'assembly', '‘국회’라는 앞부분을 다시 읽어 보세요.'),
      question('이 사람은 어떤 일을 할까요?', [
        { id: 'vote', label: '법률안을 심의하고 표결한다' },
        { id: 'manage', label: '행정 각부를 총괄한다' },
        { id: 'judge', label: '구체적 사건을 재판한다' },
      ], 'vote', '국회에서 국민을 대표해 하는 일을 찾아보세요.'),
    ], result: '법률안 심의·표결',
  },
  {
    id: 'speaker', word: '국회의장', parts: [['국회', '국민 대표들이 모인 기관'], ['의장', '회의를 이끄는 사람']],
    group: '국회', target: 'assembly', scene: 'speaker',
    questions: [
      question('어느 기관의 회의를 이끌까요?', institutions, 'assembly', '어느 회의의 ‘의장’인지 앞부분을 읽어 보세요.'),
      question('어느 회의를 진행할까요?', [
        { id: 'council', label: '국무회의' }, { id: 'plenary', label: '국회 본회의' }, { id: 'trial', label: '대법원 재판' },
      ], 'plenary', '‘국회’와 ‘국무’는 다른 말이에요.'),
    ], result: '국회를 대표 · 본회의 진행',
  },
  {
    id: 'premier', word: '국무총리', parts: [['국무', '나라의 일'], ['총리', '총괄하여 다스림']],
    group: '행정부', target: 'executive', scene: 'premier',
    questions: [
      question('어느 쪽에서 일할까요?', institutions, 'executive', '우리나라에서 대통령을 보좌하며 행정을 총괄해요.'),
      question('무엇을 총괄할까요?', [
        { id: 'court', label: '각급 법원의 재판' }, { id: 'departments', label: '행정 각부의 업무' }, { id: 'assembly', label: '국회 본회의' },
      ], 'departments', '대통령을 도와 나라의 행정 업무를 총괄해요.'),
    ], result: '대통령 보좌 · 행정 각부 총괄',
  },
  {
    id: 'minister', word: '국무위원', parts: [['국무', '나라의 일'], ['위원', '맡은 일을 담당하는 구성원']],
    group: '행정부', target: 'executive', scene: 'minister',
    questions: [
      question('어느 쪽의 구성원일까요?', institutions, 'executive', '‘국회’의 의원과 구별해 보세요.'),
      question('어느 회의에서 정책을 심의할까요?', [
        { id: 'plenary', label: '국회 본회의' }, { id: 'court', label: '대법원 재판' }, { id: 'council', label: '국무회의' },
      ], 'council', '‘국무’라는 같은 뜻 조각을 찾아보세요.'),
    ], result: '국무회의 구성원 · 정책 심의',
  },
  {
    id: 'council', word: '국무회의', parts: [['국무', '나라의 일'], ['회의', '모여 의논함']],
    group: '행정부', target: 'executive', scene: 'council',
    questions: [
      question('어느 쪽의 회의일까요?', institutions, 'executive', '정부의 중요한 정책을 논의하는 회의예요.'),
      question('무엇을 하는 회의일까요?', [
        { id: 'policy', label: '정부의 중요한 정책을 심의한다' },
        { id: 'law', label: '국회의 법률안을 최종 의결한다' },
        { id: 'trial', label: '구체적 사건의 재판을 한다' },
      ], 'policy', '나라의 중요한 행정 정책을 논의해요.'),
    ], result: '정부의 중요한 정책 심의',
  },
  {
    id: 'chief', word: '대법원장', parts: [['대법원', '우리나라의 최고 법원'], ['장', '우두머리']],
    group: '법원', target: 'court', scene: 'chief',
    questions: [
      question('어느 기관의 장일까요?', institutions, 'court', '‘대법원’과 ‘장’을 나누어 읽어 보세요.'),
      question('어떤 지위에 있는 사람일까요?', [
        { id: 'department', label: '행정 각부의 장' }, { id: 'chief', label: '최고 법원인 대법원의 장' }, { id: 'speaker', label: '국회를 대표하는 의장' },
      ], 'chief', '큰 단어 안에 들어 있는 ‘법원’을 찾아보세요.'),
    ], result: '최고 법원인 대법원의 장',
  },
  {
    id: 'parliamentary', word: '의원 내각제', parts: [['의원', '의회라는 기관'], ['내각', '총리와 장관들로 구성된 행정부'], ['제', '제도']],
    group: '의원 내각제', scene: 'parliamentary', connections: ['assembly', 'executive'],
    questions: [
      question('내각 구성의 바탕은 무엇일까요?', [
        { id: 'president', label: '별도로 선출된 대통령' }, { id: 'majority', label: '의회 다수파의 지지' }, { id: 'court', label: '법원의 판결' },
      ], 'majority', '여기서 ‘의원’은 사람 한 명이 아니라 의회를 뜻해요.'),
      question('내각은 누구에게 정치적 책임을 질까요?', [
        { id: 'court', label: '법원' }, { id: 'assembly', label: '의회' },
      ], 'assembly', '내각을 뒷받침하는 지지가 어디에서 오는지 떠올려 보세요.'),
    ], result: '의회 다수파 → 내각 구성',
  },
  {
    id: 'confidence', word: '내각 불신임권', parts: [['내각', '신임을 받는 대상'], ['불신임', '믿고 맡길 수 없다고 판단함'], ['권', '권한']],
    group: '의원 내각제', scene: 'confidence', source: 'assembly', destination: 'cabinet',
    questions: [
      question('누가 불신임권을 행사할까요?', sides, 'assembly', '내각이 의회의 신임을 바탕으로 일한다는 점을 떠올려 보세요.'),
      question('누구에게 책임을 물을까요?', sides, 'cabinet', '단어의 맨 앞에 책임을 묻는 대상이 있어요.'),
    ], result: '의회 → 내각',
  },
  {
    id: 'dissolution', word: '의회 해산권', parts: [['의회', '해산되는 대상'], ['해산', '흩어지게 함'], ['권', '권한']],
    group: '의원 내각제', scene: 'dissolution', source: 'cabinet', destination: 'assembly',
    questions: [
      question('누가 의회를 해산할까요?', sides, 'cabinet', '의원 내각제에서 의회를 견제하는 행정부를 찾아보세요.'),
      question('어느 기관을 해산할까요?', sides, 'assembly', '단어의 맨 앞에 해산되는 대상이 있어요.'),
    ], result: '내각 → 의회 → 새 선거',
  },
];

const powers = [
  { id: 'assembly', label: '입법' },
  { id: 'executive', label: '행정' },
  { id: 'court', label: '사법' },
];
const adjudicators = [
  { id: 'assembly', label: '국회' },
  { id: 'court', label: '일반 법원' },
  { id: 'constitutional', label: '헌법재판소' },
];

const addedTerms = [
  {
    id: 'legislature', word: '입법부', parts: [['입법', '법률을 만들거나 고침'], ['부', '국가의 일을 나누어 맡는 조직']],
    group: '국회', target: 'assembly',
    questions: [
      question('어떤 국가 작용을 맡을까요?', powers, 'assembly', '‘입법’은 법률을 만드는 일이에요.'),
      question('우리나라에서 이 역할을 맡는 기관은?', institutions, 'assembly', '국민의 대표가 모여 법률을 심의하고 의결해요.'),
    ], result: '입법부 → 국회 · 법률 제정·개정',
  },
  {
    id: 'executive-branch', word: '행정부', parts: [['행정', '법률을 집행하고 정책을 실행함'], ['부', '국가의 일을 나누어 맡는 조직']],
    group: '행정부', target: 'executive',
    questions: [
      question('어떤 국가 작용을 맡을까요?', powers, 'executive', '법률에 따라 정책을 세우고 실행하는 일이에요.'),
      question('어떤 일이 이 기관의 역할일까요?', [
        { id: 'trial', label: '재판으로 분쟁을 해결한다' }, { id: 'policy', label: '법률을 집행하고 정책을 실행한다' }, { id: 'law', label: '법률을 최종 의결한다' },
      ], 'policy', '법을 만드는 일과 그 법을 집행하는 일을 구별해 보세요.'),
    ], result: '행정부 → 법률 집행 · 정책 수립·실행',
  },
  {
    id: 'judiciary', word: '사법부', parts: [['사법', '법을 해석·적용하여 판단함'], ['부', '국가의 일을 나누어 맡는 조직']],
    group: '법원', target: 'court',
    questions: [
      question('어떤 국가 작용을 맡을까요?', powers, 'court', '‘사법’은 구체적 사건에 법을 적용해 판단하는 일이에요.'),
      question('어떤 일이 이 기관의 역할일까요?', [
        { id: 'policy', label: '행정 정책을 실행한다' }, { id: 'law', label: '새로운 법률을 만든다' }, { id: 'trial', label: '구체적 사건을 재판한다' },
      ], 'trial', '분쟁이나 범죄 사건에 법을 적용해 판단해요.'),
    ], result: '사법부 → 법원 · 구체적 사건의 재판',
  },
  {
    id: 'departments', word: '행정 각부', parts: [['행정', '법률을 집행하고 정책을 실행함'], ['각부', '분야별로 나누어 맡은 부처들']],
    group: '행정부', target: 'executive',
    questions: [
      question('어느 쪽에서 일할까요?', institutions, 'executive', '교육·외교·국방 등의 행정 업무를 나누어 맡아요.'),
      question('교육부·외교부 같은 부처는 무엇을 할까요?', [
        { id: 'department-work', label: '분야별 행정 업무를 맡는다' }, { id: 'trial', label: '재판의 최종 판결을 내린다' }, { id: 'law', label: '법률안을 최종 의결한다' },
      ], 'department-work', '‘각부’는 각 분야를 맡은 부처들이라는 뜻이에요.'),
    ], result: '행정 각부 → 교육·외교·국방 등 분야별 행정',
  },
  {
    id: 'audit-board', word: '감사원', parts: [['감사', '업무와 회계를 살펴 잘못을 점검함'], ['원', '특정한 일을 맡는 기관']],
    group: '행정부', target: 'executive',
    questions: [
      question('조직상 어느 쪽에 속할까요?', institutions, 'executive', '대통령 소속이지만 감사 업무는 독립적으로 수행해요.'),
      question('이 기관은 무엇을 점검할까요?', [
        { id: 'law', label: '국회의 법률안 표결 결과' }, { id: 'audit', label: '국가의 회계와 공무원의 직무' }, { id: 'trial', label: '모든 법원의 판결 내용' },
      ], 'audit', '세금이 제대로 쓰였는지, 공무원이 일을 바르게 했는지 살펴요.'),
    ], result: '감사원 → 국가 회계 검사 · 공무원 직무 감찰',
  },
  {
    id: 'national-audit', word: '국정 감사권', parts: [['국정', '나라의 정치와 운영 전반'], ['감사', '일을 바르게 했는지 점검함'], ['권', '권한']],
    group: '국회', target: 'assembly', tag: '국가 기관의 권한', branchTitle: '어느 쪽이 행사하는 권한일까요?',
    questions: [
      question('누가 국정을 감사할까요?', institutions, 'assembly', '감사를 받는 정부와 감사하는 국민의 대표 기관을 구별해 보세요.'),
      question('국정 감사는 어떤 방식으로 이루어질까요?', [
        { id: 'specific', label: '필요할 때 특정 사안만 조사한다' }, { id: 'annual', label: '매년 국정 전반을 점검한다' }, { id: 'judgment', label: '위법한 공무원의 파면을 결정한다' },
      ], 'annual', '국정 조사와 달리 매년 정기적으로 이루어져요.'),
    ], result: '국회 → 매년 국정 전반을 감사 · 정부 견제',
  },
  {
    id: 'national-investigation', word: '국정 조사권', parts: [['국정', '나라의 정치와 운영 전반'], ['조사', '특정 사실을 자세히 살펴 밝힘'], ['권', '권한']],
    group: '국회', target: 'assembly', tag: '국가 기관의 권한', branchTitle: '어느 쪽이 행사하는 권한일까요?',
    questions: [
      question('누가 국정 사안을 조사할까요?', institutions, 'assembly', '국민의 대표 기관이 국가의 일을 감시하는 권한이에요.'),
      question('국정 조사는 무엇을 살펴볼까요?', [
        { id: 'annual', label: '매년 정기적으로 국정 전반' }, { id: 'trial', label: '개인 간 손해 배상 분쟁' }, { id: 'specific', label: '필요할 때 특정한 국정 사안' },
      ], 'specific', '‘조사’는 문제가 된 특정 사안의 사실을 자세히 밝히는 일이에요.'),
    ], result: '국회 → 특정 국정 사안 조사 · 정부 견제',
  },
  {
    id: 'bill-veto', word: '법률안 거부권', parts: [['법률안', '법률로 만들려고 제안한 안건'], ['거부', '받아들이지 않음'], ['권', '권한']],
    group: '행정부', target: 'executive', tag: '국가 기관의 권한', branchTitle: '어느 쪽이 행사하는 권한일까요?',
    questions: [
      question('누가 이 권한을 행사할까요?', institutions, 'executive', '국회가 의결한 법률안에 대통령이 이의를 제기하는 권한이에요.'),
      question('대통령이 거부권을 행사하면 어떻게 될까요?', [
        { id: 'retry', label: '국회로 돌려보내 재의를 요구한다' }, { id: 'dissolve', label: '국회의원을 모두 해임한다' }, { id: 'rewrite', label: '대통령이 법률을 마음대로 고친다' },
      ], 'retry', '법률안을 다시 심의·의결하도록 요구하며, 국회가 재의결할 수도 있어요.'),
    ], result: '대통령 → 국회에 법률안 재의 요구 · 국회 견제',
  },
  {
    id: 'impeachment-motion', word: '탄핵 소추권', parts: [['탄핵', '위법한 공직자의 파면을 묻는 절차'], ['소추', '심판을 해 달라고 요구함'], ['권', '권한']],
    group: '국회', target: 'assembly', tag: '국가 기관의 권한', branchTitle: '어느 쪽이 행사하는 권한일까요?',
    questions: [
      question('누가 탄핵 소추를 의결할까요?', institutions, 'assembly', '탄핵 심판을 하는 기관과 심판을 요구하는 기관은 달라요.'),
      question('탄핵 소추를 의결한다는 것은?', [
        { id: 'remove', label: '국회가 곧바로 파면을 확정한다' }, { id: 'request', label: '헌법재판소에 탄핵 심판을 요구한다' }, { id: 'sentence', label: '대통령이 형벌을 선고한다' },
      ], 'request', '소추는 심판을 요구하는 단계이고, 파면 여부는 헌법재판소가 판단해요.'),
    ], result: '국회 → 탄핵 소추 의결 → 헌법재판소의 심판',
  },
  {
    id: 'presidential', word: '대통령제', parts: [['대통령', '대통령제에서 행정부를 이끄는 사람'], ['제', '제도']],
    group: '대통령제', connections: ['assembly', 'executive'], context: '대통령제 · 기본모형',
    questions: [
      question('국민은 의회 의원과 대통령을 어떻게 선출할까요?', [
        { id: 'assembly-only', label: '의원만 뽑고 의회가 총리를 정한다' }, { id: 'separate', label: '각각의 선거로 따로 뽑는다' }, { id: 'court', label: '법원이 두 기관을 구성한다' },
      ], 'separate', '의원 내각제와 달리 행정부 수반을 뽑는 선거가 별도로 있어요.'),
      question('이 제도에서 행정부를 이끄는 사람은?', [
        { id: 'president', label: '대통령' }, { id: 'speaker', label: '국회의장' }, { id: 'chief', label: '대법원장' },
      ], 'president', '제도의 이름에 행정부 수반의 이름이 들어 있어요.'),
    ], result: '의회 의원·대통령을 별도 선거로 선출 · 대통령이 행정부 구성',
  },
  {
    id: 'constitutional-court', word: '헌법재판소', parts: [['헌법', '나라의 최고법'], ['재판소', '법을 기준으로 판단하는 기관']],
    group: '헌법재판소', target: 'court', branchTitle: '이 기관은 어떤 국가 작용을 할까요?',
    questions: [
      question('어떤 국가 작용과 연결될까요?', powers, 'court', '헌법에 따라 판단하는 사법 작용을 하며 일반 법원과는 별도인 기관이에요.'),
      question('이 기관은 무엇을 지킬까요?', [
        { id: 'budget', label: '정부의 예산 집행 계획' }, { id: 'law', label: '국회의 법률안 표결 순서' }, { id: 'constitution', label: '헌법 질서와 국민의 기본권' },
      ], 'constitution', '나라의 최고법에 어긋나는지, 기본권이 침해되었는지를 판단해요.'),
    ], result: '헌법재판소 → 헌법 수호 · 기본권 보장 · 일반 법원과 별도', resultNote: '일반 법원과는 별도로 설치된 독립 기관이에요.',
  },
  {
    id: 'administrative-court', word: '행정법원', parts: [['행정', '이 법원이 다루는 사건의 분야'], ['법원', '법에 따라 재판하는 기관']],
    group: '법원', target: 'court',
    questions: [
      question('어느 쪽의 기관일까요?', institutions, 'court', '앞의 ‘행정’은 다루는 분야이고, 기관의 종류는 뒤의 ‘법원’에 있어요.'),
      question('어떤 사건을 재판할까요?', [
        { id: 'administrative-case', label: '행정 기관의 처분 등을 다투는 사건' }, { id: 'policy', label: '행정부의 새 정책을 만드는 회의' }, { id: 'law', label: '국회의 법률안 표결' },
      ], 'administrative-case', '행정을 직접 하는 기관이 아니라 행정 관련 분쟁을 재판하는 법원이에요.'),
    ], result: '행정법원 → 사법 · 행정 사건 재판',
  },
  {
    id: 'constitutional-review', word: '위헌 법률 심판', parts: [['위헌', '헌법에 어긋남'], ['법률', '국회가 정한 법'], ['심판', '살펴보고 판단함']],
    group: '헌법재판소', target: 'court', tag: '헌법재판', branchTitle: '어떤 국가 작용에 해당할까요?',
    questions: [
      question('어떤 국가 작용과 연결될까요?', powers, 'court', '법률을 만드는 일이 아니라 법률이 헌법에 맞는지 판단하는 일이에요.'),
      question('법원의 제청을 받아 법률의 위헌 여부를 판단하는 곳은?', adjudicators, 'constitutional', '제청하는 법원과 심판하는 헌법재판소를 구별해 보세요.'),
    ], result: '법원 제청 → 헌법재판소가 법률의 위헌 여부 심판',
  },
  {
    id: 'constitutional-complaint', word: '헌법 소원 심판', parts: [['헌법', '나라의 최고법'], ['소원', '권리 침해를 바로잡아 달라는 청구'], ['심판', '살펴보고 판단함']],
    group: '헌법재판소', target: 'court', tag: '헌법재판', branchTitle: '어떤 국가 작용에 해당할까요?',
    questions: [
      question('어떤 국가 작용과 연결될까요?', powers, 'court', '공권력으로 침해된 기본권을 구제해 달라는 요청을 판단해요.'),
      question('공권력으로 기본권을 침해받았다며 구제를 청구하는 곳은?', adjudicators, 'constitutional', '헌법에 보장된 기본권을 지키는 헌법재판 기관을 찾아보세요.'),
    ], result: '국민의 기본권 구제 청구 → 헌법재판소의 헌법 소원 심판',
  },
  {
    id: 'impeachment-trial', word: '탄핵 심판', parts: [['탄핵', '위법한 공직자의 파면을 묻는 절차'], ['심판', '살펴보고 판단함']],
    group: '헌법재판소', target: 'court', tag: '헌법재판', branchTitle: '어떤 국가 작용에 해당할까요?',
    questions: [
      question('어떤 국가 작용과 연결될까요?', powers, 'court', '국회의 소추를 받아 파면 여부를 판단하는 단계예요.'),
      question('탄핵 소추 뒤 파면 여부를 판단하는 곳은?', adjudicators, 'constitutional', '국회는 소추를 의결하고 헌법재판소는 심판해요.'),
    ], result: '국회가 탄핵 소추 → 헌법재판소가 파면 여부 판단',
  },
];

export const termSets = [
  { id: 'original', label: '처음 익힌 단어', terms: originalTerms },
  { id: 'added', label: '추가 개념', terms: addedTerms },
];
export const terms = termSets.flatMap(set => set.terms);

export const comparisons = [
  { id: 'members', word: '국무회의', scene: 'council', title: '이 회의의 구성원은 누구일까요?', options: [
    { id: 'speaker', label: '국회의장' }, { id: 'minister', label: '국무위원' }, { id: 'chief', label: '대법원장' },
  ], correct: 'minister', hint: '‘국무’라는 공통 부분을 찾아보세요.', result: '국무위원 → 국무회의' },
  { id: 'chair', word: '국무회의 의장', scene: 'council', title: '이 회의를 이끄는 사람은?', options: [
    { id: 'speaker', label: '국회의장' }, { id: 'president', label: '대통령' }, { id: 'premier', label: '국무총리' },
  ], correct: 'president', hint: '국무총리는 부의장이에요. 행정부 수반을 찾아보세요.', result: '대통령 · 국무회의 의장' },
  { id: 'two-words', word: '의원 내각제', scene: 'homonym', title: '여기서 ‘의원’은 무엇일까요?', options: [
    { id: 'person', label: '의논에 참여하는 사람 한 명' }, { id: 'institution', label: '의회라는 기관' },
  ], correct: 'institution', hint: '국회의원의 ‘의원’과 소리는 같지만 뜻은 달라요.', result: '같은 소리, 다른 뜻' },
  { id: 'direction-confidence', word: '내각 불신임권', scene: 'confidence', title: '권한은 어느 방향으로 향할까요?', options: [
    { id: 'cabinet-to-assembly', label: '내각 → 의회' }, { id: 'assembly-to-cabinet', label: '의회 → 내각' },
  ], correct: 'assembly-to-cabinet', hint: '불신임하는 쪽과 불신임을 받는 쪽을 구별해 보세요.', result: '의회 → 내각' },
  { id: 'direction-dissolution', word: '의회 해산권', scene: 'dissolution', title: '권한은 어느 방향으로 향할까요?', options: [
    { id: 'cabinet-to-assembly', label: '내각 → 의회' }, { id: 'assembly-to-cabinet', label: '의회 → 내각' },
  ], correct: 'cabinet-to-assembly', hint: '‘의회’는 권한을 행사하는 쪽일까요, 해산되는 쪽일까요?', result: '내각 → 의회 → 새 선거' },
  { id: 'audit-versus-board', word: '국정 감사권', title: '국정 감사권을 행사하는 기관은?', options: [
    { id: 'board', label: '감사원' }, { id: 'assembly', label: '국회' }, { id: 'council', label: '국무회의' },
  ], correct: 'assembly', hint: '이름에 ‘감사’가 들어 있어도 감사원의 권한과는 구별해야 해요.', result: '국정 감사권은 국회의 권한 · 감사원의 회계 검사·직무 감찰과 구별' },
  { id: 'motion-versus-trial', word: '탄핵 소추권', title: '소추와 심판을 바르게 연결하면?', options: [
    { id: 'assembly-both', label: '소추·심판 모두 국회' }, { id: 'reversed', label: '헌법재판소 소추 → 국회 심판' }, { id: 'correct-order', label: '국회 소추 → 헌법재판소 심판' },
  ], correct: 'correct-order', hint: '‘소추’는 심판을 요구하는 단계이고 ‘심판’은 파면 여부를 판단하는 단계예요.', result: '국회가 탄핵 소추를 의결 · 헌법재판소가 파면 여부 심판' },
  { id: 'court-versus-executive', word: '행정법원', title: '‘행정’이 들어가는 이 기관은 어느 쪽일까요?', options: [
    { id: 'executive', label: '행정부' }, { id: 'court', label: '사법부의 법원' }, { id: 'assembly', label: '국회의 위원회' },
  ], correct: 'court', hint: '앞부분은 사건의 분야, 뒷부분은 기관의 종류를 알려 줘요.', result: '행정법원은 사법부 · 행정 사건을 재판' },
  { id: 'referral-versus-review', word: '위헌 법률 심판', title: '제청과 심판을 바르게 연결하면?', options: [
    { id: 'correct-order', label: '법원 제청 → 헌법재판소 심판' }, { id: 'assembly-review', label: '법원 제청 → 국회 심판' }, { id: 'reversed', label: '헌법재판소 제청 → 법원 심판' },
  ], correct: 'correct-order', hint: '헌법재판소에 판단을 요청하는 법원과 실제로 심판하는 기관을 구별해 보세요.', result: '법원은 위헌 법률 심판을 제청 · 헌법재판소는 위헌 여부 심판' },
];

export function checkAnswer(question, choiceId) {
  if (!question?.options?.some(option => option.id === choiceId)) throw new RangeError('존재하지 않는 선택지');
  return { correct: choiceId === question.correct, hint: choiceId === question.correct ? '' : question.hint };
}

export const branches = [
  { id: 'assembly', label: '입법', institution: '국회·의회' },
  { id: 'executive', label: '행정', institution: '정부·내각' },
  { id: 'court', label: '사법', institution: '법원·헌재' },
];

export function branchQuestion(term) {
  if (term.target) return { title: term.branchTitle || '이 이름은 어디에 속할까요?', correct: [term.target], hint: term.questions[0].hint };
  if (term.connections) return {
    title: '어떤 두 권력의 관계를 정하는 제도일까요?', correct: term.connections,
    hint: '의회와 행정부가 각각 어떤 권력인지 생각해 보세요. 두 가지를 모두 골라요.',
  };
  return {
    title: '어느 쪽이 행사하는 권한일까요?', correct: [term.source === 'assembly' ? 'assembly' : 'executive'],
    hint: term.questions[0].hint,
  };
}

export function checkBranches(term, selected) {
  if (!terms.includes(term) || !Array.isArray(selected) || new Set(selected).size !== selected.length || selected.some(id => !branches.some(b => b.id === id))) {
    throw new RangeError('존재하지 않는 단어 또는 선택지');
  }
  const q = branchQuestion(term);
  const correct = selected.length === q.correct.length && selected.every(id => q.correct.includes(id));
  return { correct, hint: correct ? '' : q.hint };
}

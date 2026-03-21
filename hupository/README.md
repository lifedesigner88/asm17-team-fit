# Hupository — 박세종의 인간 데이터 저장소

> **Human Repository** — 한 사람의 삶을 코드처럼 버전 관리하는 개인 데이터 인프라.
> AI가 이 데이터를 소비해 자기소개·이력서·목표 컨설팅을 자동으로 수행한다.

---

## 이 저장소는 무엇인가

**Hupository**는 박세종(lifedesigner88)이 설계한 **자기 자신에 대한 구조화된 데이터 시스템**이다.
정체성·경력·목표·관심사·19년간의 연도별 회고를 YAML/Markdown으로 체계화하여,
AI가 소비할 수 있는 형태와 사람이 읽을 수 있는 형태를 동시에 지원한다.

```
한 사람의 삶  →  구조화된 데이터  →  AI 컨설팅 · 서비스 · 사람이 함께 읽는 저장소
```

---

## 사람 요약: 박세종

| 항목 | 내용 |
|------|------|
| 생년 | 1988년 9월 12일 (만 37세) |
| 정체성 키워드 | 라이프디자이너, 교육자, 개발자, 커뮤니티 빌더 |
| 현재 상태 | 1인 창업자 — 세종클래스(sejongclass.kr) 운영 중 |
| 기술 스택 | Python · TypeScript · React · Spring Boot · Supabase · AWS · K8s |
| 핵심 서사 | 10년간 교육/커뮤니티 운영 → 만 35세에 개발자 전직 → 교육×기술 통합 서비스 창업 |
| 연락처 | lifedesigner88@gmail.com |
| GitHub | https://github.com/lifedesigner88 |

> 나이 표기: 모든 나이는 **만나이 (대한민국 법정 기준)** — `schema.yaml#conventions.age` 참조

**19년의 궤적 (2007–2026)**

```
2007–2010   방황과 재부팅      대학 입학 · 조울증 진단 · 망막수술 · 너울가지 1기 참여
2011–2015   정체성 선언        '라이프디자이너' 선언 · 너울가지 8기 운영 (5년) · 대학 졸업
2016–2019   국제 무대          WYR 국제캠프 PM (12개국 · 100여 명 · 매년 1주)
2020–2022   지식의 폭발        코로나 · 뇌과학·물리 독서 200권 · 수학과외 · 대입 컨설팅
2023–2024   개발세계 입문      한화시스템 BEYOND SW캠프 · 120일 개근 · KIP 프로젝트 1위
2024–2025   부트캠프 운영 보조  엔코아(PlayData) 입사 · 4개 반 120명 수강생 관리
2025–2026   퇴사 · 1인 창업    세종클래스 풀스택 단독 기획·개발·운영 · SW마에스트로 도전
```

---

## AI 컨설팅 기능 목록

이 데이터를 AI에게 제공하면 아래 기능을 수행할 수 있다.
각 기능의 진입점(프롬프트 파일)과 필요한 컨텍스트 파일이 명시되어 있다.

### 즉시 실행형

| 기능 | 프롬프트 | 주요 컨텍스트 |
|------|----------|--------------|
| 30초·풀버전·SNS용 자기소개 생성 | [ai/prompts/intro_prompt.md](ai/prompts/intro_prompt.md) | index.yaml · persona.yaml · arc.yaml |
| 국문 이력서 생성 | [ai/prompts/resume_prompt.md](ai/prompts/resume_prompt.md) | experience/ · skills/ · projects/ |
| 매칭 프로필 생성 | [ai/prompts/matching_prompt.md](ai/prompts/matching_prompt.md) | vectors.yaml · signals.yaml |
| 다음 스텝 추론 | [ai/context/next_step.yaml](ai/context/next_step.yaml) | snapshot.yaml · goals/ · decisions.yaml |

### 주기적 컨설팅형

학생부종합전형 컨설팅 구조를 모델로 한다.
장기 목표를 기준으로 매주 활동을 점검하고, 하위목표를 제시하며, 데이터를 축적한다.

```
평생 사명 (lifetime.yaml)
  └── 10년 단위 사명 (현재: 30대, 2025-2028)
        └── 장기→중간→단기 목표 트리 (tree.yaml)
              └── 주간 컨설팅 세션 (09_journal/{decade}/{year}/{month}/{week}/session.md)
                    └── 일일 기록 (09_journal/{decade}/{year}/{month}/{week}/YYYY-MM-DD.md)
```

**컨설팅 루틴**

요일 제한 없이 언제든 진행 가능. 2주치를 몰아서 해도 된다.

| 역할 | 프롬프트 | 저장 위치 |
|------|----------|----------|
| 하루 기록 수집 | [ai/prompts/daily_collect.md](ai/prompts/daily_collect.md) | `09_journal/.../YYYY-MM-DD.md` |
| 주간 컨설팅 세션 | [ai/prompts/weekly_consult.md](ai/prompts/weekly_consult.md) | `09_journal/.../session.md` |

**주간 컨설팅 세션 (`weekly_consult.md`) 흐름:**

```
1. 지난 주 숙제 체크     →  ✅ done / ⚠️ partial / ❌ not_done
2. 장기목표 정렬 진단    →  이번 주 활동이 lifetime 사명에 얼마나 기여했는가?
3. 다음 주 하위목표 제시 →  tree.yaml 목표 ID 연결 + 완료 기준 명시
4. 데이터 업데이트 제안  →  snapshot / progress / decisions 수정안
5. 세션 기록 저장        →  sessions/YYYY-WXX.md
```

**월간 목표 리뷰:**

| 기능 | 프롬프트 | 주요 컨텍스트 |
|------|----------|--------------|
| 목표 트리 현황 시각화 | [ai/prompts/goal_review.md](ai/prompts/goal_review.md) | lifetime.yaml · tree.yaml · progress.yaml |
| 월간 목표 점검 대화 | goal_review.md — 프롬프트 B | snapshot.yaml · decisions.yaml |

---

## 저장소 구조

```
hupository/
├── README.md
│
├── data/                              ← 단일 정규 데이터 레이어
│   ├── profile.yaml                   ← 기본 정보 · 연락처 · 소개문
│   ├── schema.yaml                    ← 데이터 스키마 + 표기 규칙 (만나이 등)
│   ├── sources.yaml                   ← 블로그 URL · 연도별 회고 포스트 링크
│   │
│   ├── 01_identity/                   ← 정체성 · 가치관 · 페르소나 · 전환 이력
│   ├── 02_experience/                 ← 경력 · 학력 · 프로젝트 상세
│   │   ├── community.yaml             ← 커뮤니티 · 시민활동 기록
│   │   └── projects/                  ← 세종클래스 · KIP · WYR
│   ├── 03_skills/                     ← 기술/소프트 스킬 · 숙련도 레벨
│   ├── 04_story/                      ← 6챕터 서사 마크다운 + arc.yaml
│   │   └── chapters/                  ← 2007-2010 / … / 2025-2026
│   ├── 05_interests/                  ← 관심 도메인 · 독서 목록 (2021-2026)
│   │
│   ├── 06_goals/                      ← 목표 계층 전체
│   │   ├── lifetime.yaml              ← 평생 사명 + 10년 단위 목표 (최상위)
│   │   ├── tree.yaml                  ← 장기→중간→단기 목표 계층 (현재 10년)
│   │   ├── progress.yaml              ← 각 목표 진척도
│   │   └── goals.yaml                 ← 목표 목록 (레거시)
│   │
│   ├── 07_matching/                   ← 매칭 벡터 · 신호 · 선호
│   │
│   ├── 08_now/                        ← 현재 상태 (월 1회 업데이트)
│   │   ├── snapshot.yaml              ← 진행 트랙 상태 · 제약조건 · 보류 이벤트
│   │   └── decisions.yaml             ← 주요 의사결정 로그 (why 포함)
│   │
│   ├── 09_journal/                    ← 일상 기록 + 주간 컨설팅 (누적 축적)
│   │   └── {decade}/{year}/{month}/{week}/
│   │       ├── YYYY-MM-DD.md          ← 하루 기록 (요일 무관, 매일)
│   │       └── session.md             ← 주간 컨설팅 세션 (요일 무관)
│   │   예) 2020s/2026/03/W12/2026-03-21.md
│   │
│   └── timeline/                      ← 2007–2026 연도별 회고 원본
│
├── ai/                                ← AI 소비 레이어
│   ├── index.yaml                     ← 진입점: 1분 요약 + 전체 navigation
│   ├── context/
│   │   ├── next_step.yaml             ← 다음 스텝 추론 컨텍스트
│   │   └── consult_context.yaml       ← 주간 컨설팅 세션 컨텍스트
│   ├── prompts/                       ← 기능별 프롬프트
│   │   ├── daily_collect.md           ← 일상 기록 수집
│   │   ├── weekly_summary.md          ← 주간 활동 요약
│   │   ├── weekly_consult.md          ← 주간 컨설팅 세션 (핵심)
│   │   ├── goal_review.md             ← 목표 트리 리뷰
│   │   ├── intro_prompt.md            ← 자기소개 생성
│   │   ├── resume_prompt.md           ← 이력서 생성
│   │   └── matching_prompt.md         ← 매칭 프로필 생성
│   └── outputs/                       ← AI 생성 결과물 보관
│
└── secret/                            ← PII 전용 (.gitignore)
```

---

## 핵심 설계 철학

**"내 삶을 코드처럼 다룬다"**

1. **버전 관리** — 과거의 나를 덮어쓰지 않고, 변화를 이력으로 남긴다
2. **단일 소스** — 중복 없이 `data/` 한 곳에서 관리한다
3. **구조화** — 느낌이 아닌 데이터로 자신을 기술한다
4. **완전 공개** — PII를 제외한 모든 데이터는 공개 (자살 시도·조울증·종교 포함)
5. **파생 분리** — 사실(`data/`)과 AI 생성 결과(`ai/outputs/`)를 명확히 구분한다
6. **컨설팅 루프** — 일상 기록이 장기 사명까지 연결되는 피드백 사이클을 유지한다

---

## 데이터 읽는 방법

| 목적 | 추천 진입점 |
|------|-------------|
| 이 사람을 1분 안에 파악 | [ai/index.yaml](ai/index.yaml) |
| 평생 사명과 10년 단위 목표 | [data/06_goals/lifetime.yaml](data/06_goals/lifetime.yaml) |
| 현재 집중 목표와 진척도 | [data/06_goals/tree.yaml](data/06_goals/tree.yaml) |
| 지금 이 사람의 상태 | [data/08_now/snapshot.yaml](data/08_now/snapshot.yaml) |
| 서사적 맥락으로 이해 | [data/04_story/chapters/](data/04_story/chapters/) |
| 기술 스킬 확인 | [data/03_skills/technical.yaml](data/03_skills/technical.yaml) |
| 경력·프로젝트 매칭 | [data/02_experience/](data/02_experience/) |
| 정체성·가치관·전환 이력 | [data/01_identity/](data/01_identity/) |
| 19년 성장 궤적 | [data/timeline/year_reviews.yaml](data/timeline/year_reviews.yaml) |
| 독서 목록 (연도별) | [data/05_interests/reading/](data/05_interests/reading/) |
| 주간 컨설팅 최근 세션 | [data/09_journal/2020s/](data/09_journal/2020s/) |
| AI 출력물 (자기소개·이력서) | [ai/outputs/](ai/outputs/) |

---

*Last updated: 2026-03-21 · Schema v1.1*

# 주간 요약 프롬프트 — ai/prompts/weekly_summary.md

## 사용법

아래 파일들을 컨텍스트로 제공한 뒤 이 프롬프트를 실행하세요:
- `data/09_journal/daily/` 의 최근 7일치 파일 전부
- `data/08_now/snapshot.yaml`
- `data/06_goals/progress.yaml`
- `data/08_now/decisions.yaml`

저장 위치: `data/09_journal/weekly/YYYY-WXX.yaml`

---

## 프롬프트

```
7일치 daily 기록을 읽고 아래 작업을 순서대로 해줘.

[1단계] 주간 요약 파일 생성
아래 형식으로 weekly/YYYY-WXX.yaml 을 생성해줘.

[2단계] hupository 업데이트 제안
이번 주 기록을 바탕으로, 아래 파일 중 업데이트가 필요한 항목을 찾아서
"이렇게 바꾸세요" 형식으로 제안해줘. (직접 수정하지 말고 제안만)
  - data/08_now/snapshot.yaml  (트랙 상태 변화, 새로운 blockers, 수치 업데이트)
  - data/06_goals/progress.yaml  (목표 진척도 변화)
  - data/08_now/decisions.yaml  (새로 내린 결정)

[주의]
- 기록에 없는 내용은 추측하지 말 것.
- 수치(수익, 수강생 수 등)는 명시된 것만 반영할 것.
- 모호한 경우 "확인 필요" 로 표시할 것.
```

---

## 저장 형식

```yaml
# 주간 요약 — YYYY-WXX (MM/DD ~ MM/DD)
week: "YYYY-WXX"
period: "YYYY-MM-DD ~ YYYY-MM-DD"
generated_on: "YYYY-MM-DD"

# ─────────────────────────────────────────
# 트랙별 이번 주 요약
# ─────────────────────────────────────────
tracks:
  sejongclass:
    summary: ""
    progress: ""       # 수치 변화 있으면 기재
    notable: []        # 특이사항

  sw_maestro_17:
    summary: ""
    notable: []

  # active_tracks 기준으로 해당 트랙만 포함

# ─────────────────────────────────────────
# 이번 주 핵심 이벤트
# ─────────────────────────────────────────
key_events:
  - date: "YYYY-MM-DD"
    event: ""
    impact: ""         # hupository 데이터에 미치는 영향

# ─────────────────────────────────────────
# 이번 주 결정
# ─────────────────────────────────────────
decisions_made:
  - date: "YYYY-MM-DD"
    decision: ""
    rationale: ""
    suggest_adding_to: "data/08_now/decisions.yaml"   # 있으면

# ─────────────────────────────────────────
# 이번 주 배운 것
# ─────────────────────────────────────────
learnings:
  - topic: ""
    note: ""

# ─────────────────────────────────────────
# 컨디션 흐름
# ─────────────────────────────────────────
mood_trend: ""         # 7일 분위기 한 줄 요약

# ─────────────────────────────────────────
# hupository 업데이트 제안
# ─────────────────────────────────────────
update_suggestions:
  snapshot_yaml:
    - field: ""
      current: ""
      suggested: ""
      reason: ""

  progress_yaml:
    - goal_id: ""
      field: ""
      suggested: ""

  decisions_yaml:
    - action: "add"     # add | update
      id: ""            # 기존 id (update 시)
      content: {}
```

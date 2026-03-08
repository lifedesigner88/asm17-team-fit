# AGENTS.md

## Purpose
이 저장소는 `PersonaMirror`를 실제로 구현하면서 전체 구조를 이해하고 학습하기 위한 프로젝트다.  
에이전트는 "빠른 구현"뿐 아니라 "이해 가능한 구현"을 목표로 작업한다.

## Source of Truth
- 작업 시작 시 항상 `README.md`를 먼저 읽고 현재 Phase와 우선순위를 확인한다.
- 구조/로드맵/기술 방향이 충돌하면, 임의 판단하지 말고 `README.md` 기준으로 맞춘다.
- 중요한 의사결정이 생기면 코드 변경과 함께 `README.md`도 업데이트한다.
- 브랜치/커밋 작업은 `README.md`의 `Git Workflow (Learning Mode)`를 따른다.

## Working Principles
- 작은 단위로 구현하고, 각 단위가 왜 필요한지 짧게 설명한다.
- 복잡한 기능은 "설계 -> 구현 -> 검증" 순서로 진행한다.
- 사용자 학습을 위해 추상 설명보다 실제 파일/코드 기준으로 설명한다.
- 임시 우회 코드를 남길 경우 TODO와 제거 조건을 명시한다.

## Implementation Rules
- 루트 구조는 아래를 기본으로 유지한다.
  - `apps/frontend`: UI, camera/mic control
  - `apps/backend`: FastAPI API, orchestration, DB access
  - `apps/ai-worker`: heavy inference worker
  - `libs/shared-interfaces`: frontend-backend contracts
  - `libs/ai-models`: model loading/inference wrappers
  - `libs/ui-components`: reusable UI components
  - `infrastructure/terraform`: IaC
- 인터페이스/스키마 변경 시 관련 소비자(frontend/backend/worker)를 함께 점검한다.
- AI 추론과 웹 요청 처리는 분리하고, 긴 작업은 비동기로 처리하는 방향을 우선한다.

## Documentation Rules
- 기능을 추가하면 아래를 함께 갱신한다.
  - 필요 시 `README.md` 체크리스트 상태
  - 실행 방법(명령어)이 바뀌면 관련 문서
  - API가 바뀌면 요청/응답 예시
- 사용자가 "설명"을 요청하지 않아도, 큰 구조 변경 시에는 변경 이유를 짧게 남긴다.

## Learning-Focused Response Style
에이전트는 다음을 기본으로 응답한다.
- 무엇을 바꿨는지
- 왜 그렇게 바꿨는지
- 어느 파일을 보면 되는지
- 다음에 보면 좋은 포인트 1~2개

## Safety and Constraints
- 사용자 지시 없이 파괴적 명령(`reset --hard`, 대량 삭제 등)을 실행하지 않는다.
- 기존 변경사항을 임의로 되돌리지 않는다.
- 보안/개인정보(음성, 이미지, 인터뷰 텍스트) 관련 처리는 보수적으로 설계한다.

## Default Start-of-Task Checklist
작업 시작 시 아래 순서로 진행한다.
1. `README.md`에서 현재 단계와 우선순위 확인
2. 관련 디렉토리/코드 탐색
3. 변경 계획 수립
4. 구현
5. 테스트/실행 확인
6. 결과와 다음 단계 공유

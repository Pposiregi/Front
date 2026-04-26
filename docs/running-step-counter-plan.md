# Running Step Counter 적용 가이드

## 목적

현재 러닝 세션의 `stepCount`는 실제 걸음 센서값이 아니라 GPS 거리와 평균 속도 기반 추정 보폭으로 계산된다.

현재 구조:

- 일일 걸음 수: Health Connect
- 러닝 경로/거리: GPS
- 러닝 세션 종료 걸음 수: GPS 거리 기반 추정

목표 구조:

### 러닝 중 실시간 걸음 수: Android 네이티브 Step Counter 센서

러닝이 시작되면 앱은 Android `SensorManager`를 통해 `Sensor.TYPE_STEP_COUNTER`를 구독한다. 이 센서는 "현재 세션의 걸음 수"가 아니라 "기기가 부팅된 이후 센서가 활성화되어 누적한 전체 걸음 수"를 반환한다.

따라서 러닝 시작 시점의 누적값을 baseline으로 저장하고, 러닝 중 들어오는 최신 누적값에서 baseline을 뺀 값을 세션 걸음 수로 표시한다.

```txt
runningSessionSteps = latestTotalSinceBoot - startTotalSinceBoot
```

러닝 중 UI/알림에 표시할 값은 Health Connect의 오늘 전체 걸음 수가 아니라 이 `runningSessionSteps`여야 한다.

예:

```txt
러닝 시작 시 Step Counter 값: 12,000
러닝 중 최신 Step Counter 값: 12,240
러닝 중 표시할 세션 걸음 수: 240
```

구현 시 저장해야 할 값:

- `stepCounterStartValue`: 러닝 시작 시점의 부팅 이후 누적 걸음 수
- `stepCounterLatestValue`: 가장 최근 수신한 부팅 이후 누적 걸음 수
- `stepCounterStartedAt`: 센서 기준 시작 시각
- `stepCounterSource`: `TYPE_STEP_COUNTER` 또는 fallback source

이 단계의 목적:

- 러닝 중 사용자에게 세션 기준 걸음 수를 보여준다.
- 종료 시 계산할 수 있도록 시작값과 최신값을 안정적으로 유지한다.
- GPS 거리 기반 추정보다 실제 걸음 센서에 가까운 값을 확보한다.

주의:

- Android 전용이다.
- Android 10(API 29)+에서는 `ACTIVITY_RECOGNITION` 권한이 필요하다.
- 일부 기기는 `TYPE_STEP_COUNTER` 센서가 없을 수 있다.
- 센서 이벤트는 즉시 매 걸음마다 들어온다고 보장하지 않는다.

### 러닝 종료 직후 세션 걸음 수: `TYPE_STEP_COUNTER` 종료값 - 시작값

러닝 종료 버튼을 누르면 바로 기존 GPS 추정값을 쓰지 말고, Step Counter의 마지막 값을 기준으로 세션 걸음 수를 먼저 계산한다.

```txt
sessionSteps = endTotalSinceBoot - startTotalSinceBoot
```

예:

```txt
startTotalSinceBoot = 12,000
endTotalSinceBoot = 12,850
sessionSteps = 850
```

종료 직후에는 마지막 센서 이벤트가 늦게 도착할 수 있으므로 1~3초 정도 짧게 기다린 뒤 snapshot을 가져온다.

권장 흐름:

```txt
종료 버튼 클릭
-> 중복 종료 방지 상태 설정
-> Step Counter 마지막 이벤트를 1~3초 대기
-> 최신 totalSinceBoot 조회
-> end - start 계산
-> 유효하면 /gps/end stepCount로 전송
```

유효성 검증:

- `startTotalSinceBoot`가 있어야 한다.
- `endTotalSinceBoot`가 있어야 한다.
- `endTotalSinceBoot >= startTotalSinceBoot`여야 한다.
- 세션 시간 대비 비현실적으로 큰 값이면 버린다.
- 값이 음수면 기기 재부팅, 센서 리셋, baseline 손실 가능성으로 보고 fallback한다.

이 단계에서 `/gps/end`에 보내는 `stepCount`는 1차적으로 Step Counter 기반 값이어야 한다. 기존 GPS 추정값은 이 값이 없거나 비정상일 때만 사용한다.

### 종료 후 보정: Health Connect 구간 집계값

Health Connect는 실시간 센서 스트림이 아니라 건강 데이터 저장소/집계 API로 취급한다. 따라서 러닝 중 실시간 표시나 종료 직후 1차 값으로 쓰기보다는, 종료 후 일정 시간이 지난 뒤 보정값으로 사용한다.

보정 대상 구간:

```txt
startTime <= Health Connect Steps <= endTime
```

권장 조회 방식:

```txt
Health Connect aggregate(COUNT_TOTAL)
```

현재 코드처럼 `readRecords('Steps')`를 읽어서 직접 합산하면 여러 source가 얽힌 경우 중복/누락 판단이 어려울 수 있다. 누적 타입인 Steps는 가능하면 Health Connect의 aggregate 결과를 우선 검토한다.

보정 흐름:

```txt
/gps/end에는 Step Counter 기반 stepCount 전송
-> 종료 후 30초 정도 뒤 Health Connect 구간 걸음 수 조회
-> 앱 다음 진입 시 미보정 세션이 있으면 한 번 더 조회
-> 보정 조건을 통과하면 서버 기록 업데이트
```

자동 보정 허용 조건 예:

- Health Connect 값이 0보다 크다.
- Step Counter 값과 차이가 허용 범위 안이다.
- 같은 세션을 여러 번 보정하지 않는다.
- Health Connect 값이 Step Counter 대비 과도하게 크거나 작으면 자동 덮어쓰기하지 않는다.

예:

```txt
sensorSteps = 800
healthConnectSteps = 850
diffRate = 6.25%
=> 보정 허용 가능
```

```txt
sensorSteps = 800
healthConnectSteps = 1,800
diffRate = 125%
=> 워치/다른 앱/source 중복 가능성
=> 자동 보정 금지
```

주의:

- Health Connect 값은 종료 직후 최신 상태가 아닐 수 있다.
- 워치, Samsung Health, Google Fit, 휴대폰 자체 걸음이 병합될 수 있다.
- Health Connect 값은 "이 폰이 직접 감지한 걸음"이 아니라 "Health Connect가 관리하는 병합/집계 걸음"이다.
- 서버가 종료 후 stepCount 수정 API를 지원해야 보정값을 반영할 수 있다.

### 최후 fallback: 기존 GPS 거리 기반 추정값

Step Counter를 사용할 수 없거나 값이 비정상이고, Health Connect 보정도 사용할 수 없는 경우에는 기존 GPS 거리 기반 추정값을 fallback으로 사용한다.

현재 fallback 계산:

```txt
gpsEstimatedSteps = totalGpsDistanceMeters / estimatedStepLengthMeters
```

이 값은 실제 걸음 수가 아니라 거리와 평균 속도 기반 추정값이다. 따라서 source를 명확히 구분해야 한다.

fallback 사용 조건:

- `ACTIVITY_RECOGNITION` 권한 거부
- `TYPE_STEP_COUNTER` 센서 없음
- `TYPE_STEP_DETECTOR` 센서 없음
- 앱 프로세스 종료로 baseline 손실
- `endTotalSinceBoot < startTotalSinceBoot`
- 종료 snapshot 조회 실패
- Health Connect 권한 없음
- Health Connect 값이 없거나 보정 조건 실패

fallback 정책:

- 사용자에게는 가능한 한 "세션 걸음 수"로만 보여주되 내부 source는 `GPS_ESTIMATE`로 기록한다.
- 서버에도 가능하면 `stepCountSource`를 함께 보내거나 로그에 남긴다.
- 랭킹/미션처럼 정확도가 중요한 기능에서는 fallback source 값의 신뢰도를 별도로 고려한다.

## 우선순위

1. Android `Sensor.TYPE_STEP_COUNTER` 세션 증가분
2. Android `Sensor.TYPE_STEP_DETECTOR` 이벤트 누적값
3. Health Connect 종료 후 구간 보정값
4. GPS 거리 기반 fallback

## 핵심 계산식

`TYPE_STEP_COUNTER`는 세션 걸음 수가 아니라 기기 부팅 이후 누적 걸음 수를 반환한다.

```txt
sessionSteps = currentStepCounterValue - startStepCounterValue
```

예시:

```txt
러닝 시작값: 12,000
러닝 종료값: 12,850
세션 걸음 수: 850
```

## 구현 TODO

### 1. 네이티브 Step Counter 브릿지 추가

- [ ] Android 네이티브 모듈 생성
- [ ] `SensorManager`에서 `Sensor.TYPE_STEP_COUNTER` 조회
- [ ] 센서가 없으면 `TYPE_STEP_DETECTOR` 조회
- [ ] 둘 다 없으면 지원 불가 상태 반환
- [ ] JS에서 사용할 TypeScript 인터페이스 정의

예상 JS API:

```ts
type RunningStepSensorStatus =
  | 'stepCounter'
  | 'stepDetector'
  | 'unavailable'
  | 'permissionDenied';

type RunningStepSnapshot = {
  source: RunningStepSensorStatus;
  totalSinceBoot?: number;
  sessionSteps?: number;
  timestamp: number;
};
```

필요 기능:

- [ ] `isAvailable()`
- [ ] `requestPermission()`
- [ ] `startSession()`
- [ ] `getCurrentSnapshot()`
- [ ] `stopSession()`
- [ ] 실시간 이벤트 emit

### 2. Android 권한 추가

- [ ] `android.permission.ACTIVITY_RECOGNITION` 선언
- [ ] Android 10(API 29)+ 런타임 권한 요청
- [ ] 권한 거부 시 GPS fallback으로 전환
- [ ] 권한 거부 상태를 UI/로그에서 구분 가능하게 처리

주의:

```txt
Android 10 이상에서는 ACTIVITY_RECOGNITION 권한이 없으면 Step Counter 센서를 사용할 수 없다.
```

### 3. 세션 baseline 저장

러닝 시작 시 `TYPE_STEP_COUNTER`의 현재 누적값을 baseline으로 저장한다.

- [ ] `stepCounterStartValue`
- [ ] `lastStepCounterValue`
- [ ] `stepCounterStartedAt`
- [ ] `stepCounterSource`
- [ ] `sessionId`
- [ ] `startTime`

저장 위치:

- [ ] 메모리 ref
- [ ] AsyncStorage

이유:

```txt
러닝 중 앱 프로세스가 죽거나 foreground service가 재생성되면 baseline을 잃을 수 있다.
```

### 4. `useGpsSession`에 Step Provider 연결

현재 위치:

- `src/hooks/useGpsSession.ts`
- `stepCount = distance / estimatedStepLengthMeters` 계산 부분

TODO:

- [ ] 러닝 시작 시 Step Provider 시작
- [ ] 러닝 중 실시간 `sessionSteps` 상태 갱신
- [ ] 러닝 종료 시 Step Provider snapshot 조회
- [ ] 유효한 센서값이면 센서 기반 `stepCount` 사용
- [ ] 센서값이 없거나 비정상이면 기존 GPS 추정값 사용

판단 기준:

```txt
if sensorSessionSteps is valid:
  stepCount = sensorSessionSteps
else:
  stepCount = gpsEstimatedStepCount
```

### 5. 종료 지연 처리

`TYPE_STEP_COUNTER`는 정확도는 높지만 이벤트 지연이 있을 수 있다.

TODO:

- [ ] 종료 버튼 클릭 후 1~3초 정도 마지막 센서 이벤트 대기
- [ ] 대기 중 중복 종료 방지
- [ ] 대기 실패 시 마지막 snapshot 사용
- [ ] 너무 오래 기다리지 않도록 timeout 적용

흐름:

```txt
종료 버튼 클릭
-> 마지막 Step Counter 이벤트 대기
-> current - baseline 계산
-> /gps/end 전송
```

### 6. 비정상값 fallback 처리

다음 경우에는 센서값을 버리고 fallback한다.

- [ ] 시작값이 없다
- [ ] 종료값이 없다
- [ ] 종료값이 시작값보다 작다
- [ ] 세션 중 기기 재부팅 가능성이 있다
- [ ] 세션 시간 대비 걸음 수가 비현실적으로 크다
- [ ] 센서 source가 `unavailable`이다
- [ ] 권한이 거부됐다

예:

```txt
start = 12,000
current = 120
=> 재부팅 또는 센서 리셋 가능성
=> GPS fallback 사용
```

### 7. `TYPE_STEP_DETECTOR` fallback

`TYPE_STEP_COUNTER`가 없고 `TYPE_STEP_DETECTOR`가 있으면 이벤트를 누적한다.

특징:

- `TYPE_STEP_DETECTOR`: 걸음마다 이벤트 1개
- `TYPE_STEP_COUNTER`: 부팅 이후 누적 걸음 수

TODO:

- [ ] `TYPE_STEP_COUNTER` 우선 사용
- [ ] 없으면 `TYPE_STEP_DETECTOR` 사용
- [ ] detector 이벤트 누락 가능성을 로그로 구분
- [ ] detector 사용 시 앱/서비스 생존성 중요도 높게 취급

### 8. Health Connect 보정 추가

Health Connect는 실시간 소스가 아니라 저장소/집계 API로 본다.

TODO:

- [ ] 종료 직후 `/gps/end`에는 센서값 우선 전송
- [ ] 종료 후 30초 정도 뒤 Health Connect 구간 걸음 수 조회
- [ ] 다음 앱 진입 시 미보정 세션 재조회
- [ ] 가능하면 `readRecords('Steps')` 직접 합산 대신 `aggregate(COUNT_TOTAL)` 사용
- [ ] 서버에 보정 API가 있는지 확인

필요 서버 API 예:

```txt
PATCH /gps/sessions/{sessionId}/steps
```

보정값 적용 조건:

- [ ] Health Connect 값이 0이면 무시
- [ ] 센서값 대비 차이가 과도하면 무시 또는 검토 상태로 남김
- [ ] 같은 세션에 보정은 1회만 수행
- [ ] 보정 source를 기록

예:

```txt
sensorSteps = 800
healthConnectSteps = 850
diffRate = 6.25%
=> 보정 허용 가능
```

```txt
sensorSteps = 800
healthConnectSteps = 1,800
diffRate = 125%
=> 다른 source 중복 가능성
=> 자동 덮어쓰기 금지
```

### 9. Health Connect source 차이 주의

의미 차이:

```txt
TYPE_STEP_COUNTER = 이 휴대폰이 감지한 걸음
Health Connect = 폰 + 워치 + 앱 데이터가 병합된 걸음
```

위험:

- 워치가 같은 러닝을 기록할 수 있다
- Samsung Health, Google Fit 등 다른 앱이 같은 구간을 쓸 수 있다
- Health Connect source priority에 따라 aggregate 값이 달라질 수 있다
- 러닝 종료 직후에는 아직 최신 데이터가 반영되지 않았을 수 있다

정책:

- [ ] Health Connect를 실시간 source로 사용하지 않는다
- [ ] Health Connect를 무조건 최종 진실로 취급하지 않는다
- [ ] 보정값은 제한된 조건에서만 적용한다

### 10. UI/알림 표시 기준 정리

현재 러닝 알림은 Health Connect의 오늘 전체 걸음 수를 표시할 수 있다.

TODO:

- [ ] 러닝 중 알림에는 세션 걸음 수 표시
- [ ] 일일 걸음 수와 세션 걸음 수 라벨 분리
- [ ] 러닝 종료 모달은 `/gps/end`에 보낸 세션 걸음 수와 동일한 값 표시
- [ ] 보정 후에는 활동 상세 화면에서 보정된 값 표시

문구 기준:

```txt
오늘 걸음 수: Health Connect 일일 누적
러닝 걸음 수: 현재 러닝 세션 중 측정된 걸음
```

### 11. iOS 확장 대비

Android `Sensor.TYPE_STEP_COUNTER`는 Android 전용이다.

TODO:

- [ ] 공통 인터페이스 이름을 `RunningStepProvider`로 분리
- [ ] Android 구현: `Sensor.TYPE_STEP_COUNTER`
- [ ] iOS 구현 후보: `CMPedometer`
- [ ] 미지원 플랫폼 fallback: GPS estimate

예상 구조:

```txt
src/native/RunningStepProvider.ts
android/app/src/main/java/.../RunningStepModule.kt
ios/.../RunningStepModule.swift
```

### 12. 서버 계약 확인

현재 `/gps/end`는 `stepCount`를 종료 시점에 한 번 받는다.

TODO:

- [ ] 종료 후 보정 API 존재 여부 확인
- [ ] 보정 source 필드 필요 여부 확인
- [ ] 보정 이력 저장 여부 확인
- [ ] 이미 미션/랭킹에 반영된 걸음 수를 수정할 수 있는지 확인

필요할 수 있는 필드:

```ts
type StepCountSource =
  | 'ANDROID_STEP_COUNTER'
  | 'ANDROID_STEP_DETECTOR'
  | 'HEALTH_CONNECT_CORRECTION'
  | 'GPS_ESTIMATE';
```

## 테스트 TODO

### 단위 테스트

- [ ] `current - baseline` 계산 테스트
- [ ] current < baseline fallback 테스트
- [ ] sensor unavailable fallback 테스트
- [ ] Health Connect 보정 허용/거부 기준 테스트
- [ ] GPS fallback 유지 테스트

### Android 실기기 테스트

- [ ] 권한 허용 후 러닝 시작
- [ ] 권한 거부 후 GPS fallback
- [ ] Step Counter 센서 없는 기기 fallback
- [ ] 화면 꺼짐 상태 러닝
- [ ] 백그라운드/foreground service 유지
- [ ] 종료 직후 1~3초 대기 반영 여부
- [ ] 기기 재부팅/앱 강제종료 복구 시나리오

### 비교 테스트

- [ ] 센서 기반 세션 걸음 수 vs 기존 GPS 추정값
- [ ] 센서 기반 세션 걸음 수 vs Health Connect 구간 집계
- [ ] 폰만 들고 러닝
- [ ] 워치만 착용하고 폰은 고정
- [ ] 폰 + 워치 동시 사용

## 적용 순서 제안

1. Android Step Counter 네이티브 브릿지 추가
2. 권한 및 센서 availability 처리
3. `useGpsSession`에 baseline 저장 및 종료값 계산 연결
4. 기존 GPS 추정값을 fallback으로 유지
5. 러닝 알림/모달 표시값을 세션 걸음 수 기준으로 정리
6. Health Connect `aggregate(COUNT_TOTAL)` 보정 로직 추가
7. 서버 보정 API가 준비되면 종료 후 correction 적용
8. iOS `CMPedometer` 대응 여부 결정

## 최종 정책

- 러닝 세션의 1차 source는 Android 네이티브 Step Counter 센서로 둔다.
- Health Connect는 실시간 source가 아니라 지연 보정 및 일일 걸음 수 동기화 source로 둔다.
- GPS 거리 기반 추정은 센서/권한/HC가 모두 실패했을 때의 fallback으로만 사용한다.
- source가 다른 값들을 같은 의미로 UI에 표시하지 않는다.

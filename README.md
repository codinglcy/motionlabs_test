<div align="center"> <h1>Motionlabs Backend Test</h1> </div>

## 프로젝트 정보
> 모션랩스 백엔드 채용 과제<br>
> 개발 기간: 2025.03.26 ~ 2025.04.01<br>
>> 요구사항
>> 1. Excel 파일 업로드를 통항 환자 등록 API
>> 2. 환자 목록 조회 API

<br>

## 설치 및 실행

### 1.설치

```bash
$ git clone https://github.com/codinglcy/motionlabs_test.git
$ yarn install
```

### 2.환경변수 설정

motionlabs_test 폴더의 아래에 .env 파일 생성 후 아래 코드를 참고하여 환경변수 설정
```bash
PORT = 5000

MYSQL_HOST = #mysql connection host#
MYSQL_PORT = #mysql connection port#
MYSQL_USER = #mysql connection username#
MYSQL_PASSWORD = #mysql connection password#
MYSQL_DATABASE = #mysql connection database#
```

### 3.실행

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

<br>

## API Document
- 링크 *프로젝트 실행 한 뒤에 url로 들어가세요* <br>
- [localhost:5000/api-docs](http://localhost:5000/api-docs)
  
<br>

### swagger document 캡쳐 미리보기 <br>
<img src="https://github.com/user-attachments/assets/16c93295-37e9-4a00-8245-831f0ea43f5f">
<img src="https://github.com/user-attachments/assets/3a37edc7-a0f6-44e5-bcba-aedbbf23c2eb">

<br><br>

<br>

## 요청별 처리 진행 과정 <br>

### 1. Excel 파일 업로드를 통한 환자 등록 API (http://localhost:5000/)
- 파일 읽기
  - 첫번째 시트의 두번째 행부터 읽음
  - 서비스단의 addNewPatients 호출
    - 정규식을 이용한 데이터 형식 검증 진행
    - 데이터 전처리 및 중복 데이터 병합 진행
    - 데이터 저장

<br>

### 2. 환자 목록 조회 API (http://localhost:5000/find?page=1&count=20)
- body로 받은 검색옵션과 파라미터로 받은 페이지수, 페이지에 표시할 데이터 수를 서비스단의 getPatients로 전달
  - 검색옵션의 값이 비어있는지 여부를 확인(다중조건 가능)하여 조건에 맞는 환자 목록을 조회 및 반환

<br>

## 성능 개선 <br>

> 쿼리 요청을 덜 보내도록 코드 수정을 거쳐 기존 약 48초에서 약 27초로 성능 개선 <br>

<img width="50%" src="https://github.com/user-attachments/assets/8c4206ab-14e2-41b7-87bd-1c91c45161b3"><img width="50%" src="https://github.com/user-attachments/assets/45595a7c-121c-47c9-a409-ecb8560f832b">
<br>
```
<기존의 데이터 저장 방식>
1. `chart`가 null이고 `name`, `phone`이 같은 내용이 db에 존재하는지 확인 (Exists 쿼리 요청)

2-1. 1이 true라면 해당 조건에 맞는 데이터 덮어쓰기 (update 쿼리 요청)
2-2. 1이 false라면 `chart`,`name`,`phone`이 같은 내용이 db에 존재하는지 확인 (Exists 쿼리 요청)

3-3. 2-2가 true라면 해당 조건에 맞는 데이터 덮어쓰기 (update 쿼리 요청)
3-2. 2-2가 false라면 db에 없는 데이터이므로 삽입 진행 (insert 쿼리 요청)

```
```
<수정된 데이터 저장 방식>
1. `chart`가 null이고 `name`, `phone`이 같은 내용이 db에 존재하는지 확인 (Exists 쿼리 요청)

2-1. 1이 true라면 해당 조건에 맞는 데이터 덮어쓰기 (update 쿼리 요청)
2-2. 1이 false라면 `chart`값이 있는지 확인, 있다면 -> 삽입, 삽입 도중 키값(`chart`,`name`,`phone`) 중복으로 오류 발생시 덮어쓰기 (insert-on duplicate key update 쿼리 요청)
2-3. 1이 false라면 `chart`값이 있는지 확인, 없다면 -> 삽입 진행 (insert 쿼리 요청)

```



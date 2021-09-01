# ✏️항해 최종 프로젝트 - Backend
## 웹사이트 주소
https://moyeora.org  
<br><br>
![헤쳐모여](https://user-images.githubusercontent.com/47944165/131612195-a6ef2741-f344-4c67-9e07-84e8d2f0b7df.png)


## 프로젝트 소개
실시간 위치 기반 소모임 플랫폼!


## 프로젝트 기간
2021년 7월 23일 ~ 2021년 9월 02일


## 1. 개발 인원
- 이용우 (Node.js) @ [archepro84](https://github.com/archepro84)
- 이해웅 (Node.js) @ [HW3542](https://github.com/HW3542)
- 임관식 (Node.js) @ [gwansiklim](https://github.com/gwansiklim)
- 주재인 (React) @ []()
- 황준연 (React) @ []()
- 김유진 (React) @ []()
- 서정화 (디자이너)
- 정지우 (디자이너)


## 2. 기술스텍

Front | Back
---|:---:
React | Node.js
Redux | Express
Axios | MySQL
'' | Redis
Socket.io | Socket.io
카카오맵 API | 카카오맵 API


## 3. 사용 라이브러리

라이브러리 | 설명
---|:---:
aws-sdk | AWS 서비스 호출
cookie-parser | 쿠키 저장
cors | 교차 리소스 공유
cypto-js | 비밀번호 암호화
dotenv | 환경변수 관리
express | 서버
express-session | 세션 관리
joi | 입력데이터 검출
jsonwebtoken | 서명 암호화
morgan | Http Log 기록
nunjucks | 템플릿 언어
chokidar | 파일 감시 라이브러리
redis | 캐시 메모리 DB 관리
georedis | 위치 정보 관리
request | 외부 API 요청
mysql | MySQL
sequelize | MySQL ORM
sequelize-cli | MySQL ORM Console
socket.io | Socket 통신
swagger-ui-express | API 문서화
artillery | 서버 부하 테스트

<br>

## 4. 아키텍처
![헤쳐모여 아키텍처](https://user-images.githubusercontent.com/49636918/131686936-176aa7b7-e40f-4ee4-a5de-c0ef1000c138.png)

<br>

## 5. DB ERD
![drawSQL-export-2021-09-01_22_37](https://user-images.githubusercontent.com/49636918/131681338-538513a2-1272-479b-92c3-6b95ce49420e.png)

<br>

## 6. API Document
https://docs.google.com/spreadsheets/d/11TuiaIZ62mFtalb1SdkpFQVbLejM8pN0hRjcK1keJn0/edit?usp=sharing  

<br>

## 7. 코드 리뷰 및 개선사항


### 1) Socket GeoRedis 연산 부하 문제 
#### 발생한 문제
- 기존에는 MySQL 사용자의 위치 정보를 GeoMetry Point 타입으로 저장하였지만, 서버 부하테스트를 진행하면서 실시간으로 주변 위치를 가공할 때 많은 부하를 발생하는 것을 확인하였습니다. 

#### 개선 방법
- Redis의 GEORADIUSBYMEMBER 함수를 사용할 경우 많은 부하를 들이지 않고 사용자 주변의 정보를 조회할 수 있다는 것을 확인했습니다.
- MySQL에서 사용하고 있던 사용자의 위치 정보를 Redis의 GeoMetry 데이터로 변경하여 사용자의 위치정보 가공속도를 향상 시킬 수 있었습니다.

![헤쳐모여 Socket 통신 구조](https://user-images.githubusercontent.com/49636918/131671829-b3aa9261-512a-48f2-9b16-412ee465d7a3.png)



<br><br>
### 2) 부하 테스트

#### 발생한 문제
- 현재 서버가 버틸 수 있는 부하량을 확인하여, 적절한 서버의 구성이 필요하다 생각하였습니다.
- 단순히 부하 테스트를 진행 할 때 일일히 사용자가 명령을 보내 테스트 하는 것은 비효율 적이라 생각하였습니다.

#### 개선 방법
- Artillery 모듈을 이용해 실시간으로 Express.js의 부하 테스트를 진행할 수 있었고, Socket.io에서 실시간으로 사용자의 위치 정보를 보내는 부하 테스트도 진행 할 수 있었습니다.

![헤쳐모여 리드미 부하 테스트 결과](https://user-images.githubusercontent.com/49636918/131679620-aab58342-ca5b-49ca-9f5d-3f38d6c395d3.png)

<br><br>
### 3) 테스트 코드 구성

#### 발생한 문제
- 팀원들이 동시에 코드를 수정하게 될 경우, 변경되는 사항이 일치하지않아 오류가 발생하였습니다.
- 코드를 수정할 때 마다 모든 API의 작동유무를 일일히 검사하는 것을 비효율 적이었습니다.

#### 개선 방법  
- Swagger를 이용해 모든 API를 문서화 하였고, 테스트할 수 있도록 구현하였습니다.
- Joi Schema 부터 모든 API에 이르기까지 Jest를 이용해 테스트 코드를 생성하였습니다.

<br><br>
### 4) 마이크로 서비스 아키텍처 구성

#### 발생한 문제
- EC2 단일 서버에서 Express.js, MySQL, Redis를 사용하여 많은 부하가 발생하였습니다.
- 부하테스트를 진행하였을 때 서버가 다운되어 MySQL의 데이터 사라지거나, Redis의 Key 데이터가 초기화 되는 등 데이터의 안정성을 보장 할 수 없었습니다.

#### 개선 방법
- EC2를 Express 단일 서버로 구성하였고, AWS ElastiCache로 Redis 서버의 데이터를 이관하였고, AWS RDS로 MySqL 5.7 서버의 데이터를 이관하였습니다.
- 단일 서버에서 모든것을 처리하는 모노리틱 아키텍처에서 모든 서버를 분리하여 관리하는 마이크로 서비스 아키텍처로 변경하였습니다.
- 부하 테스트를 진행하였을 때 견딜 수 있는 부하량이 늘어났고, 서버의 안정성을 확보할 수 있었습니다.

<br><br>
### 5) 서버 모니터링 구성

#### 발생한 문제
- 모니터링을 진행할 때 서버에 접속되어 있는 상황에서만 서버의 상태를 조회할 수 있었습니다.
- 부하테스트를 진행하였을 때 접속 오류가 발생해 실시간으로 서버의 CPU 및 메모리 사용량 조회가 불가능하였습니다.

#### 개선 방법
 - 분리되어있는 AWS 서버의 상황을 Cloudwatch를 이용하여 별도의 프로젝트를 생성하여 서버 모니터링을 진행하였습니다.
 - CPU 또는 Memory 사용량을 위젯으로 설정할 수 있었고, 이외의 AWS 서버의 속성을 실시간으로 모니터링 할 수 있었습니다.
 ![리드미 Cloud Watch](https://user-images.githubusercontent.com/49636918/131685197-4cc40327-9c14-46ca-b8ce-56f57fb7a57e.png)




<br><br>
## 8. Notion
https://www.notion.so/99-9-b3c6d3acc4cd489d8abda6c0b7f3c714

<br>

## 9. Front-End Git hub
https://github.com/demian0721/heturemoyeo

<br>

## 10. Youtube


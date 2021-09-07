# ✏️항해 최종 프로젝트 - Backend
![헤쳐모여](https://user-images.githubusercontent.com/47944165/131612195-a6ef2741-f344-4c67-9e07-84e8d2f0b7df.png)


## 🏠 [Home Page](https://moyeora.org) / [Youtube](https://youtu.be/MpwPiutwqaY)
- 주변 사람들을 손쉽게 만나고 소통하기 위한, 실시간 위치기반 소모임 플랫폼!

## 🚩 프로젝트 소개
#### 실시간 위치 기반 소모임 플랫폼!

 - 👫 우리동네, 같은 취미를 가진 사람을 만나고 싶으신가요?
 - 🗺 사소한 일상에서부터 다양하고 색다른 경험까지 찾을 수 있는 곳!
 - 🎮당신과의 만남을 기다리고 있는 이웃을 만나보세요.


## 🗓 프로젝트 기간
2021년 7월 23일 ~ 2021년 9월 02일


## 👥 개발 인원
- 이용우 (Node.js) [팀장] @ [archepro84](https://github.com/archepro84)
- 이해웅 (Node.js) @ [HW3542](https://github.com/HW3542)
- 임관식 (Node.js) @ [gwansiklim](https://github.com/gwansiklim)
- 주재인 (React) @ [joonior99](https://github.com/joonior99)
- 황준연 (React) @ [yoojin-kim90](https://github.com/yoojin-kim90)
- 김유진 (React) @ [demian0721](https://github.com/demian0721)
- 서정화 (디자이너)
- 정지우 (디자이너)


## 🛠 기술스택

Front | Back
---|:---:
React | Node.js
Redux | Express
Axios | MySQL
'' | Redis
Socket.io | Socket.io
카카오맵 API | 카카오맵 API


## 📖 라이브러리

라이브러리 | 설명
---|:---:
<img src='https://img.shields.io/badge/cookie--parser-1.4.5-lightgrey'>  | 쿠키 저장
<img src='https://img.shields.io/badge/cors-2.8.5-lightgrey'> | 교차 리소스 공유
<img src='https://img.shields.io/badge/crypto--js-4.1.1-lightgrey'> | 비밀번호 암호화
<img src='https://img.shields.io/badge/dotenv-10.0.0-lightgrey'>  | 환경변수 관리
<img src='https://img.shields.io/badge/express-4.17.1-lightgrey'> | 서버
<img src='https://img.shields.io/badge/express--session-1.17.2-lightgrey'> | 세션 관리
<img src='https://img.shields.io/badge/joi-17.4.1-lightgrey'>  | 입력데이터 검출
<img src='https://img.shields.io/badge/jsonwebtoken-8.5.1-lightgrey'>  | 서명 암호화
<img src='https://img.shields.io/badge/morgan-1.10.0-lightgrey'> | Http Log 기록
<img src='https://img.shields.io/badge/nunjucks-3.2.3-lightgrey'> | 템플릿 언어
<img src='https://img.shields.io/badge/chokidar-2.8.5-lightgrey'> | 파일 감시 라이브러리
<img src='https://img.shields.io/badge/redis-3.1.2-lightgrey'>  | 캐시 메모리 DB 관리
<img src='https://img.shields.io/badge/georedis-3.1.3-lightgrey'>  | 위치 정보 관리
<img src='https://img.shields.io/badge/request-2.88.2-lightgrey'> | 외부 API 요청
<img src='https://img.shields.io/badge/mysql-2.18.1-lightgrey'> | MySQL
<img src='https://img.shields.io/badge/sequelize-6.6.5-lightgrey'>  | MySQL ORM
<img src='https://img.shields.io/badge/sequelize--cli-6.2.0-lightgrey'> | MySQL ORM Console
<img src='https://img.shields.io/badge/socket.io-4.2.0-lightgrey'> | Socket 통신
<img src='https://img.shields.io/badge/jest-27.0.6-lightgrey'>  | 테스트 코드
<img src='https://img.shields.io/badge/swagger--ui--express-4.1.6-lightgrey'> | API 문서화
<img src='https://img.shields.io/badge/artillery-1.7.7-lightgrey'> | 서버 부하 테스트


<br>

## 📚 프로젝트 아키텍처
![헤쳐모여 아키텍처](https://user-images.githubusercontent.com/49636918/131686936-176aa7b7-e40f-4ee4-a5de-c0ef1000c138.png)

<br>

## 🗃 DB ERD
![drawSQL-export-2021-09-01_22_37](https://user-images.githubusercontent.com/49636918/131681338-538513a2-1272-479b-92c3-6b95ce49420e.png)

<br>

## 📋 [API Document](https://docs.google.com/spreadsheets/d/11TuiaIZ62mFtalb1SdkpFQVbLejM8pN0hRjcK1keJn0/edit?usp=sharing)

## 📂 [Project Board](https://www.notion.so/99-9-b3c6d3acc4cd489d8abda6c0b7f3c714)

## 🔨 [Front-End Git hub](https://github.com/demian0721/heturemoyeo)


## 📌 코드 리뷰 및 개선사항


### 1) Socket GeoRedis 연산 부하 문제 
#### 발생한 문제
- 기존에는 MySQL 사용자의 위치 정보를 GeoMetry Point 타입으로 저장하였지만, 서버 부하 테스트를 진행하면서 실시간으로 주변 위치를 가공할 때 많은 부하를 발생하는 것을 확인하였습니다. 

#### 개선 방법
- Redis의 GEORADIUSBYMEMBER 함수를 사용할 경우 많은 부하를 들이지 않고 사용자 주변의 정보를 조회할 수 있다는 것을 확인했습니다.
- MySQL에서 사용하고 있던 사용자의 위치 정보를 Redis의 GeoMetry 데이터로 변경하여 사용자의 위치정보 가공속도를 향상 시킬 수 있었습니다.

![헤쳐모여 Socket 통신 구조](https://user-images.githubusercontent.com/49636918/131671829-b3aa9261-512a-48f2-9b16-412ee465d7a3.png)



<br><br>
### 2) Express API 부하 테스트

#### 발생한 문제
- 현재 서버가 버틸 수 있는 부하량을 확인하여, 적절한 서버의 구성이 필요하다고 생각하였습니다.
- 단순히 부하 테스트를 진행할 때 일일이 사용자가 명령을 보내 테스트하는 것은 비효율적이라 생각하였습니다.

#### 개선 방법
- Artillery 모듈을 이용해 실시간으로 Express.js의 부하 테스트를 진행할 수 있었고, Socket.Io에서 실시간으로 사용자의 위치 정보를 보내는 부하 테스트도 진행 할 수 있었습니다.

![헤쳐모여 리드 미 부하 테스트 결과](https://user-images.githubusercontent.com/49636918/131679620-aab58342-ca5b-49ca-9f5d-3f38d6c395d3.png)


### 3) Socket 부하 테스트

#### 발생한 문제
- 현재 서버가 버틸 수 있는 부하량을 확인하여, 적절한 서버의 구성이 필요하다고 생각하였습니다.
- 실시간으로 사용자의 위치를 입력 및 조회하는 기능의 한도를 확인할 수 있어야 안전한 서버 구현이 가능할 것으로 생각하였습니다.

#### 개선 방법
- Artillery 모듈에서는 Socket.Io-v3의 Header를 지원하지 않아 사용자 인증을 받을 수 없었습니다.
- 차선책으로 자체 제작한 더미 소켓 클라이언트를 생성하여 테스트하였습니다.
- 1,000명의 소켓을 테스트했을 때 EC2: 20%, Redis: 9%의 CPU 할당량을 보였습니다.
- 1,000명의 소켓을 테스트했을 때 Redis의 메모리 할당량이 1%에서 1.6%로 상승하였습니다.

![헤쳐모여 소켓 부하 테스트](https://user-images.githubusercontent.com/49636918/132089052-e0eaf4a3-c515-4457-9053-92ff207f1dcf.png)

<br><br>
### 4) 테스트 코드 구성

#### 발생한 문제
- 팀원들이 동시에 코드를 수정하게 될 경우, 변경되는 사항이 일치하지 않아 오류가 발생하였습니다.
- 코드를 수정할 때마다 모든 API의 작동 여부를 일일이 검사하는 것이 비효율적이었습니다.

#### 개선 방법  
- Swagger를 이용해 모든 API를 문서화하였고, 테스트할 수 있도록 구현하였습니다.
- Joi Schema부터 모든 API에 이르기까지 Jest를 이용해 테스트 코드를 생성하였습니다.

<br><br>
### 5) 모노리틱 아키텍처 벗어나기

#### 발생한 문제
- EC2 단일 서버에서 Express.js, MySQL, Redis를 사용하여 많은 부하가 발생하였습니다.
- 부하 테스트를 진행하였을 때 서버가 다운되어 MySQL의 데이터 사라지거나, Redis의 Key 데이터가 초기화되는 등 데이터의 안정성을 보장할 수 없었습니다.

#### 개선 방법
- EC2를 Express 단일 서버로 구성하였고, AWS ElastiCache로 Redis 서버의 데이터를 이관하였고, AWS RDS로 MySQL 5.7 서버의 데이터를 이관하였습니다.
- 단일 서버에서 모든 것을 처리하는 모노리틱 아키텍처에서 모든 서버를 분리하여 관리하는 마이크로 서비스 아키텍처로 변경 하기위해 노력하였습니다.
- 부하 테스트를 진행하였을 때 견딜 수 있는 부하량이 늘어났고, 서버의 안정성을 확보할 수 있었습니다.

<br><br>
### 6) 서버 모니터링 구성

#### 발생한 문제
- 모니터링을 진행할 때 서버에 접속된 상황에서만 서버의 상태를 조회할 수 있었습니다.
- 부하 테스트를 진행하였을 때 접속 오류가 발생해 실시간으로 서버의 CPU 및 메모리 사용량 조회가 불가능하였습니다.

#### 개선 방법
 - 분리되어있는 AWS 서버의 상황을 Cloudatch를 이용하여 별도의 프로젝트를 생성하여 서버 모니터링을 진행하였습니다.
 - CPU 또는 Memory 사용량을 위젯으로 설정할 수 있었고, 이외의 AWS 서버의 속성을 실시간으로 모니터링할 수 있었습니다.
 ![리드 미 Cloud Watch](https://user-images.githubusercontent.com/49636918/131685197-4cc40327-9c14-46ca-b8ce-56f57fb7a57e.png)




<br><br>

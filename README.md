# ✏️항해 최종 프로젝트 - Backend
## 웹사이트 주소

https://moyeora.org
![헤쳐모여](https://user-images.githubusercontent.com/47944165/131612195-a6ef2741-f344-4c67-9e07-84e8d2f0b7df.png)


## 프로젝트 소개
GPS 기반 소규모 모임 플랫폼입니다.

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
---|---:
React | Node.js
Redux | Express
Axios | MySQL
WebSocket | WebSocket
카카오맵 api | 카카오맵 api
| Redis


## 3. 사용 라이브러리

라이브러리 | 설명
---|:---:
cors | 교차 리소스 공유
dotenv | DB비밀번호, 시크릿키 암호화
express | 서버
jsonwebtoken | 회원가입 작동 방식
sequelize | MySQL ORM
sequelize-cli | MySQL ORM Console
mysql | MySQL
cookie-parser | 쿠키 저장
joi | 입력데이터 검출

## 4. DB ERD
![image](https://blog.kakaocdn.net/dn/csyYol/btq99nLz5sx/Myv5qyQoMMmqDA1IKj3Km0/img.png)


## 5. 코드 리뷰 및 개선사항

### 1) 검색
- 게시글을 검색할 때 Sequelize Law Query를 이용해 검색을 구현했습니다. 6개의 테이블을 각 테이블의 관계에 맞도록 조회하였습니다. Sub Query를 많이 사용해 DB에서 과부하 되지 않을까? 라는 생각을 하였지만, 최적화에 대한 문제를 더 파고들지 못한 부분이 아쉬웠습니다.

```SQL
SELECT u.userId, u.nickname, u.profileImg, p.postId, p.reBlog, p.title,
(SELECT GROUP_CONCAT(img ORDER BY img ASC SEPARATOR ', ')
    FROM Images
    WHERE postId = p.postId
    GROUP BY postId) AS img,
p.content,
(SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ', ')
    FROM Tags
    WHERE postId = p.postId
    GROUP BY postId) AS tag,
CASE WHEN p.postId IN (SELECT postId FROM Favorites WHERE userId=${userId}) THEN "Y" ELSE "N" END AS favorite,
(SELECT COALESCE(MIN('Y'), 'N')
    FROM Follows
    WHERE EXISTS (SELECT 1 FROM  Follows WHERE followUserId = ${userId} AND followerUserId=p.userId)) AS follow,
(SELECT COUNT(*) FROM Favorites WHERE postId=p.postId) AS reactionCount,
p.createdAt
FROM Posts AS p
INNER JOIN Users AS u
USING(userId)
WHERE p.title LIKE '%${keyword}%' 
    OR p.content LIKE '%${keyword}%'
    OR postId IN (SELECT postId FROM Tags WHERE tag LIKE '%${keyword}%') 
ORDER BY p.createdAt DESC
LIMIT ${start},${limit} 
```

### 2) 팔로우
- Follower, Following기능을 구현하였습니다.
``` SQL
SELECT
CASE WHEN ${followerUserId} IN (SELECT userId FROM Users) THEN 'Y' ELSE 'N' END AS isExist,
COALESCE(MIN('Y'), 'N') AS Following
FROM Follows
WHERE EXISTS ( SELECT 1 
             FROM Follows 
             WHERE followUserId = ${followUserId} AND followerUserId = ${followerUserId});
```


### 3) 알람

- MySQL에서 Trigger를 사용해 팔로우, 좋아요, 리블로그가 추가될 경우 자동으로 Alarms 테이블에 데이터를 삽입하도록 설정하였습니다. DB와 서버 간의 불필요한 통신과 추가적인 작업을 줄여 최적화시키는데 활용하였습니다.

```SQL
CREATE TRIGGER TR_Posts_reBlog_Alarm
    AFTER INSERT ON Posts
    FOR EACH ROW
    BEGIN
        IF (NEW.reBlog IS NOT NULL) THEN 
            INSERT INTO Alarms (giverUserId, receiverUserId, type, createdAt, updatedAt) values
                (NEW.userId, (SELECT userId FROM Posts WHERE postId = NEW.reBlog), 2, NOW(), NOW() );
        END IF;
    END
```

### 4) 이미지 및 태그
- 게시글에서 여러 개의 이미지와 태그를 관리하기 위해 별도의 테이블을 구성하였고, 이미지 및 태그 테이블을 조회할 때 GROUP_CONCAT을 사용하여 하나의 레코드로 구현하였습니다.

```SQL
SELECT GROUP_CONCAT(img ORDER BY img ASC SEPARATOR ', ')
    FROM Images
    WHERE postId = p.postId
    GROUP BY postId
    
SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ', ')
    FROM Tags
    WHERE postId = p.postId
    GROUP BY postId
```

### 5) 게시글 반응
- 게시글을 좋아요 하거나 리블로그 한 사람들의 목록을 순차적으로 볼 수 있습니다.

```SQL
SELECT u.userId, u.nickname, 2 AS type, u.profileImg, p.createdAt
FROM Posts AS p
INNER JOIN Users AS u
ON p.userId = u.userId 
WHERE reBlog = ${postId}

UNION ALL

SELECT u.userId, u.nickname, 3 AS type, u.profileImg, f.createdAt
FROM Favorites AS f
INNER JOIN Users AS u
ON f.userId = u.userId
WHERE f.postId = ${postId}

ORDER BY createdAt DESC
LIMIT ${start},${limit} 
```

## 6. Notion
https://www.notion.so/99-1-3c5a2aec7ac94d46b8d1e95d4e873bb8

## 7. Front-End Git hub
https://github.com/HseongH/Tumblr_clone

## 8. Youtube
https://www.youtube.com/watch?v=HLYTArLgdeY

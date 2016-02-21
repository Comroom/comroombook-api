### 컴실북 백엔드 서버
#### 팀원
- 최인호
- 김영호

#### 필요 프레임워크/라이브러리
- Node.js
- express : REST API Framework
- nedb : Simple Database

#### 사용방법
`npm install`

`npm start`

#### REST API 기능 설명
- 로그인/회원가입
    - DB 회원정보 user
        - 이름
        - 이메일주소
        - 비밀번호
        - 참가 채팅리스트
    - 회원가입 (/user/signup) POST
        - Application/JSON
        - { "name" : 이름, "email": 이메일주소, "password" : 비밀번호 }
    - 로그인 (/user/login) POST
- 동아리 전체 시간표
    - DB time
        - 요일 (day)
        - 시작시간 (start - 형식 HH:MM 30 분단위)
        - 종료시간 (end - 형식 HH:MM 30분 단위)
        - 유저정보 (userid)
        - 제목 (title)
        - 세부내용 (detail)
    - 시간표 시간 가져오기 (/time) GET
    - 시간표 시간 지우기 (/time) DELETE
       - Application/JSON
       - { "time_id" : "시간 정보 아이디" }
    - 시간표 시간 입력하기 (/time) POST
        - Application/JSON
        - { "day" : 요일, "start" : 날짜, "end" : 날짜, "userid" : 유저아이디, "title" : 제목, "detail" : 세부내용 }
- 그룹 채팅방
    - DB chatlist  
        - 생성된 날짜
        - 이름
        - 인원[]
    - 그룹만들기 (/chat/list) POST
        - Application/JSON
        - { "userid" : 유저아이디, "name" : 그룹네임 }
    - 그룹리스트 가져오기 (/chat/list) GET
    - DB chatmessage
        - 유저아이디
        - 이름
        - 그룹아이디
        - 메세지(채팅내용)
        - 날짜
    - 채팅입력하기 (/chat/:groupid) POST
        - Application/JSON
        - { "userid" : 유저아이디, "mesaage" : 채팅내용 }
    - 채팅가져오기 (/chat/:groupid) GET
- 개인메시지 : 쪽지기능
    - DB message  
        - 보낸 사람
        - 받는 사람
        - 메세지
    - 메세지 보내기 (/message/:userid) POST
        - Application/JSON
        - { "message" : 메세지내용 }
    - 메세지 얻어오기 (/message/:userid) GET
- 그룹 초대하는 기능 ( 카톡 API / 메일초대)

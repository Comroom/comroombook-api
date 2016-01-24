### 컴실북 백엔드 서버
#### 팀원
- 최인호
- 김영호

#### 필요 라이브러리
- express
- nedb

#### REST API 기능 설명
##### 기능 이름 (router)
- 로그인/회원가입
    - 회원정보 user (/user)
        - 이름
        - 이메일주소 
        - 비밀번호 
- 동아리 전체 시간표
    - https://github.com/alamkanak/Android-Week-View
    - DB time (/time)
        - 시작시간
        - 종료시간
        - 유저정보
        - 제목
        - 세부내용
- 그룹 채팅방 
    - DB chatlist (/chat/list)
        - 생성된 날짜
        - 처음만든 사람
        - 이름
        - 인원[]
    - DB chatmessage (/chat)
        - user_id
        - name
        - group_id
        - message
        - date
    - Socket.io 이벤트형식
    - …. 등등
- 개인메시지 : 쪽지기능
    - DB message (/message)
        - 보낸 사람
        - 받는 사람
        - 메세지
- 그룹 초대하는 기능 ( 카톡 API / 메일초대)

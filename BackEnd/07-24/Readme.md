### AJAX(Asynchronous Javascript And XML)
- AJAX란, JavaScript의 라이브러리중 하나이며, HTML, CSS, 자바스크립트, DOM, XML 등 기존에 사용되던 여러 기술을 함께 사용하는 새로운 개발 기법입니다.
- 브라우저가 가지고있는 XMLHttpRequest 객체를 이용해서 전체 페이지를 새로 고치지 않고도 페이지의 일부만을 위한 데이터를 로드하는 기법이며, JavaScript를 사용한 비동기 통신, 클라이언트와 서버간에 XML 데이터를 주고받는 기술입니다.
- 즉, 쉽게 말하자면 자바스크립트를 통해서 서버에 데이터를 요청하는 것입니다.
- 참고: https://daegwonkim.tistory.com/445
    https://hstory0208.tistory.com/entry/%EB%B9%84%EB%8F%99%EA%B8%B0-%ED%86%B5%EC%8B%A0-Ajax%EC%99%80-Axios%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90


### PUT & PATCH 메소드
PUT과 PATCH 모두 데이터를 수정할 때 사용한다.
하지만 꼭 수정할 때 PUT 또는 PATCH를 사용할 필요는 없다.
일반적으로 POST를 등록/수정에 주로 사용한다.
- PUT: 기존의 모든 것을 수정
- PATCH: 일부 부분적인 수정


### 와일드카드
와일드카드를 사용한 라우팅 메서드는 가장 아래에 선언해야 한다.
그렇지 않으면 aid = 1 = delete?aid=1 이들 모두 같다고 인식한다.

Ex)
- http://localhost:3000/api/articles/1
- http://localhost:3000/api/articles/delete?aid=1

와일드 카드는 주소체계가 같으면 뒤쪽을 값으로 인식한다.


### 미들웨어
응답 전에 미들웨어를 먼저 실행하게 하여 특정 로직을 태운다.
라우팅 메소드를 호출할 때, 호출 주소와 콜백함수 사이에 미들웨어를 추가한다.
-> 미들웨어를 통해 로그인 여부를 체크할 수 있다.

참고: https://velog.io/@unyoi/%EC%9D%B8%ED%94%84%EB%9D%BC-%EB%BF%8C%EC%8B%9C%EA%B8%B01-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4-%EA%B0%9C%EB%85%90%EC%9D%84-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90

### EJS
- 라우팅 메소드에서 view에 전달된 데이터 출력하려면 =을 쓴다.
    -> <%=데이터 속성명%>

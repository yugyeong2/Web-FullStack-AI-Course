### AJAX(Asynchronous Javascript And XML)
- AJAX란, JavaScript의 라이브러리중 하나이며, HTML, CSS, 자바스크립트, DOM, XML 등 기존에 사용되던 여러 기술을 함께 사용하는 새로운 개발 기법입니다.
- 브라우저가 가지고있는 XMLHttpRequest 객체를 이용해서 전체 페이지를 새로 고치지 않고도 페이지의 일부만을 위한 데이터를 로드하는 기법이며, JavaScript를 사용한 비동기 통신, 클라이언트와 서버간에 XML 데이터를 주고받는 기술입니다.
- 즉, 쉽게 말하자면 자바스크립트를 통해서 서버에 데이터를 요청하는 것입니다.
- 참고: https://daegwonkim.tistory.com/445
    https://hstory0208.tistory.com/entry/%EB%B9%84%EB%8F%99%EA%B8%B0-%ED%86%B5%EC%8B%A0-Ajax%EC%99%80-Axios%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90


### PUT & PATCH 메소드
PUT과 PATCH 모두 데이터를 수정할 때 사용한다.
하지만 꼭 수정할 때 PUT 또는 PATCH를 사용할 필요는 없다.
일반적으로는 POST를 등록/수정에 주로 사용한다.
- PUT: 기존의 모든 것을 수정
- PATCH: 일부 부분적인 수정


### 와일드카드
와일드카드를 사용한 라우팅 메서드는 가장 아래에 선언해야 한다.
그렇지 않으면 aid = 1 = delete?aid=1 이들 모두 같다고 인식한다.

Ex)
- http://localhost:3000/api/articles/1
- http://localhost:3000/api/articles/delete?aid=1

와일드 카드는 주소체계가 같으면 뒤쪽을 값으로 인식한다.
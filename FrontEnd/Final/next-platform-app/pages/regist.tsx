// 신규 회원가입 페이지 컴포넌트
// 호출 주소: http://localhost:3003/regist

// 화면 상에 데이터 관리를 위한 useState 훅 참조
import { useState } from 'react';

// 프론트엔드 라우팅 주소 이동처리를 위한 useRouter() 훅 참조
import { useRouter } from 'next/router';

// 신규 회원 가압 정보 인터페이스 타입 참조
import { IEntryMember } from '@/interfaces/member';

const Regist = () => {
  // useRouter 훅
  const router = useRouter();

  // 신규 회원가입 정보 상태 데이터 정의 및 값 초기화 처리
  // useState(초기값 설정) 함수는 [변수, 변수 값 변경 세터 함수] 배열을 반환한다.
  const [member, setMember] = useState<IEntryMember>({
    email: '',
    password: '',
    nickname: '',
  });

  // 사용자 입력 요소의 값이 변경될 때마다 데이터 소스와 동기화 처리해주는 이벤트 처리 함수
  // 사용자가 form에 입력을 할 때마다 바뀐다.
  const memberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ...member란, 현재 member 상수의 복사본 객체를 생성한다는 의미이다.
    // e.target은 Change 이벤트가 발생한 UI 요소를 말한다.
    // [e.target.name -> 이벤트가 발생한 요소의 name 속성 값]: e.target.value -> 이벤트가 발생한 요소의 현재 입력 value 값
    // -> 현재 객체의 복사본을 만들고, 새로운 객체를 던진다.
    // -> 이벤트가 발생한 html 요소를 찾아(name 속성의 값을 가져온다.), 동적 속성
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  // 회원가입 버튼 클릭 시 회원정보 백엔드 처리 함수
  const registSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault(); 함수는 Form submit 이벤트가 호출되면,
    // 어떤 식으로든 화면을 리프레시하는 기능이 작동되므로 해당 form submit 이벤트를 취소하여, 화면이 리프레시되는 현상을 방지한다.
    // -> action이 지정되어 있는 이벤트가 발생하면 현재 화면을 다시 불러온다.
    e.preventDefault(); // form 태그의 submit 기본 이벤트를 차단한다.

    try {
      // Step 1) fetch() 함수 호출하기
      // 백엔드 RESTful API 중 신규 회원가입 API를 fetch()의 AJAX 호출 기능을 통해 가입 정보를 백엔드로 전달한다.
      // Ex) ES2015 자바스크립트 기본 AJAX 통신 내장 라이브러리인 fetch()를 이용해 백엔드와 통신한다.
      // await fetch("백엔드 API 호출주소", 호출 옵션);
      // fetch() 함수를 통해 데이터를 백엔드로 전달할 때는 반드시 JSON 문자열 형태로 전달한다.
      // JSON.stringify(JSON데이터): JSON 데이터를 JSON 문자열로 변경해주는 내장함수
      const response = await fetch('http://localhost:5000/api/member/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // 프론트엔드에서 제공하는 데이터 타입의 유형을 지정한다.
        body: JSON.stringify(member),
      });

      // Step 2) fetch() 함수 호출 결과 벡앤드에서 반환되는 실제 데이터 추출하기
      const result = await response.json();

      if (result.code == 200) {
        console.log('회원가입 성공, 백엔드에서 제공한 JSON 데이터:', result);

        // 정상적으로 회원가입 된 경우 로그인 페이지 컴포넌트로 이동 처리
        // router.push('이동시키고자 하는 프론트엔드 도메인 주소를 제외한 url 주소 정보');
        router.push('/login');
      } else {
        console.log('회원가입 중 백엔드 서버 에러 발생:', result.message);

        if(result.code == 400 && result.message == 'ExistMember, 동일한 메일이 존재합니다.') {
          alert('이미 가입된 회원입니다. 다른 이메일 주소를 입력해주세요.');
          return false;
        }

      }
    } catch (error) {
      console.error('백엔드 회원가입 REST API 호출 중 에러 발생:', error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Regist your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* 신규 회원가입 form 영역 */}
          {/* 어떤 액션이 일어나면 onSubmit가 실행되어 registSubmit 함수가 호출된다. */}
          <form className="space-y-6" onSubmit={registSubmit}>
            {/* 메일 주소 입력 요소 영역 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={member.email}
                  onChange={memberChange} // input 타입의 이벤트 헨들러 함수(name 값과 객체의 속성 이름을 동일하게 한다.)
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 비밀번호 입력 요소 영역 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={member.password}
                  onChange={memberChange}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 사용자 이름 입력 요소 영역 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={member.nickname}
                  onChange={memberChange}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Regist
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Regist;

import { useState, useContext } from 'react';
import { useRouter } from 'next/router';

// 전역 컨텍스트 참조
import { GlobalContext } from '@/library/globalContext';
import { ILoginMember } from '@/interfaces/member';
import { IGlobalData, IGlobalMember } from '@/interfaces/global';

// 로그인 화면 컴포넌트
const Login = () => {

  // 라우터 객체 생성 
  const router = useRouter();
  
  // 전역 상태값 변경을 위한 컨텍스트 객체 생성
  // 전역 상태값을 불러오거나 값을 변경할 수 있게 변수와 세터함수 참조
  const { globalData, setGlobalData } = useContext(GlobalContext);

  // 로그인 사용자 정보 상태 관리 데이터 초기화
  const [ member, setMember ] = useState<ILoginMember>({
    email: '',
    password: ''
  });

  // 로그인 UI 요소(email, password)를 사용자가 입력할 시 데이터 동기화 처리 함수
  const memberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  }

  // 로그인 버튼 클릭 시 로그인 정보를 백엔드 API에 전달하여 JWT 토큰 정보를 받아온다.
  const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 백엔드 Login Restful API 호출
    // Case 1: 웹브라우저 자바스크립트 엔진에 탑재되어 있는 fetch 함수를 통해 백엔드 Restful Login API를 호출
    try {
      const response = await fetch('http://localhost:5000/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(member)
      })

      // 통신 결과 로그인 API에서 반환한 JSON 데이터 값 추출
      const result = await response.json();
      console.log('로그인 API에서 반환한 요청 결과 값:', result);

      if(result.code == 200) {
        console.log('로그인 성공:', result);

        // Step1: 백엔드에서 제공한 JWT 토큰 값을 웹브라우저의 localStorage 저장소에 저장
        localStorage.setItem('token', result.data.token);

        // Step2: 추후 Context API의 전역데이터로 사용자 정보 저장
        // 로그인한 사용자 정보를 전역 상태의 member 속성값으로 저장
        setGlobalData(
          { token: result.data.token,
            member: {
              member_id: result.data.member.member_id,
              name: result.data.member.name,
              email: result.data.member.email
            }
          }
        );

        // Step3: 메인 페이지로 이동 처리
        router.push('/');

      } else {
        if(result.code == 400 && result.message == 'NotExistEmail: 이메일이 존재하지 않습니다.') {
          alert('해당 이메일이 존재하지 않습니다.');
          return false;
        }

        if(result.code == 400 && result.message == 'IncorrectPassword: 암호가 일치하지 않습니다.') {
          alert('암호가 일치하지 않습니다.');
          return false;
        }

        if(result.code == 500 && result.message == 'ServerERR: 자세한 내용은 백엔드에 문의해주세요.') {
          alert('서버 에러가 발생했습니다. \n자세한 내용은 관리자에게 문의해주세요.');
          return false;
        }
      }

    } catch(error) {
      console.log('로그인 중 백엔드 API 호출 에러 발생:', error)
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
            Sign in to your account
          </h2>
        </div>

        {/* 로그인 화면 영역 */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* onSubmit이 발생하면 이를 처리하는 loginSubmit 함수 */}
          <form className="space-y-6" onSubmit={loginSubmit}>
            {/* 메일 입력 영역 */}
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
                  onChange={memberChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* 비밀번호 입력 영역 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
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

              {/* 로그인 버튼 */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

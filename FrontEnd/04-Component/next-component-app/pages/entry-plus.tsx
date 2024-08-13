// 오픈소스 UI 라이브러리 기능 참조
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Field, Label, Switch } from '@headlessui/react';

// useState 상태관리 훅을 참조
import React, { useState } from 'react';
import { errorToJSON } from 'next/dist/server/render';

// Member Type Alias 정의
type MemberType = {
    name: string;
    password: string;
    email: string;
    telephoneType: number;
    telephone: string;
    introduction: string;
    agree: boolean;
};

// Member Interface 정의
interface MemberInterface {
    name: string;
    password: string;
    email: string;
    telephoneType: number;
    telephone: string;
    introduction: string;
    agree: boolean;
}

const EntryPlus = () => {

    // 객체 기반 상태 관리하기
    // 상태 관리 데이터를 객체를 이용해 일괄 데이터 관리하기
    const [member, setMember] = useState<MemberType>({
        name: '',
        password: '',
        email: '',
        telephoneType: 0,
        telephone: '',
        introduction: '',
        agree: false,
    });

    // Input 요소 타입 단일 이벤트 핸들러 정의
    // 화면 내 모든 HTMLInputElement 요소의 onChange 이벤트 핸들러 단일 처리함수로 처리
    const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        /*
        ! 참조형 데이터(객체, 배열)의 변경은 반드시 참조형 데이터의 복사본을 생성하고, 해당 복사본의 속성을 변경해야 한다. -> 불변성
        !  ...member는 해당 객체의 복사본을 반드다는 의미이며, 복사본의 해당 UI 요소의 name 값을 이용해 객체 속성의 값을 변경한다.
        ! -> member 객체의 실제 복사본 객체를 만들고, 복사본 객체의 특정속성["속성명"]을 지정하고, 값을 변경한 후 복사본을 setMember()함수의 값을 맴버 객체값을 변경한다.
         */
        console.log('onChange 이벤트가 발생한 UI 요소의 name 특성 값:', e.target.name);
        console.log('onChange 이벤트가 발생한 UI 요소의 value 특성 값:', e.target.value);

        setMember({ ...member, [e.target.name]: e.target.value });
        /*
        ! 단일 객체를 만들어 엎어 친다. -> 기존의 객체의 복사본을 만들고, 그 속성값을 바꾼다.
        ! 동적속성: [속성값]: 바꿀 내용 -> 있으면 바꾸고, 없으면 만든다.
        ! e.target.value: 이벤트가 발생한 HTML의 value값을 가져온다.
        ! input 요소에서 이벤트(e)가 발생했을 때, handler 반응
         */
    };

    const handleTelephoneTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        // member 복사본 객체의 telephoneType 속성값을 변경해서, 최종 변경된 복사본 객체를 setMember()함수의 인자값을 전달한다.
        setMember({ ...member, telephoneType: Number(e.target.value) });
        // setMember({...member, [e.target.name]: Number(e.target.value)}); -> 동적 속성 가능(단 name 값과 객체 속성이 같아야 한다.)
    };

    const handleIntroductionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setMember({ ...member, introduction: e.target.value });
        // 현재 member 객체를 복사하고, introduction이라는 타입을 e.target.value 값으로 바꾼다.
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         // 체크박스 요소의 체크여부(불린형)값을 가져와서 상태값으로 변경하기
        setMember({ ...member, agree: e.target.checked });
    };

    // 회원가입 버튼 클릭 시 onSubmit 이벤트 처리기 함수 정의
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 백엔드 API에 member state 객체를 바로 전달한다.
        console.log('백엔드로 전달할 회원가입 데이터:', member);
    };

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        >
            <div
            style={{
                clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            />
        </div>
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            신규 회원 가입
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
            사용자 정보를 입력해주세요.
            </p>
        </div>
        <form
            className="mx-auto mt-16 max-w-xl sm:mt-20"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
                <label
                htmlFor="name"
                className="block text-sm font-semibold leading-6 text-gray-900"
                >
                이름
                </label>
                <div className="mt-2.5">
                <input
                    id="name"
                    name="name" // ! name값이 멤버 객체의 property 값과 동일해야 한다.
                    type="text"
                    value={member.name} // !name과 value 값이 같아아야 한다.
                    onChange={handleMemberInputChange}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div>
                <label
                htmlFor="password"
                className="block text-sm font-semibold leading-6 text-gray-900"
                >
                암호
                </label>
                <div className="mt-2.5">
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={member.password}
                    onChange={handleMemberInputChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>

            <div className="sm:col-span-2">
                <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
                >
                메일주소
                </label>
                <div className="mt-2.5">
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={member.email}
                    onChange={handleMemberInputChange}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label
                htmlFor="telephone"
                className="block text-sm font-semibold leading-6 text-gray-900"
                >
                연락처
                </label>
                <div className="relative mt-2.5">
                <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="telephoneType" className="sr-only">
                    연락처 유형
                    </label>
                    <select
                    id="telephoneType"
                    name="telephoneType"
                    value={member.telephoneType}
                    onChange={handleTelephoneTypeChange}
                    className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                    <option value={0}>핸드폰</option>
                    <option value={1}>집전화</option>
                    <option value={2}>회사전화</option>
                    </select>
                    <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                    />
                </div>
                <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={member.telephone}
                    onChange={handleMemberInputChange}
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 px-3.5 py-2 pl-32 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label
                htmlFor="introduction"
                className="block text-sm font-semibold leading-6 text-gray-900"
                >
                자기소개
                </label>
                <div className="mt-2.5">
                <textarea
                    id="introduction"
                    name="introduction"
                    value={member.introduction}
                    onChange={handleIntroductionChange}
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <Field className="flex gap-x-4 sm:col-span-2">
                <div className="flex h-6 items-center">
                {/* <Switch
                            // checked={agree}
                            // onChange={setAgree}
                            className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
                        >
                            <span className="sr-only">Agree to policies</span>
                            <span
                            aria-hidden="true"
                            className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                            />
                        </Switch> */}

                <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    // value={member.agree}
                    checked={member.agree}
                    onChange={handleCheckboxChange}
                />
                </div>
                <Label className="text-sm leading-6 text-gray-600">
                <a href="#" className="font-semibold text-indigo-600">
                    개인정보보호정책
                </a>
                에 동의합니다.
                </Label>
            </Field>
            </div>
            <div className="mt-10">
            <button
                type="submit"
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                가입신청
            </button>
            </div>
        </form>
        </div>
    );
};

export default EntryPlus;
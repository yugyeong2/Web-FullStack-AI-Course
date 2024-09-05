import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { TextField } from '@mui/material';
import { loginProps } from '@/interfaces/login.interface';

const SignIn = () => {
    const router = useRouter();

    const [loginMember, setLoginMember] = useState<loginProps>({
        email: '',
        password: ''
    });
    const memberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // { ...loginMember, [e.target.name]: e.target.value }
        // -> 이전 상태값을 복사하고, 새로운 상태값을 추가하여 업데이트
        // -> 이전 상태값을 복사하는 이유는, React에서 상태값을 직접 변경하면, 상태값이 변경되었는지 감지하지 못하기 때문

        // [e.target.name]: e.target.value
        // -> 이벤트 객체의 name 속성값을 키로 하여, value 속성값을 값으로 하는 객체 생성
        setLoginMember({ ...loginMember, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/signin', {
                email: loginMember.email,
                password: loginMember.password
            });

            const token = response.data.result.token;
            if (token) {
                localStorage.setItem('token', token);
                console.log('토큰 저장 완료:', token);
            } else {
                console.error('토큰 저장 실패:', response.data.message);
            }

            const member = response.data.result.member;
            if(member) {
                localStorage.setItem('member', JSON.stringify(member));
                console.log('멤버 저장 완료', member);
            } else {
                console.error('멤버 저장 실패:', response.data.message);
            }

            router.push('/post');

        } catch (error) {
            console.error('로그인 중 에러 발생:', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='p-16 shadow-lg shadow-black/10 w-full max-w-lg bg-white rounded-md'>
                <div className='text-7xl font-bold mb-10 text-center font-charmonman bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent'>
                    iamstar
                </div>

                <div className='text-red-500 mb-4'></div>
                <form onSubmit={ handleLogin }>

                    <div className='mb-3'>
                        <TextField
                            label='이메일'
                            name='email'
                            type='email'
                            value={ loginMember.email }
                            onChange={ memberChange }
                            fullWidth
                            variant='outlined'
                            InputLabelProps={{
                                style: { color: '#737373', fontFamily: 'seoulhangang' }
                            }}
                            InputProps={{
                                style: { color: '#737373', fontFamily: 'seoulhangang' }
                            }}
                            autoComplete='email'
                        />
                    </div>

                    <div className='mb-6'>
                        <TextField
                            label='비밀번호'
                            name='password'
                            type='password'
                            value={ loginMember.password }
                            onChange={ memberChange }
                            fullWidth
                            variant='outlined'
                            InputLabelProps={{
                                style: { color: '#737373', fontFamily: 'seoulhangang' }
                            }}
                            InputProps={{
                                style: { color: '#737373' }
                            }}
                            autoComplete='current-password'
                        />
                    </div>

                    <button
                        type='submit'
                        className={'w-full p-2 rounded text-white bg-blue-500 active:bg-blue-300'}
                    >
                    로그인
                    </button>
                </form>
                <div className='mt-10 text-center'>
                    <span className='text-gray-600'>계정이 없으신가요? </span>
                    <Link href='/signup' className='text-blue-500 hover:underline active:text-blue-300'>
                        가입하기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
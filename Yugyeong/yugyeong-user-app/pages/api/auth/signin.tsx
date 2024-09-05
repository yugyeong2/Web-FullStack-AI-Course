/*
 * 호출 주소: http://localhost:3000/api/auth/signin
 */
import type { NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/models/index';

type ResponseData = {
    code: number;
    result: string | object | null;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let payload: ResponseData = {
        code: 400,
        result: null,
        message: 'Bad Request: 요청 리소스를 찾을 수 없습니다.'
    };

    try {
        if(req.method == 'POST') {
            const { email, password } = req.body;
            const member = await db.Member.findOne({
                where: { email: email }
            });

            if(member) {// 해당 이메일을 가진 회원이 있을 경우
                const comparePassword = await bcrypt.compare(password, member.member_password);
                console.log('입력한 비밀번호:', password);
                console.log('입력한 비밀번호를 암호화:', await bcrypt.hash(password, 12));
                console.log('데이터베이스에서 가져온 비밀번호:', member.member_password);

                if(comparePassword) { // 비밀번호가 일치할 경우

                    const tokenData = {
                        member_id: member.member_id,
                        email: member.email,
                        username: member.username,
                        nickname: member.nickname,
                        profile_image_path: member.profile_image_path
                    };

                    const secretKey = process.env.JWT_SECRET_KEY;
                    if (!secretKey) {
                        throw new Error('JWT_SECRET_KEY is not defined in environment variables');
                    }

                    const token = await jwt.sign(tokenData, secretKey, {
                        expiresIn: '1h',
                        issuer: 'yugyeong'
                    });

                    member.member_password = '';

                    payload = {
                        code: 200,
                        result: {
                            token,
                            member
                        },
                        message: 'Success: 로그인 성공'
                    }
                } else {
                    payload = {
                        code: 401,
                        result: null,
                        message: 'Unauthorized: 비밀번호가 일치하지 않습니다.'
                    }
                }
            } else {
                payload = {
                    code: 404,
                    result: null,
                    message: 'Not Found: 해당 이메일을 가진 회원이 존재하지 않습니다.'
                };
            }            
        }

    } catch (error) {
        console.error('/api/member/signin 호출 중 에러 발생', error);

        payload = {
            code: 500,
            result: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(payload);
}
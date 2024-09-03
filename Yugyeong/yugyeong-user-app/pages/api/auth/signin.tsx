/*
 * 호출 주소: http://localhost:3000/api/member/signin
 */
import type { NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/models/index';

type ResponseData = {
    code: number;
    data: string | object | null;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let apiResult: ResponseData = {
        code: 400,
        data: null,
        message: 'Bad Request: 요청 리소스를 찾을 수 없습니다.'
    };

    try {
        const { email, password } = req.body;
        const member = await db.Member.findOne({
            where: { email: email }
        });

        if(member) {// 해당 이메일을 가진 회원이 있을 경우
            const comparePassword = await bcrypt.compare(password, member.member_password);

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

                apiResult = {
                    code: 200,
                    data: {
                        token: token,
                        member
                    },
                    message: 'Success: 로그인 성공'
                }
            } else {
                apiResult = {
                    code: 401,
                    data: null,
                    message: 'Unauthorized: 비밀번호가 일치하지 않습니다.'
                }
            }
        } else {
            apiResult = {
                code: 404,
                data: null,
                message: 'Not Found: 해당 이메일을 가진 회원이 존재하지 않습니다.'
            };
        }

    } catch (error) {
        console.error('/api/member/signin 호출 중 에러 발생', error);

        apiResult = {
            code: 500,
            data: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(apiResult);
}
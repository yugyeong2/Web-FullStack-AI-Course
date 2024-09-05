/*
 * 호출 주소: http://localhost:3000/api/member/signup
 */
import type { NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import db from '@/models/index';

type ResponseData = {
    code: number;
    result: string | null;
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
        const { email, password, username, nickname, telephone } = req.body;
        const member = await db.Member.findOne({
            where: { email: email }
        });

        if(!member) { // 해당 이메일을 가진 회원이 없을 경우
            const hashPassword = await bcrypt.hash(password, 12);
            let newMember = await db.Member.create({
                email,
                member_password: hashPassword,
                username,
                nickname,
                profile_image_path: 'default_profile.png',
                telephone,
                entry_type_code: 0, // 가입 유형: 일반
                use_state_code: 1, // 사용 상태: 사용
                entry_date: new Date()
            });

            newMember.member_password = '';
            
            payload = {
                code: 200,
                result: newMember,
                message: 'Success: 회원 가입 완료'
            };
        } else {
            payload = {
                code: 409,
                result: member,
                message: 'Conflict: 이미 가입된 이메일 주소입니다.'
            };
        }

    } catch (error) {
        console.error('/api/member/signup 호출 중 에러 발생', error);

        payload = {
            code: 500,
            result: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(payload);
}
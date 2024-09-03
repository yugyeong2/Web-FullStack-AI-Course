/*
 * 호출 주소: http://localhost:3000/api/post
 */
import type { NextApiRequest, NextApiResponse} from 'next';
import db from '@/models/index';

type ResponseData = {
    code: number;
    data: string | null;
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
        // GET - 게시글 전체 목록 조회
        if(req.method == 'GET') {
            const postList = await db.Article.findAll();
            
            apiResult = {
                code: 200,
                data: postList,
                message: 'Success: 게시글 전체 목록 데이터 반환'
            };
        }

        // POST - 새로운 게시글 등록
        if(req.method == 'POST') {
            const { title, contents, file } = req.body;
            const newPost = await db.Article.create({
                article_type_code: 0, // 일반 게시글
                board_type_code: 2, // 일반 사용자 게시판
                title,
                contents,
                view_count: 0,
                ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress, // 사용자 IP 추출 -> 로컬 개발 환경인 경우 ::1로 나올 수 있다.
                is_display_code: 1, // 게시
                reg_date: new Date(),
                reg_member_id: 1 // 추후 토큰에서 추출한 회원 ID로 변경
            });

            apiResult = {
                code: 200,
                data: newPost,
                message: 'Success: 새로운 게시글 등록 완료'
            };
        }
        
        // PUT - 기존 게시글 수정
        if(req.method == 'PUT') {
            const { title, contents, file } = req.body;
            const editPost = await db.Article.update({
                title,
                contents,
                ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress, // 사용자 IP 추출 -> 로컬 개발 환경인 경우 ::1로 나올 수 있다.
                edit_date: new Date(),
                edit_member_id: 1 // 추후 토큰에서 추출한 회원 ID로 변경
            });

            apiResult = {
                code: 200,
                data: editPost,
                message: 'Success: 기존 게시글 수정 완료'
            };
        }

        // DELETE - 기존 게시글 삭제
        if(req.method == 'DELETE') {
            const article_id = req.body; // 나중에 확인
            const deletePost = await db.Article.destroy({
                where: { article_id: article_id }
            });

            apiResult = {
                code: 200,
                data: deletePost,
                message: 'Success: 기존 게시글 삭제 완료'
            };
        }

    } catch (error) {
        console.error('/api/post 호출 중 에러 발생', error);

        apiResult = {
            code: 500,
            data: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(apiResult);
}
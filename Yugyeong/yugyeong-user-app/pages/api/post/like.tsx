/*
 * 호출 주소: http://localhost:3000/api/post/like
 */
import type { NextApiRequest, NextApiResponse } from 'next';
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
        // GET - 게시글 좋아요 목록 조회
        if(req.method == 'GET') {
            const likeList = await db.Like.findAll();

            apiResult = {
                code: 200,
                data: likeList,
                message: 'Success: 게시글 좋아요 목록 데이터 반환'
            };
        }

        if(req.method == 'POST') {
            const newLike = await db.ArticleLike.create({
                // 모두 추후 변경
                article_id: 1,
                nickname: 'yugyeong',
                like_date: new Date(),
                rag_member_id: 1
            });

            apiResult = {
                code: 200,
                data: newLike,
                message: 'Success: 새로운 게시글 좋아요 등록 완료'
            };
        }

        if(req.method == 'DELETE') {
            const article_like_id = req.body; // 추후 변경
            const deleteLike = await db.ArticleLike.destroy({
                where: { article_like_id: article_like_id }
            });

            apiResult = {
                code: 200,
                data: deleteLike,
                message: 'Success: 게시글 좋아요 삭제 완료'
            };
        }

    } catch (error) {
        console.error('/api/post/like 호출 중 에러 발생', error);

        apiResult = {
            code: 500,
            data: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(apiResult);
}
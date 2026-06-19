/*
 * 호출 주소: http://localhost:3000/api/post/like
 */
import type { NextApiRequest, NextApiResponse } from 'next';
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
        // GET - 게시글 좋아요 수 조회
        if(req.method == 'GET') {
            const likeCount = await db.ArticleLike.count();

            payload = {
                code: 200,
                result: likeCount,
                message: 'Success: 게시글 좋아요 수 반환'
            };
        }

        if(req.method == 'POST') {
            const { article_id, nickname, rag_member_id } = req.body; // req.body로 프론트엔드에서 전달된 데이터 수신

            // 좋아요한 회원 목록 조회
            const likeMember = await db.ArticleLike.findOne({
                where: { article_id, rag_member_id }
            })

            // 좋아요한 회원 목록에 로그인한 회원이 없을 경우 -> 좋아요 처리
            if(!likeMember) {
                const newLike = await db.ArticleLike.create({
                    article_id,
                    nickname,
                    rag_date: new Date(),
                    rag_member_id
                });

                payload = {
                    code: 200,
                    result: newLike,
                    message: 'Success: 새로운 게시글 좋아요 등록 완료'
                };                
            } 
            // 좋아요한 회원 목록에 로그인한 회원이 있을 경우 -> 좋아요 취소
            else {
                const article_like_id = likeMember.article_like_id;

                const deleteLike = await db.ArticleLike.destroy({
                    where: { article_like_id: article_like_id }
                });

                payload = {
                    code: 200,
                    result: deleteLike,
                    message: 'Success: 게시글 좋아요 삭제 완료'
                };
            }
        }

    } catch (error) {
        console.error('/api/post/like 호출 중 에러 발생', error);

        payload = {
            code: 500,
            result: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(payload);
}
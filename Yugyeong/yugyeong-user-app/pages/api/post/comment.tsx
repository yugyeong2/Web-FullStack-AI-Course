/*
 * 호출 주소: http://localhost:3000/api/post/comment
 */
import type { NextApiRequest, NextApiResponse} from 'next';
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
        // GET - 게시글 댓글 전체 목록 조회
        if(req.method == 'GET') {
            const commentList = await db.ArticleComment.findAll();
            
            payload = {
                code: 200,
                result: commentList,
                message: 'Success: 게시글 댓글 전체 목록 데이터 반환'
            };
        }

        // POST - 새로운 게시글 댓글 등록
        if(req.method == 'POST') {
            const { contents } = req.body;
            const newComment = await db.ArticleComment.create({
                article_id: 1, // 추후 변경
                contents,
                nickname: '임시 닉네임', // 추후 변경
                rag_date: new Date(),
                rag_member_id: 1, // 추후 토큰에서 추출한 회원 ID로 변경
            });

            payload = {
                code: 200,
                result: newComment,
                message: 'Success: 새로운 게시글 댓글 등록 완료'
            };
        }

        // PUT - 기존 게시글 댓글 수정
        if(req.method == 'PUT') {
            const { contents } = req.body;
            const editPost = await db.ArticleComment.update(
                {
                    contents,
                    edit_date: new Date(),
                    edit_member_id: 1 // 추후 토큰에서 추출한 회원 ID로 변경
                },
                { where: { article_comment_id: 1 } }
        );

            payload = {
                code: 200,
                result: editPost,
                message: 'Success: 기존 게시글 댓글 수정 완료'
            };
        }

        // DELETE - 기존 게시글 댓글 삭제
        if(req.method == 'DELETE') {
            const article_comment_id = req.body;
            const deletePost = await db.ArticleComment.destroy({
                where: { article_comment_id: article_comment_id }
            });

            payload = {
                code: 200,
                result: deletePost,
                message: 'Success: 기존 게시글 댓글 삭제 완료'
            }
        }

    } catch (error) {
        console.error('/api/post/comment 호출 중 에러 발생', error);

        payload = {
            code: 500,
            result: null,
            message: 'Server Error: 서버에서 처리 중 오류가 발생했습니다.'
        };
    }

    res.json(payload);
}
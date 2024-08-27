/*
 * 호출 주소: http://localhost:3000/api/post/list
 */
import type { NextApiRequest, NextApiResponse} from 'next';
import { PostProps, CommentProps,ProfileProps } from '@/interfaces/post';

type ResponseData = {
    code: number;
    data: string | null;
    message: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let apiResult: ResponseData = {
        code: 400,
        data: null,
        message: 'Bad Request'
    };

    try {
        // GET
        if(req.method == 'GET') {
            
            // * 게시글 조회
            const posts: 
            try {
                apiResult = {
                    code: 200,
                    data: null,
                    message: 'Success'
                }
            } catch (error) {
                apiResult = {
                    code: 500,
                    data: null,
                    message: 'Server Error'
                }
            }
        }

        if(req.method == 'POST') {

            try {
                apiResult = {
                    code: 200,
                    data: null,
                    message: 'Success'
                }
            } catch (error) {
                apiResult = {
                    code: 500,
                    data: null,
                    message: 'Server Error'
                }
            }

        }
    }
    res.json(apiResult);            

}
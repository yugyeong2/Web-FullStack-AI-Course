// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { ArticleInterface, BoardTypeCode, ArticleTypeCode, IsDisplayCode } from '@/interface/article';

type ResponseDataType = {
    code: number;
    data: ArticleInterface[];
    message: string;
};

// NEXT.js를 통한 백엔드 API 개발
// 기본 호출 주소: http://localhost:3000/api/article
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseDataType>,
) {
    const results: ResponseDataType = {
        code: 200,
        data: [
            {
                article_id: 1,
                board_type_code: 1,
                title: "test1 title",
                article_type_code: 1,
                contents: "test1 contents",
                view_count: 1,
                ip_address: "test1",
                is_display_code: 1,
                reg_date: "2024-08-15T15:00:00.000Z",
                reg_member_id: 1,
                edit_date: null,
                edit_member_id: null
            }
        ],
        message: "200 OK"
    }

    res.status(200).json(results);
}

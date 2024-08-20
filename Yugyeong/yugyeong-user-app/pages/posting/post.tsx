import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PostProps, CommentProps, ProfileProps } from '@/interface/post';
import Comment from '@/components/comment';

const PostData: PostProps[] = [
    {
        post_id: 1,
        poster: {
            user_id: 1,
            profile_image: '/image/default_profile.png',
            username: 'yugyeong',
            full_name: 'Yugyeong Park'
        },
        post_image: '/image/default_post.png',
        contents: '게시글 내용1',
        comments: [
            {
                comment_id: 1,
                commenter_id: 1, // 댓글 작성자의 user_id
                comment: '댓글 내용1'
            }
        ]
    }
];

const Post = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [profiles, setProfiles] = useState<ProfileProps[]>([]);

    useEffect(() => {
        setPosts(PostData); // DB 연결 후 수정 필요
    }, [])

    return (
        <>
            { posts.map((post) => (
                <div key={post.post_id}>
                    {/* 게시글 헤더 */}
                    <div>
                        <Image
                        src={post.poster.profile_image}
                        alt={post.poster.username}
                        layout="responsive"
                        width={40}
                        height={40}
                        className='flex'
                        />

                        <div className='mr-1'>
                            <div>{post.poster.username}</div>
                            <div>{post.poster.full_name}</div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div>
                        <Image src={post.post_image}
                        alt='{post.poster}님의 게시글'
                        layout="responsive"
                        width={100} // 비율 적용
                        height={100} // 비율 적용
                        className="object-cover aspect-square flex-shrink-0"
                        />

                        <div>{post.contents}</div>
                    </div>

                    {/* 게시글 버튼 */}
                    <div>
                        <button>좋아요</button>
                        <button>댓글</button>
                    </div>

                    {/* 게시글 댓글 */}
                    <div>
                        { post.comments.map((comment) => (
                            <Comment key={comment.comment_id} comment={comment}/>
                        )) }
                    </div>
                </div>
                ))
            }                    
        </>
    );
}

export default Post;
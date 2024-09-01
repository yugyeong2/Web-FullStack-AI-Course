import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PostProps, CommentProps, ProfileProps } from '@/interfaces/post';
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
    const [isLike, setIsLike] = useState<boolean>(false);
    const [likes, setLikes] = useState<number[]>([]);
    const [comment, setComment] = useState<string>('');
    const [commentList, setCommentList] = useState<CommentProps[]>([]);
    const [profiles, setProfiles] = useState<ProfileProps[]>([]);

    useEffect(() => {
        setPosts(PostData); // DB 연결 후 수정 필요
    }, [])


    async function getPosts() {
        
    }


    // 좋아요 버튼 클릭 시 이벤트 처리
    const handleLike = async() => {
        try {
            if(isLike) { // true -> false
                setIsLike(false);
                setLikes(likes[])
            } else { // false -> true
                setIsLike(true);
            }

        } catch (error) {
            console.error('좋아요 버튼 클릭 시 에러 발생:', error);
        }
    };

    return (
        <div className='bg-white shadow-lg rounded-xl overflow-hidden max-h-[1000px] max-w-[1000px] min-w-[300px]'>
            {
                posts.map((post) => (
                <div key={post.post_id}>
                    {/* 게시글 헤더 */}
                    <div className='flex items-center p-5'>
                        <div className='relative w-10 h-10 mt-1 mr-3 rounded-full'>
                            <Image
                            src={post.poster.profile_image}
                            alt={post.poster.username}
                            layout='responsive'
                            width={40}
                            height={40}
                            />                            
                        </div>


                        <div className='flex-col mr-1'>
                            <div className='font-bold'>{post.poster.username}</div>
                            <div className='text-sm text-gray-500'>{post.poster.full_name}</div>
                        </div>
                    </div>


                    {/* 게시글 본문 */}
                    <div className='relative w-full'>
                        <Image
                        src={post.post_image}
                        alt='게시글 이미지'
                        layout='responsive'
                        width={100} // 비율 적용
                        height={100} // 비율 적용
                        className='flex-shrink-0 object-cover aspect-square'
                        />                            
                    </div>

                    {/* 게시글 버튼 */}
                    <div className='flex flex-grow pt-4 pl-3 flow-y-auto'>
                        <button className='flex'>
                            <div className='w-4 h-4 mr-1'>
                                <Image
                                src='/image/heart.png'
                                alt='좋아요'
                                layout='responsive'
                                width={16}
                                height={16}
                                />
                            </div>
                        좋아요
                        </button>
                        
                        <button className='flex ml-3'>
                        <div className='w-4 h-4 mr-1'>
                                <Image
                                src='/image/chat.png'
                                alt='댓글'
                                layout='responsive'
                                width={16}
                                height={16}
                                />
                            </div>
                        댓글
                        </button>
                    </div>

                    {/* 게시글 내용 */}
                    <div className='flex-grow p-4 overflow-y-auto'>{post.contents}</div>

                    {/* 게시글 댓글 */}
                    <div className='flex flex-grow pt-4 pl-3 flow-y-auto'>
                        { post.comments.map((comment) => (
                            <Comment key={comment.comment_id} comment={comment}/>
                        )) }
                    </div>
                </div>
                ))
            }
        </div>
    );
}

export default Post;
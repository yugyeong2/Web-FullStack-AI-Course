import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { PostData, LikeData, CommentData, MemberData } from '@/interfaces/post.interface';

const Post = () => {
    const router = useRouter();

    const [postList, setPostList] = useState<PostData[]>([]); // 게시글 목록
    const [commentList, setCommentList] = useState<CommentData[]>([]); // 댓글 목록

    const [likeCount, setLikeCount] = useState<number>(0); // 좋아요 수
    const [commentCount, setCommentCount] = useState<number>(0); // 댓글 수

    const [member, setMember] = useState<MemberData>({} as MemberData);

    // 최초 렌더링 시 게시글 조회
    useEffect(() => {
        // 토큰이 없으면, 로그인 페이지로 이동 
        if(localStorage.getItem('token') == undefined) {
            console.log('token 정보가 없습니다.');
            router.push('/signin');
        }

        // 멤버가 없으면, 로그인 페이지로 이동
        const loginMember = localStorage.getItem('member')
        if(loginMember == undefined) {
            console.log('member 정보가 없습니다.');
            router.push('/signin');
        } else {
            setMember(JSON.parse(loginMember));
        }

        getPostList();
        getLikeCount();
        getCommentList();
    }, [])


    // 비동기 방식으로 백엔드 게시글 목록 데이터 호출
    // 게시글 내용 조회
    async function getPostList() {
        try {
            const response = await axios.get<{result: PostData[]}>('/api/post');
            setPostList(response.data.result);

        } catch (error) {
            console.error('게시글 목록 조회 중 에러 발생:', error);
        }
    }

    // 좋아요 조회
    async function getLikeCount() {
        try {
            const response = await axios.get<{result: number}>('/api/post/like');
            
            if(response.data.result) {
                setLikeCount(response.data.result); // 좋아요 수 갱신      
            }

        } catch (error) {
            console.error('게시글 좋아요 수 조회 중 에러 발생:', error);
        }
    }

    // 댓글 조회
    async function getCommentList() {
        try {
            const response = await axios.get<{result: CommentData[]}>('/api/post/comment');
            
            if(response.data.result) {
                setCommentList(response.data.result);
                setCommentCount(response.data.result.length); // 댓글 수 갱신                
            }

        } catch (error) {
            console.error('게시글 댓글 목록 조회 중 에러 발생:', error);
        }
    }


    // 좋아요 버튼 클릭 시 이벤트 처리
    const handleLike = async(article_id: number) => {
        try {
            // 서버로 좋아요 처리 요청
            const response = await axios.post('/api/post/like', { // 백엔드로 데이터 전송
                article_id: article_id,
                nickname: member.nickname,
                reg_member_id: member.member_id,
            });

            if(response.data.message == 'Success: 새로운 게시글 좋아요 등록 완료') {
                getLikeCount(); // 좋아요 수 갱신
                setLikeCount(likeCount + 1);
            }
            else if(response.data.message == 'Success: 게시글 좋아요 삭제 완료') {
                getLikeCount();
                setLikeCount(likeCount - 1);
            }
            console.log('좋아요 수:', likeCount);

        } catch (error) {
            console.error('좋아요 버튼 클릭 시 에러 발생:', error);
        }
    };

    return (
        <div className='bg-white shadow-lg rounded-xl overflow-hidden max-h-[1000px] max-w-[1000px] min-w-[300px]'>
            {
                postList.map((post) => (
                <div key={post.article_id}>
                    {/* 게시글 헤더 */}
                    <div className='flex items-center p-5'>
                        <div className='relative w-10 h-10 mt-1 mr-3 rounded-full'>
                            <Image
                            src={member.profile_image_path}
                            alt={member.username}
                            width={50}
                            height={50}
                            />                            
                        </div>


                        <div className='flex-col mr-1'>
                            <div className='font-bold'>{member.nickname}</div>
                            <div className='text-sm text-gray-500'>{member.username}</div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div className='relative w-full'>
                        <Image
                        src='/image/default_post.png' // ! 추후 변경
                        alt='게시글 이미지'
                        width={400} // 비율 적용
                        height={400} // 비율 적용
                        className='flex-shrink-0 object-cover aspect-square'
                        />                            
                    </div>

                    {/* 게시글 버튼 */}
                    <div className='flex flex-grow pt-4 pl-3 flow-y-auto'>
                        <button className='flex' onClick={ () => handleLike(post.article_id) }>
                            <div className='w-5 h-5 mr-1'>
                                <Image
                                src='/image/heart.png'
                                alt='좋아요'
                                width={20}
                                height={20}
                                />
                            </div>
                        </button>
                        좋아요 {likeCount}개
                        
                        <button className='flex ml-5'>
                        <div className='w-5 h-5 mr-1'>
                                <Image
                                src='/image/chat.png'
                                alt='댓글'
                                width={20}
                                height={20}
                                />
                            </div>
                        </button>
                        댓글 {commentCount}개
                    </div>

                    {/* 게시글 내용 */}
                    <div className='flex-grow p-4 overflow-y-auto'>{post.contents}</div>

                    {/* 게시글 댓글 */}
                    {/* <div className='flex flex-grow pt-4 pl-3 flow-y-auto'>
                    </div> */}
                    <div className="mt-4 overflow-y-auto max-h-52">
                        {commentList.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <div className="mr-2 font-bold">{comment.nickname}</div>
                                <div>{comment.contents}</div>
                            </div>
                        ))}
                    </div>

                    {/* <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                        />
                        <Button size="small" onClick={handleAddComment}>댓글 추가</Button>
                    </div> */}
                </div>
                ))
            }
        </div>
    );
}

export default Post;
import { CommentProps } from '@/interface/post';
import Image from 'next/image';

const Comment = ( {comment}: {comment: CommentProps} ) => {
    return (
        <div>
            <Image src={comment.commenter.profile_image} alt={comment.commenter.username} />
            {comment.commenter.username}
            {comment.comment}
        </div>
    );
}

export default Comment;
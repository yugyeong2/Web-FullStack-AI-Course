import { CommentProps } from '@/interfaces/post';
import Image from 'next/image';

const Comment = ( {comment}: {comment: CommentProps} ) => {
    return (
        <div>
            {comment.comment}
        </div>
    );
}

export default Comment;
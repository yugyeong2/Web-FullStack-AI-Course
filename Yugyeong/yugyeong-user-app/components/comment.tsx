import { CommentData } from '@/interfaces/post.interface';
import Image from 'next/image';

const Comment = ( {comment}: {comment: CommentData} ) => {
    return (
        <div>
            {comment.contents}
        </div>
    );
}

export default Comment;
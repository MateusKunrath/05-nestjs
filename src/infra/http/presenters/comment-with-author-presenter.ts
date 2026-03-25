import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      comment: {
        id: commentWithAuthor.comment.id.toString(),
        content: commentWithAuthor.comment.content,
      },
      author: {
        id: commentWithAuthor.author.id.toString(),
        name: commentWithAuthor.author.name,
      },
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  items: AnswerComment[] = []

  constructor(
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)
    return answerComment ?? null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const comments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          comment: {
            id: comment.id,
            content: comment.content,
          },
          author: {
            id: comment.authorId,
            name: author.name,
          },
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return comments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}

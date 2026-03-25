import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  items: QuestionComment[] = []

  constructor(
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)
    return questionComment ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionsComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}

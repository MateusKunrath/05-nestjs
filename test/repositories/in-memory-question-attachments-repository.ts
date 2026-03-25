import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  items: QuestionAttachment[] = []

  async findById(id: string) {
    const questionAttachment = this.items.find(
      (item) => item.id.toString() === id,
    )
    return questionAttachment ?? null
  }

  async findManyByQuestionId(questionId: string) {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
  }
}

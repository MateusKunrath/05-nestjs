import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  items: AnswerAttachment[] = []

  async findById(id: string) {
    const answerAttachment = this.items.find(
      (item) => item.id.toString() === id,
    )
    return answerAttachment ?? null
  }

  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
  }
}

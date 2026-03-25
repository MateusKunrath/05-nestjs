import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  comment: {
    id: UniqueEntityID
    content: string
  }
  author: {
    id: UniqueEntityID
    name: string
  }
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get comment() {
    return this.props.comment
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}

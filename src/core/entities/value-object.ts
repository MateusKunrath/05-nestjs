export abstract class ValueObject<TProps> {
  protected props: TProps

  protected constructor(props: TProps) {
    this.props = props
  }

  equals(vo: ValueObject<unknown>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}

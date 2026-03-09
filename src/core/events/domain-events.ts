import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { UniqueEntityID } from '../entities/unique-entity-id'

type DomainEventCallback = (event: unknown) => Promise<void> | void

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  private static markedAggregates: AggregateRoot<unknown>[] = []

  static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(
    aggregate: AggregateRoot<unknown>,
  ): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    if (index > -1) {
      this.markedAggregates.splice(index, 1)
    }
  }

  private static findMarkedAggregateById(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateById(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  static register(callback: DomainEventCallback, eventClassName: string): void {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  static clearHandlers() {
    this.handlersMap = {}
  }

  static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName = event.constructor.name
    const isEventRegistered = eventClassName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}

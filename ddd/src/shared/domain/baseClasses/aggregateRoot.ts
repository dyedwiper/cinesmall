import { Entity, type EntityProps } from './entity.js';

// See https://khalilstemmler.com/articles/typescript-domain-driven-design/aggregate-design-persistence/
export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {}

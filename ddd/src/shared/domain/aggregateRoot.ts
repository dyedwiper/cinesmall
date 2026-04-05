import { Entity } from './entity.js';

// See https://khalilstemmler.com/articles/typescript-domain-driven-design/aggregate-design-persistence/
export abstract class AggregateRoot<T> extends Entity<T> {}

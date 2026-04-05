import type { Id } from './id.js';

export interface EntityProps {
    id: Id;
}

// Inspired by: https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/
export abstract class Entity<T extends EntityProps> {
    protected props: T;

    get id() {
        return this.props.id.value;
    }

    constructor(props: T) {
        this.props = props;
    }

    getProps(): T {
        return this.props;
    }
}

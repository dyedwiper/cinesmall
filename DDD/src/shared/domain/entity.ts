import type { Uuid } from './uuid.js';

export interface EntityProps {
    uuid: Uuid;
}

// Inspired by: https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/
export abstract class Entity<T extends EntityProps> {
    protected props: T;

    get uuid() {
        return this.props.uuid.value;
    }

    constructor(props: T) {
        this.props = props;
    }

    getProps(): T {
        return this.props;
    }
}

import crypto from 'node:crypto';

// Inspired by: https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/
export abstract class Entity<T> {
    protected readonly _uuid: string;
    protected props: T;

    get uuid() {
        return this._uuid;
    }

    constructor(props: T, uuid?: string) {
        this.props = props;
        this._uuid = uuid ?? crypto.randomUUID();
    }

    getProps(): T {
        return this.props;
    }
}

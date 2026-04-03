// Inspired by: https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/
export abstract class Entity<T> {
    protected readonly _uuid: string;
    protected props: T;

    get uuid() {
        return this._uuid;
    }

    constructor(props: T, uuid: string) {
        this.props = props;
        // TODO: Put the creation of the UUID someplace else.
        this._uuid = uuid;
    }

    getProps(): T {
        return this.props;
    }
}

import crypto from 'node:crypto';
import { ValueObject } from './valueObject.js';

interface IdProps {
    value: string;
}

export class Id extends ValueObject<IdProps> {
    get value() {
        return this.props.value;
    }

    private constructor(value: string) {
        super({ value });
    }

    static create(input?: string) {
        // validation

        // TODO: Overthink if this is really the right place to set the UUID!
        const value = input ?? crypto.randomUUID();

        return new Id(value);
    }
}

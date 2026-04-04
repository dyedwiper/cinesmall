import crypto from 'node:crypto';
import { ValueObject } from './valueObject.js';

interface UuidProps {
    value: string;
}

export class Uuid extends ValueObject<UuidProps> {
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

        return new Uuid(value);
    }
}

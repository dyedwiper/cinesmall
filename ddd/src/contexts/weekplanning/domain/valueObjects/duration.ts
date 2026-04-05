import { ValueObject } from '../../../../shared/domain/valueObject.js';

interface DurationProps {
    value: number;
}

export class Duration extends ValueObject<DurationProps> {
    get value() {
        return this.props.value;
    }

    private constructor(value: number) {
        super({ value });
    }

    static create(input: number) {
        if (input <= 0) throw new Error('Duration must be greater than 0.');

        return new Duration(input);
    }
}

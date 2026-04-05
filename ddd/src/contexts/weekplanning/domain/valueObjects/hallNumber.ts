import { ValueObject } from '../../../../shared/domain/valueObject.js';

interface HallNumberProps {
    value: number;
}

export class HallNumber extends ValueObject<HallNumberProps> {
    get value() {
        return this.props.value;
    }

    private constructor(value: number) {
        super({ value });
    }

    static create(input: number) {
        if (input !== 1 && input !== 2) throw new Error('HallNumber must be 1 or 2.');

        return new HallNumber(input);
    }
}

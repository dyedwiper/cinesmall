import { ValueObject } from '../../../../shared/domain/valueObject.js';

interface StartDateProps {
    value: Date;
}

export class StartDate extends ValueObject<StartDateProps> {
    get value() {
        return this.props.value;
    }

    private constructor(value: Date) {
        super({ value });
    }

    static create(input: string) {
        let date: Date;

        try {
            date = new Date(input);
        } catch (error) {
            throw error;
        }

        if (date.getDay() !== 4) {
            throw new Error('The weekplan must start on a Thursday.');
        }

        return new StartDate(date);
    }
}

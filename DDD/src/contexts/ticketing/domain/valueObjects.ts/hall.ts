import { ValueObject } from '../../../../shared/domain/valueObject.js';

interface HallProps {
    number: number;
    seats: string[];
}

export class Hall extends ValueObject<HallProps> {
    get number() {
        return this.props.number;
    }

    private constructor(props: HallProps) {
        super(props);
    }

    static create(number: number) {
        let seats;

        if (number === 1) {
            seats = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3'];
        } else if (number === 2) {
            seats = ['a1', 'a2', 'b1', 'b2'];
        } else {
            throw new Error('There are only hall 1 and 2.');
        }

        return new Hall({ number, seats });
    }
}

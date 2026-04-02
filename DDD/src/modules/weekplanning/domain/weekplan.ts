import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import type { Screening } from './screening.js';

export interface WeekplanProps {
    startDate: Date;
    screenings?: Screening[];
}

export class Weekplan extends AggregateRoot<WeekplanProps> {
    private constructor(props: WeekplanProps, uuid?: string) {
        super(props, uuid);
    }

    // TODO: Maybe rename the method to from
    static create(props: WeekplanProps, uuid?: string) {
        // TODO: Create a value object for validation
        const startDate = new Date(props.startDate);

        if (startDate.getDay() !== 4) {
            throw new Error('The weekplan must start on a Thursday.');
        }

        return new Weekplan(props, uuid);
    }

    addScreening(screening: Screening) {
        this.props.screenings ??= [];

        // validate e.g. that times of screenings don't overlap

        this.props.screenings.push(screening);
    }

    removeScreening(screening: Screening) {}
}

import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import type { Screening } from './screening.js';

export interface WeekplanProps {
    startDate: Date;
    screenings?: Screening[];
}

export class Weekplan extends AggregateRoot<WeekplanProps> {
    get startDate(): Date {
        return this.props.startDate;
    }

    get screenings(): Screening[] {
        return this.props.screenings ?? [];
    }

    private constructor(props: WeekplanProps, uuid?: string) {
        super(props, uuid);
    }

    static create(props: WeekplanProps, uuid?: string) {
        if (props.startDate.getDay() !== 4) {
            throw new Error('The weekplan must start on a Thursday.');
        }

        return new Weekplan(props, uuid);
    }

    addScreening(screening: Screening) {
        if (!this.props.screenings) {
            this.props.screenings = [];
        }

        // validate e.g. that times of screenings don't overlap

        this.props.screenings.push(screening);
    }

    removeScreening(screening: Screening) {}
}

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

    static create(props: WeekplanProps, uuid?: string) {
        const startDate = new Date(props.startDate);

        // Ideally validation should be implemented with Value Objects but I'm unsure how to do it elegantly.
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

    removeScreening(uuid: string) {
        this.props.screenings = this.props.screenings?.filter(
            (screening) => screening.uuid !== uuid,
        );
    }
}

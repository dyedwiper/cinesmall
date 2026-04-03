import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import type { Screening } from './screening.js';

export interface WeekplanProps {
    startDate: Date;
    screenings?: Screening[];
}

export class Weekplan extends AggregateRoot<WeekplanProps> {
    private constructor(props: WeekplanProps, uuid: string) {
        super(props, uuid);
    }

    static create(props: WeekplanProps, uuid: string) {
        // Ideally validation should be implemented with Value Objects but I'm unsure how to do it elegantly.
        if (props.startDate.getDay() !== 4) {
            throw new Error('The weekplan must start on a Thursday.');
        }

        // TODO: How to check if a weekplan for this startDate already exists?

        return new Weekplan(props, uuid);
    }

    addScreening(screening: Screening) {
        this.props.screenings ??= [];

        this.checkForOverlappingScreenings(screening);

        this.props.screenings.push(screening);
    }

    removeScreening(uuid: string) {
        this.props.screenings = this.props.screenings?.filter(
            (screening) => screening.uuid !== uuid,
        );
    }

    private checkForOverlappingScreenings(screening: Screening) {
        const screeningsInSameHall = this.props.screenings?.filter(
            (item) => item.hallNumber === screening.hallNumber,
        );

        if (
            screeningsInSameHall?.some((item) =>
                this.isOverlapping(item, screening),
            )
        ) {
            throw new Error('The screening overlaps with another screening.');
        }
    }

    private isOverlapping(screening1: Screening, screening2: Screening) {
        const time1 = screening1.date.getTime();
        const time2 = screening2.date.getTime();
        const duration1InMs = screening1.duration * 60 * 1000;
        const duration2InMs = screening2.duration * 60 * 1000;

        return (
            (time1 <= time2 && time1 + duration1InMs > time2) ||
            (time2 <= time1 && time2 + duration2InMs > time1)
        );
    }
}

import crypto from 'node:crypto';
import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import type { Advertisement } from './advertisement.js';
import type { Screening } from './screening.js';
import { StartDate } from './valueObjects/startDate.js';
import type { EntityProps } from '../../../shared/domain/entity.js';
import { Uuid } from '../../../shared/domain/uuid.js';

interface WeekplanCreateParams {
    uuid?: string;
    startDate: string;
    screenings?: Screening[];
}

interface WeekplanProps extends EntityProps {
    startDate: StartDate;
    screenings: Screening[];
}

export class Weekplan extends AggregateRoot<WeekplanProps> {
    get screenings() {
        return this.props.screenings;
    }

    private constructor(props: WeekplanProps) {
        super(props);
    }

    // TODO: How to check if a weekplan for this startDate already exists?
    static create(params: WeekplanCreateParams) {
        const props = {
            uuid: Uuid.create(params.uuid),
            startDate: StartDate.create(params.startDate),
            screenings: params.screenings ?? [],
        };

        return new Weekplan(props);
    }

    addScreening(screening: Screening) {
        this.checkForOverlappingScreenings(screening);

        this.props.screenings.push(screening);
    }

    removeScreening(uuid: string) {
        this.props.screenings = this.props.screenings.filter((screening) => screening.uuid !== uuid);
    }

    addAdvertismentToScreening(advertisement: Advertisement, screeningUuid: string) {
        const screening = this.props.screenings.find((item) => item.uuid === screeningUuid);

        if (!screening) throw new Error('Screening not found.');

        screening.addAdvertisement(advertisement);

        this.checkForOverlappingScreenings(screening);
    }

    private checkForOverlappingScreenings(screening: Screening) {
        const screeningsInSameHall = this.props.screenings.filter((item) => item.hallNumber === screening.hallNumber);

        if (screeningsInSameHall.some((item) => this.isOverlapping(item, screening))) {
            throw new Error('The screening overlaps with another screening.');
        }
    }

    private isOverlapping(screening1: Screening, screening2: Screening) {
        if (screening1.uuid === screening2.uuid) return false;

        const time1 = screening1.date.getTime();
        const time2 = screening2.date.getTime();
        const duration1InMs = screening1.duration * 60 * 1000;
        const duration2InMs = screening2.duration * 60 * 1000;
        const durationOfAds1InMs = this.computeDurationOfAdvertisements(screening1) * 60 * 1000;
        const durationOfAds2InMs = this.computeDurationOfAdvertisements(screening2) * 60 * 1000;

        return (
            (time1 <= time2 && time1 + duration1InMs + durationOfAds1InMs > time2) ||
            (time2 <= time1 && time2 + duration2InMs + durationOfAds2InMs > time1)
        );
    }

    private computeDurationOfAdvertisements(screening: Screening) {
        const sum = screening.advertisements.reduce((acc, cur) => acc + cur.duration, 0);

        return sum;
    }
}

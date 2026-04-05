import { advertisements } from '../../../shared/db/schema.js';
import { Entity, type EntityProps } from '../../../shared/domain/entity.js';
import { Id } from '../../../shared/domain/id.js';
import type { Advertisement } from './advertisement.js';
import { Duration } from './valueObjects/duration.js';
import { Film } from './valueObjects/film.js';
import { HallNumber } from './valueObjects/hallNumber.js';

interface ScreeningCreateParams {
    id?: string;
    weekplanId: string;
    date: string;
    hallNumber: number;
    film: string;
    duration: number;
    advertisements?: Advertisement[];
}

interface ScreeningProps extends EntityProps {
    weekplanId: Id;
    date: Date;
    hallNumber: HallNumber;
    film: Film;
    duration: Duration;
    advertisements: Advertisement[];
}

export class Screening extends Entity<ScreeningProps> {
    get date() {
        return this.props.date;
    }

    get hallNumber() {
        return this.props.hallNumber.value;
    }

    get duration() {
        return this.props.duration.value;
    }

    get advertisements() {
        return this.props.advertisements;
    }

    private constructor(props: ScreeningProps) {
        super(props);
    }

    static create(params: ScreeningCreateParams) {
        const props = {
            id: Id.create(params.id),
            weekplanId: Id.create(params.weekplanId),
            date: new Date(params.date),
            hallNumber: HallNumber.create(params.hallNumber),
            film: Film.create(params.film),
            duration: Duration.create(params.duration),
            advertisements: params.advertisements ?? [],
        };

        return new Screening(props);
    }

    addAdvertisement(advertisement: Advertisement) {
        if (this.props.advertisements.length >= 3) {
            throw new Error('Max 3 advertisements per screening are allowed.');
        }

        this.props.advertisements.push(advertisement);
    }
}

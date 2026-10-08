import { Entity, type EntityProps } from '../../../shared/domain/baseClasses/entity.js';
import { Id } from '../../../shared/domain/valueObjects/id.js';
import type { Advertisement } from './advertisement.js';
import type { Film } from './film.js';
import { HallNumber } from './valueObjects/hallNumber.js';

interface ScreeningCreateParams {
    id?: string;
    weekplanId: string;
    film: Film;
    date: string;
    hallNumber: number;
    advertisements?: Advertisement[];
}

interface ScreeningProps extends EntityProps {
    weekplanId: Id;
    film: Film;
    date: Date;
    hallNumber: HallNumber;
    advertisements: Advertisement[];
}

export class Screening extends Entity<ScreeningProps> {
    get date() {
        return this.props.date;
    }

    get film() {
        return this.props.film;
    }

    get hallNumber() {
        return this.props.hallNumber.value;
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
            film: params.film,
            date: new Date(params.date),
            hallNumber: HallNumber.create(params.hallNumber),
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

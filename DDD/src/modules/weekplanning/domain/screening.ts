import { Entity } from '../../../shared/domain/entity.js';
import type { Advertisement } from './advertisement.js';

export interface ScreeningProps {
    weekplanUuid: string;
    date: Date;
    hallNumber: number;
    film: string;
    duration: number;
    advertisements?: Advertisement[];
}

export class Screening extends Entity<ScreeningProps> {
    get date() {
        return this.props.date;
    }

    get hallNumber() {
        return this.props.hallNumber;
    }

    get duration() {
        return this.props.duration;
    }

    get advertisements() {
        return this.props.advertisements;
    }

    private constructor(props: ScreeningProps, uuid: string) {
        super(props, uuid);
    }

    static create(props: ScreeningProps, uuid: string) {
        if (props.hallNumber !== 1 && props.hallNumber !== 2) {
            throw new Error('Hall number must be 1 or 2.');
        }

        return new Screening(props, uuid);
    }

    addAdvertisement(advertisement: Advertisement) {
        this.props.advertisements ??= [];

        if (this.props.advertisements.length >= 3) {
            throw new Error('Max 3 advertisements per screening are allowed.');
        }

        this.props.advertisements.push(advertisement);
    }
}

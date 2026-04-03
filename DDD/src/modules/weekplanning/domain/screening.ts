import { Entity } from '../../../shared/domain/entity.js';

export interface ScreeningProps {
    weekplanUuid: string;
    date: Date;
    hallNumber: number;
    film: string;
    duration: number;
}

export class Screening extends Entity<ScreeningProps> {
    private constructor(props: ScreeningProps, uuid: string) {
        super(props, uuid);
    }

    static create(props: ScreeningProps, uuid: string) {
        if (props.hallNumber !== 1 && props.hallNumber !== 2) {
            throw new Error('Hall number must be 1 or 2.');
        }

        return new Screening(props, uuid);
    }
}

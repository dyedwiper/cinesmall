import { Entity } from '../../../shared/domain/entity.js';

export interface ScreeningProps {
    weekplanUuid: string;
    date: Date;
    film: string;
}

export class Screening extends Entity<ScreeningProps> {
    private constructor(props: ScreeningProps, uuid?: string) {
        super(props, uuid);
    }

    static create(props: ScreeningProps, uuid?: string) {
        return new Screening(props, uuid);
    }
}

import { Entity, type EntityProps } from '../../../shared/domain/entity.js';
import { Uuid } from '../../../shared/domain/uuid.js';

interface ScreeningCreateParams {
    uuid?: string;
    weekplanUuid: string;
    date: string;
    hallNumber: number;
    film: string;
    duration: number;
}

interface ScreeningProps extends EntityProps {
    weekplanUuid: Uuid;
    date: Date;
    hallNumber: number;
    film: string;
    duration: number;
}

export class Screening extends Entity<ScreeningProps> {
    get hallNumber() {
        return this.props.hallNumber;
    }

    private constructor(props: ScreeningProps) {
        super(props);
    }

    static create(params: ScreeningCreateParams) {
        const props = {
            uuid: Uuid.create(params.uuid),
            weekplanUuid: Uuid.create(params.weekplanUuid),
            date: new Date(params.date),
            hallNumber: params.hallNumber,
            film: params.film,
            duration: params.duration,
        };

        return new Screening(props);
    }
}

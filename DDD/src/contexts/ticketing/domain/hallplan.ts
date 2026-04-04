import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import { type EntityProps } from '../../../shared/domain/entity.js';
import { Uuid } from '../../../shared/domain/uuid.js';
import type { Screening } from './screening.js';
import { Hall } from './valueObjects.ts/hall.js';

interface HallplanCreateParams {
    uuid?: string;
    screening: Screening;
}

interface HallplanProps extends EntityProps {
    screening: Screening;
    hall: Hall;
    soldSeats: string[];
}

export class Hallplan extends AggregateRoot<HallplanProps> {
    private constructor(props: HallplanProps) {
        super(props);
    }

    static create(params: HallplanCreateParams) {
        const props = {
            uuid: Uuid.create(params.uuid),
            screening: params.screening,
            hall: Hall.create(params.screening.hallNumber),
            soldSeats: [],
        };

        return new Hallplan(props);
    }
}

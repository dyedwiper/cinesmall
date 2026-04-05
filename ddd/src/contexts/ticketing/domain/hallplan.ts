import { AggregateRoot } from '../../../shared/domain/aggregateRoot.js';
import { type EntityProps } from '../../../shared/domain/entity.js';
import { Id } from '../../../shared/domain/id.js';
import { Hall } from './valueObjects.ts/hall.js';

interface HallplanCreateParams {
    id?: string;
    screeningId: string;
    hallNumber: number;
    soldSeats?: string[];
}

interface HallplanProps extends EntityProps {
    screeningId: Id;
    hall: Hall;
    soldSeats: string[];
}

export class Hallplan extends AggregateRoot<HallplanProps> {
    private constructor(props: HallplanProps) {
        super(props);
    }

    static create(params: HallplanCreateParams) {
        const props = {
            id: Id.create(params.id),
            screeningId: Id.create(params.screeningId),
            hall: Hall.create(params.hallNumber),
            soldSeats: params.soldSeats ?? [],
        };

        return new Hallplan(props);
    }

    reserveSeat(seat: string) {
        if (!this.props.hall.seats.includes(seat)) throw new Error('This seat does not exist in the hall.');

        if (this.props.soldSeats.includes(seat)) throw new Error('This seat is already reserved.');

        this.props.soldSeats.push(seat);
    }
}

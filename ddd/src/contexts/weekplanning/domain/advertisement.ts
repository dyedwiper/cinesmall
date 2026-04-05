import { Entity, type EntityProps } from '../../../shared/domain/entity.js';
import { Id } from '../../../shared/domain/id.js';
import { Duration } from './valueObjects/duration.js';

interface AdvertisementCreateParams {
    id?: string;
    screeningId: string;
    name: string;
    duration: number;
}

interface AdvertisementProps extends EntityProps {
    screeningId: Id;
    name: string;
    duration: Duration;
}

export class Advertisement extends Entity<AdvertisementProps> {
    get duration() {
        return this.props.duration.value;
    }

    private constructor(props: AdvertisementProps) {
        super(props);
    }

    static create(params: AdvertisementCreateParams) {
        const props = {
            id: Id.create(params.id),
            screeningId: Id.create(params.screeningId),
            name: params.name,
            duration: Duration.create(params.duration),
        };

        return new Advertisement(props);
    }
}

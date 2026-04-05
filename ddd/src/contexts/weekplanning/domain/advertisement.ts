import { Entity, type EntityProps } from '../../../shared/domain/entity.js';
import { Uuid } from '../../../shared/domain/uuid.js';
import { Duration } from './valueObjects/duration.js';

interface AdvertisementCreateParams {
    uuid?: string;
    screeningUuid: string;
    name: string;
    duration: number;
}

interface AdvertisementProps extends EntityProps {
    screeningUuid: Uuid;
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
            uuid: Uuid.create(params.uuid),
            screeningUuid: Uuid.create(params.screeningUuid),
            name: params.name,
            duration: Duration.create(params.duration),
        };

        return new Advertisement(props);
    }
}

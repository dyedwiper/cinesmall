import { Entity } from '../../../shared/domain/entity.js';

export interface AdvertisementProps {
    screeningUuid: string;
    name: string;
}

export class Advertisement extends Entity<AdvertisementProps> {
    private constructor(props: AdvertisementProps, uuid: string) {
        super(props, uuid);
    }

    static create(props: AdvertisementProps, uuid: string) {
        return new Advertisement(props, uuid);
    }
}

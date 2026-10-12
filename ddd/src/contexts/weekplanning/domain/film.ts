import { AggregateRoot } from '../../../shared/domain/baseClasses/aggregateRoot.js';
import { type EntityProps } from '../../../shared/domain/baseClasses/entity.js';
import { Id } from '../../../shared/domain/valueObjects/id.js';
import { Duration } from './valueObjects/duration.js';
import { FilmTitle } from './valueObjects/filmTitle.js';

interface CreateFilmParams {
    id?: string;
    title: string;
    duration: number;
    hasPoster: boolean;
}

interface FilmProps extends EntityProps {
    title: FilmTitle;
    duration: Duration;
    hasPoster: boolean;
}

export class Film extends AggregateRoot<FilmProps> {
    get duration() {
        return this.props.duration.value;
    }

    get hasPoster() {
        return this.props.hasPoster;
    }

    static create(params: CreateFilmParams) {
        const props = {
            id: Id.create(params.id),
            title: FilmTitle.create(params.title),
            duration: Duration.create(params.duration),
            hasPoster: params.hasPoster,
        };

        return new Film(props);
    }
}

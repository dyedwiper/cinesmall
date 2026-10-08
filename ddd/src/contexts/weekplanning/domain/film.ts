import { AggregateRoot } from '../../../shared/domain/baseClasses/aggregateRoot.js';
import { type EntityProps } from '../../../shared/domain/baseClasses/entity.js';
import { Id } from '../../../shared/domain/valueObjects/id.js';
import { Duration } from './valueObjects/duration.js';
import { FilmTitle } from './valueObjects/filmTitle.js';

interface CreateFilmParams {
    id?: string;
    title: string;
    duration: number;
}

interface FilmProps extends EntityProps {
    title: FilmTitle;
    duration: Duration;
}

export class Film extends AggregateRoot<FilmProps> {
    static create(params: CreateFilmParams) {
        const props = {
            id: Id.create(),
            title: FilmTitle.create(params.title),
            duration: Duration.create(params.duration),
        };

        return new Film(props);
    }
}

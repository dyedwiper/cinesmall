import { AggregateRoot } from '../../../shared/domain/baseClasses/aggregateRoot.js';
import { type EntityProps } from '../../../shared/domain/baseClasses/entity.js';
import { Id } from '../../../shared/domain/valueObjects/id.js';
import { Duration } from './valueObjects/duration.js';
import { FilmTitle } from './valueObjects/filmTitle.js';

interface CreateFilmParams {
    id?: string;
    title: string;
    duration: number;
    posterId?: Id;
}

interface FilmProps extends EntityProps {
    title: FilmTitle;
    duration: Duration;
    posterId?: Id;
}

export class Film extends AggregateRoot<FilmProps> {
    get duration() {
        return this.props.duration.value;
    }

    static create(params: CreateFilmParams) {
        const props = {
            id: Id.create(params.id),
            title: FilmTitle.create(params.title),
            duration: Duration.create(params.duration),
        };

        return new Film(props);
    }

    addPoster(posterId: Id) {
        if (this.props.posterId) {
            throw new Error('The film already has a poster.');
        }

        this.props.posterId = posterId;
    }
}

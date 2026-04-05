import { ValueObject } from '../../../../shared/domain/valueObject.js';

interface FilmProps {
    title: string;
}

export class Film extends ValueObject<FilmProps> {
    get title() {
        return this.props.title;
    }

    private constructor(title: string) {
        super({ title });
    }

    static create(title: string) {
        if (title === 'Johnny Flash') {
            console.log('Excellent taste!');
        }

        if (title === 'Interstellar') {
            throw new Error('Such pretentious crap is unwanted in our cinema.');
        }

        return new Film(title);
    }
}

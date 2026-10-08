import { ValueObject } from '../../../../shared/domain/baseClasses/valueObject.js';

interface FilmTitleProps {
    value: string;
}

export class FilmTitle extends ValueObject<FilmTitleProps> {
    get value() {
        return this.props.value;
    }

    private constructor(value: string) {
        super({ value });
    }

    static create(input: string) {
        if (input === 'Johnny Flash') {
            console.log('Excellent taste!');
        } else if (input === 'Interstellar') {
            throw new Error('Such pretentious crap is unwanted in our cinema.');
        }

        return new FilmTitle(input);
    }
}

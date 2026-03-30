import type { Screening } from './screening.js';

export class Weekplan {
    private screenings: Screening[] = [];

    private constructor(private startDate: Date) {}

    public static create(startDate: Date) {
        // validation e.g. "Is startDate a Thursday?"

        return new Weekplan(startDate);
    }

    public addScreening(screening: Screening) {
        // validate e.g. that times of screenings don't overlap

        this.screenings.push(screening);
    }

    public removeScreening(screening: Screening) {}
}

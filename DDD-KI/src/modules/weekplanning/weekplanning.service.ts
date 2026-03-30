// Service for managing weekly cinema schedule
export interface Screening {
    id: string;
    movieTitle: string;
    startTime: Date;
    advertisements: Advertisement[];
}

export interface Advertisement {
    id: string;
    content: string;
}

export class WeekPlanningService {
    private screenings: Screening[] = [];

    addScreening(screening: Screening) {
        this.screenings.push(screening);
    }

    removeScreening(screeningId: string) {
        this.screenings = this.screenings.filter((s) => s.id !== screeningId);
    }

    addAdvertisement(screeningId: string, ad: Advertisement) {
        const screening = this.screenings.find((s) => s.id === screeningId);
        if (screening) {
            screening.advertisements.push(ad);
        }
    }

    removeAdvertisement(screeningId: string, adId: string) {
        const screening = this.screenings.find((s) => s.id === screeningId);
        if (screening) {
            screening.advertisements = screening.advertisements.filter(
                (a) => a.id !== adId,
            );
        }
    }

    getSchedule() {
        return this.screenings;
    }
}

export interface GetWeekplanDto {
    id: string;
    startDate: string;
    screenings: ScreeningDto[];
}

interface ScreeningDto {
    id: string;
    date: string;
    hallNumber: number;
    film: string;
    duration: number;
    advertisements: AdvertisementDto[];
}

interface AdvertisementDto {
    id: string;
    name: string;
    duration: number;
}

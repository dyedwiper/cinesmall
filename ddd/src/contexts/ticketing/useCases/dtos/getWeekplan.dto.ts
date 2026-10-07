export interface GetWeekplanDto {
    id: string;
    startDate: string;
    screenings: ScreeningDto[];
}

interface ScreeningDto {
    id: string;
    date: string;
    hallNumber: number;
    filmTitle: string;
    duration: number;
    hallplanId?: string;
}

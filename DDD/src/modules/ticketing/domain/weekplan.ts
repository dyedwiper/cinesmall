import { Entity } from "../../../shared/domain/entity.js";

export interface WeekplanProps {
    startDate: Date;
    screenings: Screening[];
}

export class Weekplan extends Entity<>{}
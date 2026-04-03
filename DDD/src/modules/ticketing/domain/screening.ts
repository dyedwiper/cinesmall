import { Entity } from '../../../shared/domain/entity.js';

export interface ScreeningProps {
    weekplan_uuid: string;
    date: Date;
    film: string;
    hallNumber: number;
}

export class Screening extends Entity<ScreeningProps> {}

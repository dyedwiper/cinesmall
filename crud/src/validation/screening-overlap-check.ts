import type { InsertScreening, SelectScreening, SelectWeekplan } from '../db/types.js';

export function checkForOverlappingScreenings(screening: InsertScreening, weekplan: SelectWeekplan) {
    const screeningsInSameHall = weekplan.screenings?.filter((item) => item.hallNumber === screening.hallNumber);

    if (screeningsInSameHall?.some((item) => isOverlapping(item, screening))) {
        throw new Error('The screening overlaps with another screening.');
    }
}

function isOverlapping(existingScreening: SelectScreening, newScreening: InsertScreening) {
    if (existingScreening.id === newScreening.id) return false;

    const time1 = new Date(existingScreening.date).getTime();
    const time2 = new Date(newScreening.date).getTime();
    const duration1InMs = existingScreening.duration * 60 * 1000;
    const duration2InMs = newScreening.duration * 60 * 1000;
    const durationOfAds1InMs = computeDurationOfAdvertisements(existingScreening) * 60 * 1000;

    return (
        (time1 <= time2 && time1 + duration1InMs + durationOfAds1InMs > time2) ||
        (time2 <= time1 && time2 + duration2InMs > time1)
    );
}

function computeDurationOfAdvertisements(screening: SelectScreening) {
    const sum = screening.advertisements?.reduce((acc, cur) => acc + cur.duration, 0);

    return sum ?? 0;
}

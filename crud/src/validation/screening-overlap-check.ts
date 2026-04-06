import type { Screening, Weekplan } from '../db/types.js';

export function checkForOverlappingScreenings(screening: Screening, weekplan: Weekplan) {
    const screeningsInSameHall = weekplan.screenings?.filter((item) => item.hallNumber === screening.hallNumber);

    if (screeningsInSameHall?.some((item) => isOverlapping(item, screening))) {
        throw new Error('The screening overlaps with another screening.');
    }
}

function isOverlapping(screening1: Screening, screening2: Screening) {
    if (screening1.id === screening2.id) return false;

    const time1 = new Date(screening1.date).getTime();
    const time2 = new Date(screening2.date).getTime();
    const duration1InMs = screening1.duration * 60 * 1000;
    const duration2InMs = screening2.duration * 60 * 1000;
    const durationOfAds1InMs = computeDurationOfAdvertisements(screening1) * 60 * 1000;
    const durationOfAds2InMs = computeDurationOfAdvertisements(screening2) * 60 * 1000;

    return (
        (time1 <= time2 && time1 + duration1InMs + durationOfAds1InMs > time2) ||
        (time2 <= time1 && time2 + duration2InMs + durationOfAds2InMs > time1)
    );
}

function computeDurationOfAdvertisements(screening: Screening) {
    const sum = screening.advertisements?.reduce((acc, cur) => acc + cur.duration, 0);

    return sum ?? 0;
}

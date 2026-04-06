import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { seatsInHall1, seatsInHall2 } from '../constants.js';
import { db } from '../db/index.js';
import { hallplans } from '../db/schema.js';
import type { Hallplan, Screening } from '../db/types.js';

export async function createHallplans(weekplanId: string) {
    const weekplan = await db.query.weekplans.findFirst({ where: { id: weekplanId }, with: { screenings: true } });

    if (!weekplan) throw new Error('Weekplan not found.');

    const promises = weekplan.screenings.map((screening) => createHallplan(screening));
    await Promise.all(promises);
}

export async function reserveSeats(hallplanId: string, seats: string[]) {
    const hallplan = await db.query.hallplans.findFirst({ where: { id: hallplanId } });

    if (!hallplan) throw new Error('Hallplan not found.');

    const reservedSeats = hallplan.reservedSeats as string[];

    seats.forEach((seat) => {
        checkIfSeatExistInHall(hallplan, seat);
        checkIfSeatIsAvailable(reservedSeats, seat);
        reservedSeats.push(seat);
    });

    await db.update(hallplans).set({ reservedSeats }).where(eq(hallplans.id, hallplanId));
}

async function createHallplan(screening: Screening) {
    const hallplan = {
        id: crypto.randomUUID().toString(),
        screeningId: screening.id,
        hallNumber: screening.hallNumber,
        reservedSeats: [],
    };

    await db.insert(hallplans).values(hallplan);
}

function checkIfSeatExistInHall(hallplan: Hallplan, seat: string) {
    if (hallplan.hallNumber === 1) {
        if (!seatsInHall1.includes(seat)) {
            throw new Error('This seat does not exist in the hall.');
        }
    } else {
        if (!seatsInHall2.includes(seat)) {
            throw new Error('This seat does not exist in the hall.');
        }
    }
}

function checkIfSeatIsAvailable(existingReservations: string[], seat: string) {
    if (existingReservations.includes(seat)) {
        throw new Error('This seat is already reserved.');
    }
}

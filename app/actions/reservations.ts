"use server";

import prisma from "@/lib/prisma";

export type ReservationInput = {
  customerName: string;
  email?: string;
  phone?: string;
  city?: string;
  restaurant?: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
};

export async function createReservation(data: ReservationInput) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        restaurant: data.restaurant,
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        notes: data.notes,
      },
    });

    return { success: true, reservationId: reservation.id };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return { success: false, error: "Failed to create reservation" };
  }
}

export async function getReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    return reservations;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return [];
  }
}

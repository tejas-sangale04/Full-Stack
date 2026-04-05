"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRestaurantStatus() {
  try {
    let status = await prisma.restaurantStatus.findFirst();

    // If no status exists, create a default one
    if (!status) {
      status = await prisma.restaurantStatus.create({
        data: {
          isOpen: true,
          isManual: false,
        },
      });
    }

    return status;
  } catch (error) {
    console.error("Error fetching restaurant status:", error);
    return null;
  }
}

export async function updateRestaurantStatus(data: { isOpen: boolean; isManual: boolean }) {
  try {
    const currentStatus = await prisma.restaurantStatus.findFirst();

    if (currentStatus) {
      await prisma.restaurantStatus.update({
        where: { id: currentStatus.id },
        data: {
          isOpen: data.isOpen,
          isManual: data.isManual,
        },
      });
    } else {
      await prisma.restaurantStatus.create({
        data: {
          isOpen: data.isOpen,
          isManual: data.isManual,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating restaurant status:", error);
    return { success: false, error: error.message };
  }
}

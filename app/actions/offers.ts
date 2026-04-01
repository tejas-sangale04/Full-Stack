"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOffers() {
  try {
    let offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Seed the database with static offers if none exist
    if (offers.length === 0) {
      const staticOffers = [
        {
          title: "Breakfast Combo",
          description: "Any Paratha + Tea + Lassi",
          originalPrice: 280,
          discountedPrice: 199,
        },
        {
          title: "Paneer Special Thali",
          description: "Paneer Butter Masala + Dal + Rice + 2 Rotis + Lassi",
          originalPrice: 650,
          discountedPrice: 499,
        },
        {
          title: "Starter Trio",
          description: "Veg Spring Roll + Gobi Manchurian + Paneer 65",
          originalPrice: 730,
          discountedPrice: 549,
        },
      ];

      await prisma.offer.createMany({
        data: staticOffers as any,
      });

      offers = await prisma.offer.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return offers;
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return [];
  }
}

export async function addOffer(data: { 
  title: string; 
  description: string; 
  originalPrice?: number;
  discountedPrice?: number;
  imageUrl?: string 
}) {
  try {
    const newOffer = await prisma.offer.create({
      data: {
        title: data.title,
        description: data.description,
        originalPrice: data.originalPrice || null,
        discountedPrice: data.discountedPrice || null,
        imageUrl: data.imageUrl || null,
      } as any,
    });
    revalidatePath("/admin");
    revalidatePath("/offers");
    return { success: true, offer: newOffer };
  } catch (error: any) {
    console.error("Failed to add offer:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOffer(id: string) {
  try {
    await prisma.offer.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/offers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete offer:", error);
    return { success: false, error: error.message };
  }
}

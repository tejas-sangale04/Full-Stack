"use server";

import prisma from "@/lib/prisma";

export async function getMenuItems() {
  let items = await prisma.menuItem.findMany();

  // Seed the empty database with mock items if there are no items
  if (items.length === 0) {
    const allItems = [
      { name: "Cheese Bowl", price: 320, category: "Starters", description: "Delicious cheese bowl" },
      { name: "Veg Manchurian Dry", price: 220, category: "Starters", description: "Spicy and crispy" },
      { name: "Paneer Chilly Dry", price: 270, category: "Starters", description: "Classic paneer chilly" },
      { name: "Gobi Manchurian", price: 220, category: "Starters", description: "Cauliflower tossed in sauce" },
      { name: "Mix Veg", price: 220, category: "Main Course", description: "Mixed vegetables" },
      { name: "Paneer Butter Masala", price: 270, category: "Main Course", description: "Creamy paneer" },
      { name: "Paneer Masala", price: 260, category: "Paneer Special", description: "Spicy paneer" },
      { name: "Misal Pav", price: 110, category: "Breakfast", description: "Traditional Maharashtrian breakfast" },
      { name: "Coffee", price: 40, category: "Drinks", description: "Hot coffee" },
      { name: "Tea", price: 30, category: "Drinks", description: "Hot tea" },
    ];

    await prisma.menuItem.createMany({
      data: allItems,
    });

    items = await prisma.menuItem.findMany();
  }

  return items;
}

export async function addMenuItem(data: { name: string; description: string; price: number; category: string; imageUrl?: string }) {
  try {
    const newItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || null,
      },
    });
    return { success: true, item: newItem };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await prisma.menuItem.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

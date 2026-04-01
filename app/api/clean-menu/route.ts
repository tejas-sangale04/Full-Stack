
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Delete incorrect items (duplicates or miscategorized)
    // We found IDs for "Mix Veg Pakoda" and "Veg Green Salad" earlier.
    // I'll delete all instances of them to be safe, as they were reported as incorrect/duplicates.
    const deleted = await prisma.menuItem.deleteMany({
      where: {
        name: {
          in: ["Mix Veg Pakoda", "Veg Green Salad"]
        }
      }
    });

    // 2. Add new items from the printed menu
    const newItems = [
      { name: "Roti", price: 25, category: "Tandoori Bread", description: "Tandoori Roti" },
      { name: "Butter Roti", price: 30, category: "Tandoori Bread", description: "Tandoori Roti with butter" },
      { name: "Chapati", price: 20, category: "Tandoori Bread", description: "Traditional Indian bread" },
      { name: "Butter Chapati", price: 25, category: "Tandoori Bread", description: "Bread with butter" },
      { name: "Naan", price: 50, category: "Tandoori Bread", description: "Soft leavened bread" },
      { name: "Butter Naan", price: 55, category: "Tandoori Bread", description: "Naan with butter" },
      { name: "Garlic Naan", price: 60, category: "Tandoori Bread", description: "Naan with garlic" },
      { name: "Butter Garlic Naan", price: 65, category: "Tandoori Bread", description: "Naan with garlic and butter" },
      { name: "Cheese Garlic Naan", price: 75, category: "Tandoori Bread", description: "Naan with garlic and cheese" },
      { name: "Kulcha", price: 55, category: "Tandoori Bread", description: "Stuffed bread" },
      { name: "Roti Ki Tokri", price: 380, category: "Tandoori Bread", description: "Assorted breads basket" },
      { name: "Bhakri", price: 30, category: "Tandoori Bread", description: "Traditional flatbread" },
      { name: "Butter Bhakri", price: 35, category: "Tandoori Bread", description: "Flatbread with butter" },
      { name: "Missi Roti", price: 50, category: "Tandoori Bread", description: "Spiced gram flour bread" },
      { name: "Lachha Paratha", price: 45, category: "Tandoori Bread", description: "Layered bread" },
      { name: "Butter Lachha Paratha", price: 50, category: "Tandoori Bread", description: "Layered bread with butter" },
      { name: "Jwari Bhakri", price: 30, category: "Tandoori Bread", description: "Sorghum flatbread" },
      { name: "Butter Jwari Bhakri", price: 35, category: "Tandoori Bread", description: "Sorghum flatbread with butter" },
      { name: "Kashmiri Naan", price: 100, category: "Tandoori Bread", description: "Sweat and nutty naan" },
      { name: "Butter Garlic Kulcha", price: 70, category: "Tandoori Bread", description: "Kulcha with garlic and butter" },
      { name: "Steam Rice", price: 150, category: "Basmati Ki Khushboo", description: "Plain steamed rice (Full)" },
      { name: "Jeera Rice", price: 160, category: "Basmati Ki Khushboo", description: "Cumin flavored rice (Full)" },
      { name: "Veg Pulav", price: 190, category: "Basmati Ki Khushboo", description: "Vegetable pilaf" },
      { name: "Green Pease Pulav", price: 210, category: "Basmati Ki Khushboo", description: "Green peas pilaf" },
      { name: "Veg Biryani", price: 210, category: "Basmati Ki Khushboo", description: "Vegetable biryani" },
      { name: "Kashmiri Pulav", price: 230, category: "Basmati Ki Khushboo", description: "Sweet and nutty pilaf" },
      { name: "Veg Hydrabadi Biryani", price: 240, category: "Basmati Ki Khushboo", description: "Spicy Hyderabadi style biryani" },
      { name: "Curd Rice", price: 180, category: "Basmati Ki Khushboo", description: "Yogurt rice" },
      { name: "Dal Khichada", price: 190, category: "Basmati Ki Khushboo", description: "Lentil and rice porridge" },
      { name: "Butter Dal Khichada", price: 200, category: "Basmati Ki Khushboo", description: "Lentil and rice porridge with butter" },
      { name: "Paneer Tikka Dum Biryani", price: 290, category: "Basmati Ki Khushboo", description: "Biryani with paneer tikka" }
    ];

    const added = await prisma.menuItem.createMany({
      data: newItems
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: deleted.count,
      addedCount: added.count 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

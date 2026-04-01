const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const menuData = {
  allday: { label: "All Day", items: [{ name: "Misal Pav", price: 110 },{ name: "Chole Bhature", price: 180 },{ name: "Finger Chips", price: 130 },{ name: "Onion Pakoda", price: 100 },{ name: "Mix Veg Pakoda", price: 120 },{ name: "Veg Green Salad", price: 80 },{ name: "Tea", price: 30 },{ name: "Coffee", price: 40 },{ name: "Lassi (Sweet)", price: 50 },{ name: "Lassi (Salted)", price: 70 },{ name: "Butter Milk (Chas)", price: 40 }] },
  starters: { label: "Starters", items: [{ name: "Cheese Bowl", price: 320 },{ name: "Veg Manchurian Dry", price: 220 },{ name: "Veg Manchurian Gravy", price: 220 },{ name: "Paneer Chilly Dry", price: 270 },{ name: "Paneer Chilly Gravy", price: 280 },{ name: "Soyabean Chilli", price: 200 },{ name: "Gobi Manchurian", price: 220 },{ name: "Paneer Manchurian", price: 280 },{ name: "Baby Corn Chilly", price: 250 },{ name: "Mushroom Chilly", price: 260 },{ name: "Paneer Perry Perry", price: 300 },{ name: "Paneer Sathey", price: 310 },{ name: "Spicy Coriander Paneer", price: 280 },{ name: "Spicy Coriander Veg", price: 240 },{ name: "Veg Green Pepper", price: 250 },{ name: "Paneer Crispy", price: 310 },{ name: "Veg Crispy", price: 260 },{ name: "Veg Spring Roll", price: 260 },{ name: "Veg 65", price: 250 },{ name: "Paneer 65", price: 290 }] },
  maincourse: { label: "Main Course", items: [{ name: "Mix Veg", price: 220 },{ name: "Veg Kolhapuri", price: 220 },{ name: "Veg Kadhai", price: 230 },{ name: "Aloo Mutter", price: 200 },{ name: "Aloo Jeera", price: 200 },{ name: "Chana Masala", price: 200 },{ name: "Veg Tawa", price: 240 },{ name: "Chana Paneer Masala", price: 270 },{ name: "Mushroom Masala", price: 290 },{ name: "Veg Diwani Handi", price: 290 },{ name: "Mutter Paneer", price: 270 },{ name: "Veg Makhanwala", price: 250 },{ name: "Veg Peshwai", price: 290 },{ name: "Veg Koliwada Masala", price: 290 },{ name: "Methi Mutter Malai", price: 270 },{ name: "Methi Mutter", price: 220 },{ name: "Green Peas Masala", price: 220 },{ name: "Palak Paneer", price: 260 },{ name: "Veg Kabab Masala", price: 290 },{ name: "Veg Lahori", price: 280 },{ name: "Veg Angara", price: 310 },{ name: "Veg Tufani", price: 280 },{ name: "Veg Falguni", price: 290 },{ name: "Veg Hungama", price: 340 },{ name: "Bhendi Masala", price: 190 },{ name: "Bhendi Fry", price: 180 },{ name: "Navaratna Korma (Sweet)", price: 290 },{ name: "Kaju Masala", price: 270 },{ name: "Kaju Curry (Sweet)", price: 290 }] },
  paneerspecial: { label: "Paneer Special", items: [{ name: "Paneer Masala", price: 260 },{ name: "Paneer Tikka Masala", price: 280 },{ name: "Paneer Butter Masala", price: 270 },{ name: "Paneer Banjara Tikka Masala", price: 290 },{ name: "Paneer Tufani", price: 310 },{ name: "Paneer Angara", price: 340 },{ name: "Paneer Lachhedar", price: 320 },{ name: "Paneer Peer Bali", price: 340 },{ name: "Paneer Pathani", price: 320 },{ name: "Paneer Bhurji", price: 280 },{ name: "Paneer Lahori", price: 310 },{ name: "Paneer Anarkali", price: 350 },{ name: "Paneer Kolhapuri", price: 280 },{ name: "Kaju Paneer Masala", price: 290 }] },
  breakfast: { label: "Breakfast", items: [{ name: "Misal Pav", price: 110 },{ name: "Chole Bhature", price: 180 },{ name: "Paneer Paratha", price: 140 },{ name: "Gobi Paratha", price: 100 },{ name: "Aloo Paratha", price: 100 },{ name: "Veg Stuff Paratha", price: 130 },{ name: "Cheese Stuff Paratha", price: 160 },{ name: "Kerala Paratha", price: 110 },{ name: "Veg Sandwich", price: 80 },{ name: "Club Sandwich", price: 120 },{ name: "Bread Sandwich", price: 50 },{ name: "Toast Cheese Sandwich", price: 110 },{ name: "Toast Butter Jam", price: 70 },{ name: "Bread Butter", price: 50 },{ name: "Tea", price: 30 },{ name: "Coffee", price: 40 }] },
  beverages: { label: "Cold Beverages", items: [{ name: "Fresh Lemon Soda", price: 50 },{ name: "Fresh Lemon Water", price: 40 },{ name: "Strawberry Milk Shake", price: 120 },{ name: "Chocolate Milk Shake", price: 120 },{ name: "Rose Milk Shake", price: 120 },{ name: "Kesar Milk Shake", price: 140 },{ name: "Mango Milk Shake", price: 120 },{ name: "Fresh Fruit Juice", price: 120 }] },
  marathispecial: { label: "Marathi Special", items: [{ name: "Shev Bhaji", price: 180 },{ name: "Shev Bhaji Maratha(Black)", price: 200 },{ name: "Veg shev Bhaji", price: 210 },{ name: "Veg Maratha", price: 230 },{ name: "Rassa Patodi", price: 230 },{ name: "Pithala", price: 170 },{ name: "Thecha", price: 90 },{ name: "Began Handi", price: 230 }] },
  drinks: { label: "Drinks", items: [{ name: "Tea", price: 30 },{ name: "Coffee", price: 40 },{ name: "Lassi (Sweet)", price: 50 },{ name: "Lassi (Salted)", price: 70 },{ name: "Butter Milk (Chas)", price: 40 }] }
};

async function main() {
  console.log("Checking and inserting missing items...");
  
  const existingItems = await prisma.menuItem.findMany();
  const existingNames = new Set(existingItems.map(i => i.name));
  
  const allItems = [];
  Object.values(menuData).forEach((cat) => {
    cat.items.forEach((item) => {
      // deduplicate if multiple categories have "Tea" in our own data
      if (!allItems.some(i => i.name === item.name) && !existingNames.has(item.name)) {
        allItems.push({
          name: item.name,
          price: item.price,
          category: cat.label,
          description: "Delicious " + item.name.toLowerCase()
        });
      }
    });
  });

  if (allItems.length > 0) {
    console.log(`Inserting ${allItems.length} new items...`);
    await prisma.menuItem.createMany({
      data: allItems,
    });
    console.log("Migration complete!");
  } else {
    console.log("All items already exist in database.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

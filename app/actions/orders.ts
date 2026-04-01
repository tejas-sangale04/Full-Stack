"use server";

import prisma from "@/lib/prisma";

export type OrderItemInput = {
  menuItemId: string;
  quantity: number;
};

export async function createOrder(tableNo: string, items: OrderItemInput[]) {
  try {
    const order = await prisma.order.create({
      data: {
        tableNumber: tableNo as any, // Type bypass until prisma generate runs successfully
        status: "PENDING",
        items: {
          create: items.map(item => ({
            menuItem: { connect: { id: item.menuItemId } },
            quantity: item.quantity,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders.map(order => ({
    id: order.id,
    table: order.tableNumber.toString(),
    status: order.status.toLowerCase(),
    time: order.createdAt.toLocaleTimeString(),
    total: order.items.reduce((sum, item) => sum + item.quantity * item.menuItem.price, 0),
    items: order.items.map(item => ({
      name: item.menuItem.name,
      price: item.menuItem.price,
      qty: item.quantity,
    })),
  }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toUpperCase() },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

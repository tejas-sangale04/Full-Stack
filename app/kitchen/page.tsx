"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, ChefHat, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useSession, signOut } from "next-auth/react"
import { getOrders, updateOrderStatus } from "@/app/actions/orders"

type OrderItem = { name: string; price: number; qty: number }
type StockItem = { name: string; unit: string; total: number; used: number }
type Order = {
  id: string
  table: string
  waiter?: string
  items: OrderItem[]
  total: number
  status: string
  time: string
}

export default function KitchenPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"orders" | "stock">("orders")
  const [stock, setStock] = useState<StockItem[]>([])

  const [newItemName, setNewItemName] = useState("")
  const [newItemUnit, setNewItemUnit] = useState("kg")
  const [newItemAmount, setNewItemAmount] = useState(10)

  const addNewItem = () => {
    if (!newItemName) return
    const newStock = [...stock, { name: newItemName, unit: newItemUnit, total: newItemAmount, used: 0 }]
    setStock(newStock)
    localStorage.setItem("restaurantStock", JSON.stringify(newStock))
    setNewItemName("")
    setNewItemAmount(10)
  }

  const loadData = useCallback(async () => {
    try {
      const dbOrders = await getOrders()
      setOrders(dbOrders)

      const st = localStorage.getItem("restaurantStock")
      if (st) setStock(JSON.parse(st))
    } catch (error) {
      console.error("Failed to load data", error)
    } finally {
      if (loading) setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [sessionStatus, router])

  useEffect(() => {
    if (sessionStatus !== "authenticated") return
    
    // Initial fetch
    loadData()
    
    // Poll every 5 seconds for new orders/stock changes
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [sessionStatus, loadData])

  const updateStockItem = (index: number, field: "used" | "total", value: number) => {
    const newStock = [...stock]
    newStock[index] = { ...newStock[index], [field]: Math.max(0, value) }
    setStock(newStock)
    localStorage.setItem("restaurantStock", JSON.stringify(newStock))
  }

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o)
    setOrders(updated)
    
    // Server action
    await updateOrderStatus(id, newStatus)
  }

  const clearReady = async () => {
    const readyOrders = orders.filter(o => o.status === "ready")
    // Hide them optimistically
    const filtered = orders.filter(o => o.status !== "ready")
    setOrders(filtered)
    
    // In a real app, you might update these to "DELIVERED" or "ARCHIVED"
    await Promise.all(readyOrders.map(o => updateOrderStatus(o.id, "delivered")))
  }

  const pending = orders.filter(o => o.status === "pending")
  const preparing = orders.filter(o => o.status === "preparing")
  const ready = orders.filter(o => o.status === "ready")

  const statusColor = (status: string) => {
    if (status === "pending") return "border-amber-300 bg-amber-50"
    if (status === "preparing") return "border-blue-300 bg-blue-50"
    return "border-green-300 bg-green-50"
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ChefHat className="h-7 w-7 text-primary" />
            <h1 className="font-serif text-3xl text-foreground">Kitchen Display</h1>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-border shadow-sm">
            <button onClick={() => setView("orders")} className={`rounded-full px-5 py-2 text-xs font-bold transition ${view === "orders" ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}>
              ORDERS
            </button>
            <button onClick={() => setView("stock")} className={`rounded-full px-5 py-2 text-xs font-bold transition ${view === "stock" ? "bg-amber-600 text-white shadow-md" : "text-muted-foreground hover:bg-muted"}`}>
              STOCK MGMT
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={loadData} className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition">
              Refresh
            </button>
            {ready.length > 0 && (
              <button onClick={clearReady} className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition">
                Clear Ready ({ready.length})
              </button>
            )}
          </div>
        </div>

        {/* STATS (only visible on orders view) */}
        {view === "orders" && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: "Pending", count: pending.length, color: "text-amber-600" },
            { label: "Preparing", count: preparing.length, color: "text-blue-600" },
            { label: "Ready", count: ready.length, color: "text-green-600" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-4 text-center shadow-sm">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        )}

        {view === "orders" && (
          <>
            {(pending.length + preparing.length + ready.length) === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <ChefHat className="h-16 w-16 opacity-20 mb-4" />
                <p className="text-lg font-medium">No orders yet</p>
                <p className="text-sm">Waiting for waiter to send orders...</p>
              </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orders.filter(o => ["pending", "preparing", "ready"].includes(o.status)).map(order => (
              <div key={order.id} className={`rounded-2xl border-2 p-5 shadow-sm ${statusColor(order.status)}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg text-foreground">Table {order.table}</span>
                    <p className="text-xs text-muted-foreground">Order ID: {order.id.slice(-4)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> {order.time}
                    </p>
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                      order.status === "pending" ? "text-amber-600" :
                      order.status === "preparing" ? "text-blue-600" : "text-green-600"
                    }`}>{order.status}</span>
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-1.5 border-t border-black/10 pt-3">
                  {order.items.map((item, idx) => (
                    <div key={`${order.id}-${item.name}-${idx}`} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.qty}x {item.name}</span>
                      <span className="text-muted-foreground">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-bold text-sm">
                    <span>Total</span>
                    <span className="text-primary">₹{order.total}/-</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button onClick={() => updateStatus(order.id, "preparing")}
                      className="flex-1 rounded-full bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition">
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateStatus(order.id, "ready")}
                      className="flex-1 rounded-full bg-green-600 py-2 text-xs font-bold text-white hover:bg-green-700 transition flex items-center justify-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Mark Ready
                    </button>
                  )}
                  {order.status === "ready" && (
                    <div className="flex-1 rounded-full bg-green-100 py-2 text-xs font-bold text-green-700 text-center">
                      ✓ Ready to Serve
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {view === "stock" && (
          <div className="flex flex-col gap-6">

            {/* CUSTOM NEW INGREDIENT FORM */}
            <div className="rounded-2xl border border-border bg-background p-5 shadow-sm flex items-end gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-muted-foreground">New Ingredient Name</label>
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="e.g. Garlic, Mint Base" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="w-24">
                <label className="text-xs font-semibold text-muted-foreground">Unit</label>
                <input type="text" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} placeholder="kg, L, pcs" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="w-24">
                <label className="text-xs font-semibold text-muted-foreground">Total Amt.</label>
                <input type="number" min="1" value={newItemAmount} onChange={e => setNewItemAmount(parseInt(e.target.value)||1)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <button onClick={addNewItem} disabled={!newItemName} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 h-[38px] flex items-center justify-center">
                + Add Item
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stock.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-10">
                No stock data found! The Admin must log in and visit the dashboard at least once to initialize the stock levels.
              </p>
            )}
            {stock.map((item, idx) => {
              const left = item.total - item.used
              const pct = Math.max(0, Math.min(100, Math.round((left / item.total) * 100)) || 0)
              const color = pct > 50 ? "bg-green-500" : pct > 25 ? "bg-amber-500" : "bg-red-500"
              
              return (
                <div key={item.name} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-foreground text-lg">{item.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>{pct}% left</span>
                  </div>
                  <div className="mb-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-4">
                    {/* USED AMOUNT */}
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground text-center block mb-1">
                        Amount Used ({item.unit})
                      </label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStockItem(idx, "used", item.used - 1)} className="flex h-8 w-8 items-center justify-center rounded bg-muted/80 text-foreground font-bold hover:bg-muted transition text-lg leading-none pb-1">-</button>
                        <input 
                          type="number" min="0" value={item.used}
                          onChange={(e) => updateStockItem(idx, "used", parseInt(e.target.value) || 0)}
                          className="w-full rounded text-center border border-border px-1 py-1 text-sm font-bold focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => updateStockItem(idx, "used", item.used + 1)} className="flex h-8 w-8 items-center justify-center rounded bg-muted/80 text-foreground font-bold hover:bg-muted transition text-lg leading-none pb-1">+</button>
                      </div>
                    </div>
                    
                    {/* TOTAL AMOUNT */}
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground text-center block mb-1">
                        Stock Received ({item.unit})
                      </label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStockItem(idx, "total", item.total - 1)} className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition text-lg leading-none pb-1">-</button>
                        <input 
                          type="number" min="1" value={item.total}
                          onChange={(e) => updateStockItem(idx, "total", parseInt(e.target.value) || 1)}
                          className="w-full rounded text-center border border-border px-1 py-1 text-sm font-bold focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => updateStockItem(idx, "total", item.total + 1)} className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition text-lg leading-none pb-1">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        )}

      </main>
    </div>
  )
}

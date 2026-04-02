"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus, Trash2, Send, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useSession, signOut } from "next-auth/react"
import { getMenuItems } from "@/app/actions/menu"
import { createOrder, getOrders, updateOrderStatus } from "@/app/actions/orders"

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

type OrderItem = MenuItem & { qty: number }
type ActiveOrder = {
  id: string
  table: string
  status: string
  time: string
  total: number
  items: { name: string; price: number; qty: number }[]
}

export default function WaiterPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const [tableNo, setTableNo] = useState("")
  const [order, setOrder] = useState<OrderItem[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [sent, setSent] = useState(false)
  
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([])

  // Fetch orders polling
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders()
        setActiveOrders(data)
      } catch (err) {
        console.error("Failed to load orders", err)
      }
    }
    
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const markDelivered = async (id: string) => {
    // Optimistic update - hide it instantly
    setActiveOrders(prev => prev.filter(o => o.id !== id))
    // Server action
    await updateOrderStatus(id, "delivered")
  }

  // Fetch Menu Items from DB
  useEffect(() => {
    async function loadMenu() {
      try {
        const fetchedItems = await getMenuItems()
        setItems(fetchedItems)
        const uniqueCategories = Array.from(new Set(fetchedItems.map(i => i.category)))
        setCategories(["All", ...uniqueCategories])
      } catch (error) {
        console.error("Failed to load menu items", error)
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [])

  const filtered = items.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const addItem = (item: MenuItem) => {
    setOrder(prev => {
      const existing = prev.find(o => o.id === item.id)
      if (existing) return prev.map(o => o.id === item.id ? { ...o, qty: o.qty + 1 } : o)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setOrder(prev => prev
      .map(o => o.id === id ? { ...o, qty: o.qty + delta } : o)
      .filter(o => o.qty > 0)
    )
  }

  const total = order.reduce((sum, o) => sum + o.price * o.qty, 0)

  const sendToKitchen = async () => {
    if (!tableNo || order.length === 0) return
    setSubmitting(true)
    
    try {
      const dbItems = order.map(o => ({ menuItemId: o.id, quantity: o.qty }))
      const res = await createOrder(tableNo, dbItems)
      
      if (res.success) {
        // Also add to localStorage for immediate UI simulation if needed, 
        // but now Kitchen should read from DB! 
        // For backwards compatibility until Kitchen is updated:
        const localOrders = JSON.parse(localStorage.getItem("kitchenOrders") || "[]")
        localOrders.push({
          id: res.orderId,
          table: tableNo,
          waiter: session?.user?.name || session?.user?.email || "waiter",
          items: order,
          total,
          status: "pending",
          time: new Date().toLocaleTimeString(),
        })
        localStorage.setItem("kitchenOrders", JSON.stringify(localOrders))

        setSent(true)
        setOrder([])
        setTableNo("")
        setTimeout(() => setSent(false), 3000)
      } else {
        alert("Failed to create order in database.")
      }
    } catch (err) {
      console.error(err)
      alert("Error placing order")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-foreground">Take Order</h1>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* Left: Menu */}
          <div className="flex-1">
            {/* Search + Category */}
            <div className="mb-4 flex flex-wrap gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search items..."
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition ${
                    activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map(item => (
                  <button key={item.id} onClick={() => addItem(item)}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition hover:border-primary/40 hover:shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">₹{item.price}</span>
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-xl text-foreground">Order Summary</h2>

              <div className="mb-4">
                <label className="mb-1 block text-xs font-semibold tracking-widest text-muted-foreground">TABLE NUMBER</label>
                <input
                  type="text"
                  value={tableNo}
                  onChange={e => setTableNo(e.target.value)}
                  placeholder="e.g. T-5"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {order.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No items added yet</p>
              ) : (
                <div className="mb-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {order.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <p className="flex-1 text-sm text-foreground truncate">{item.name}</p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, -1)} className="rounded p-0.5 hover:bg-muted">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="rounded p-0.5 hover:bg-muted">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-primary w-16 text-right">₹{item.price * item.qty}</span>
                      <button onClick={() => setOrder(prev => prev.filter(o => o.id !== item.id))}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {order.length > 0 && (
                <div className="mb-4 border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary">₹{total}/-</span>
                </div>
              )}

              {sent && (
                <p className="mb-3 rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700 font-medium">
                  Order sent to kitchen!
                </p>
              )}

              <button
                onClick={sendToKitchen}
                disabled={!tableNo || order.length === 0 || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold tracking-widest text-primary-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "SENDING..." : "SEND TO KITCHEN"}
              </button>
            </div>

            {/* READY ORDERS NOTIFICATIONS */}
            {activeOrders.filter(o => o.status === "ready").length > 0 && (
              <div className="mt-8 rounded-2xl border-2 border-green-500 bg-green-50 p-6 shadow-lg relative overflow-hidden transition-all">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500 animate-pulse"></div>
                <h2 className="mb-4 font-serif text-xl text-green-900 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Ready to Serve!
                </h2>
                
                <div className="flex flex-col gap-4">
                  {activeOrders.filter(o => o.status === "ready").map(order => (
                    <div key={order.id} className="rounded-xl border border-green-200 bg-white p-4 shadow-sm animate-in slide-in-from-bottom-5">
                      <div className="flex justify-between items-center mb-2 lg:mb-4">
                        <span className="font-bold text-lg text-foreground">Table {order.table}</span>
                        <span className="text-xs font-semibold text-muted-foreground bg-green-100 px-2 py-1 rounded">{order.time}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mb-4 px-2 tracking-wide leading-relaxed">
                        {order.items.map(i => `${i.qty}x ${i.name}`).join(" • ")}
                      </div>
                      <button 
                        onClick={() => markDelivered(order.id)}
                        className="w-full rounded-lg bg-green-600 py-3 text-xs font-bold tracking-widest text-white hover:bg-green-700 hover:shadow-md transition active:scale-[0.98]"
                      >
                        MARK AS DELIVERED
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  )
}

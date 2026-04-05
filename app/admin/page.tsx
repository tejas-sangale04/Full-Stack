"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts"
import { TrendingUp, ShoppingBag, Package, Users, LogOut, RefreshCw, CalendarCheck, Trash2, Plus, ChevronDown, Languages } from "lucide-react"
import { getReservations } from "@/app/actions/reservations"
import { getMenuItems, addMenuItem, deleteMenuItem } from "@/app/actions/menu"
import { getOffers, addOffer, deleteOffer } from "@/app/actions/offers"
import { getOrders } from "@/app/actions/orders"
import { getRestaurantStatus, updateRestaurantStatus } from "@/app/actions/status"
import { useLanguage } from "@/components/language-provider"

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

// add Reservation type
/*ype Reservation = {
  id: string;
  customerName: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  restaurant?: string | null;
  date: string;
  time: string;
  partySize: number;
  notes?: string | null;
}*/

type Order = {
  id: string; table: string; waiter: string
  items: { name: string; price: number; qty: number }[]
  total: number; status: string; time: string
  date?: string
}

/*ype Offer = {
  id: string;
  title: string;
  description: string;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
}*/



export const DEFAULT_STOCK = [
  { name: "Paneer", unit: "kg", total: 20, used: 14 },
  { name: "Tomatoes", unit: "kg", total: 15, used: 9 },
  { name: "Onions", unit: "kg", total: 25, used: 18 },
  { name: "Rice", unit: "kg", total: 30, used: 12 },
  { name: "Flour (Maida)", unit: "kg", total: 20, used: 7 },
  { name: "Cooking Oil", unit: "L", total: 10, used: 6 },
  { name: "Milk", unit: "L", total: 15, used: 11 },
  { name: "Butter", unit: "kg", total: 5, used: 3 },
  { name: "Spices Mix", unit: "kg", total: 8, used: 5 },
  { name: "Bread", unit: "pcs", total: 100, used: 60 },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
 // const [reservations, setReservations] = useState<Reservation[]>([])
  const [stock, setStock] = useState(DEFAULT_STOCK)
  const [view, setView] = useState<"overview" | "monthly" | "stock" | "menu">("overview")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  //const [offers, setOffers] = useState<Offer[]>([])
  const [restaurantStatus, setRestaurantStatus] = useState<{ isOpen: boolean, isManual: boolean } | null>(null)
  const { t, setLanguage } = useLanguage()

  // New item form state
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "Starters" })
  const [isAdding, setIsAdding] = useState(false)
  const [activeMenuCategory, setActiveMenuCategory] = useState("All")

  // Offer form state
  //const [newOffer, setNewOffer] = useState({ title: "", description: "", originalPrice: "", discountedPrice: "", imageUrl: "" })
  //const [isAddingOffer, setIsAddingOffer] = useState(false)

  const load = useCallback(async () => {
    // Fetch Kitchen Orders from DB
    const dbOrders = await getOrders()
    setOrders(dbOrders as any)

    // Load Stock
    const st = localStorage.getItem("restaurantStock")
    if (st) setStock(JSON.parse(st))
    else localStorage.setItem("restaurantStock", JSON.stringify(DEFAULT_STOCK))


    // Fetch real reservations
    //const resData = await getReservations()
    //setReservations(resData)

    // Fetch menu items
    const menuData = await getMenuItems()
    setMenuItems(menuData)

    // Fetch offers
    //const offerData = await getOffers()
    //setOffers(offerData)

    // Fetch Restaurant Status
    const statusData = await getRestaurantStatus()
    if (statusData) setRestaurantStatus({ isOpen: statusData.isOpen, isManual: statusData.isManual })
  }, [])

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const res = await addMenuItem({
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      category: newItem.category
    });
    if (res.success) {
      setNewItem({ name: "", description: "", price: "", category: "Starters" });
      load(); // Refresh list
    } else {
      alert("Failed to add menu item: " + res.error);
    }
    setIsAdding(false);
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    const res = await deleteMenuItem(id);
    if (res.success) {
      load(); // Refresh list
    } else {
      alert("Failed to delete menu item: " + res.error);
    }
  }

  /*const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingOffer(true);
    const res = await addOffer({
      ...newOffer,
      originalPrice: newOffer.originalPrice ? Number(newOffer.originalPrice) : undefined,
      discountedPrice: newOffer.discountedPrice ? Number(newOffer.discountedPrice) : undefined,
    });
    if (res.success) {
      setNewOffer({ title: "", description: "", originalPrice: "", discountedPrice: "", imageUrl: "" });
      load(); // Refresh list
    } else {
      alert("Failed to add offer: " + res.error);
    }
    setIsAddingOffer(false);
  }*/

  const handleDeleteOffer = async (id: string) => {
    const res = await deleteOffer(id);
    if (res.success) {
      load(); // Refresh list
    } else {
      alert("Failed to delete offer: " + res.error);
    }
  }

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/login")
      return
    }
    load()
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [router, load, status, session])

  // Monthly revenue data
  const monthlyData = MONTHS.map((month, i) => {
    const mo = orders.filter(o => {
      const d = new Date(o.date || "")
      return d.getMonth() === i
    })
    return { month, revenue: mo.reduce((s, o) => s + o.total, 0), orders: mo.length }
  })

  // Yearly total
  const yearlyRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalOrders = orders.length
  const avgOrder = totalOrders ? Math.round(yearlyRevenue / totalOrders) : 0

  // Top items
  const itemMap: Record<string, number> = {}
  orders.forEach(o => o.items.forEach(i => {
    itemMap[i.name] = (itemMap[i.name] || 0) + i.qty
  }))
  const topItems = Object.entries(itemMap).sort((a, b) => b[1] - a[1]).slice(0, 7)
    .map(([name, qty]) => ({ name, qty }))

  // Waiter stats
  //const waiterMap: Record<string, { orders: number; revenue: number }> = {}
  //orders.forEach(o => {
   // if (!waiterMap[o.waiter]) waiterMap[o.waiter] = { orders: 0, revenue: 0 }
    //waiterMap[o.waiter].orders++
   // waiterMap[o.waiter].revenue += o.total
 // })
  //const waiterStats = Object.entries(waiterMap).map(([name, s]) => ({ name, ...s }))

  const statCards = [
    { label: "Yearly Revenue", value: `₹${yearlyRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600" },
  //  { label: "Upc. Reservations", value: reservations.length, icon: CalendarCheck, color: "text-amber-600" },
   // { label: "Active Staff", value: waiterStats.length + 1, icon: Users, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-amber-50/50">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <span className="font-serif text-xl text-foreground">{t("admin_dashboard")} — Vrundavan</span>
        <div className="flex items-center gap-4">
          <button onClick={load} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-3.5 w-3.5" /> {t("refresh")}
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all"
            >
              <Languages className="h-4 w-4" />
            </button>
            
            {/* Language Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
              <div className="w-32 rounded-xl bg-background border border-border shadow-xl overflow-hidden">
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground border-b border-border bg-muted/30 uppercase tracking-widest text-center">
                  {t("language")}
                </div>
                {[
                  { id: "en", label: "English", native: "English" },
                  { id: "mr", label: "Marathi", native: "मराठी" },
                  { id: "hi", label: "Hindi", native: "हिंदी" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as "en" | "mr" | "hi")}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-primary/5 transition-colors flex flex-col"
                  >
                    <span className="text-foreground">{lang.label}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Admin Logout on Hover */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] transition-all px-4 py-1.5 rounded-full border border-primary/20 text-primary bg-primary/5"
            >
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="uppercase">{session?.user?.role || "ADMIN"}</span>
              <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />
            </button>
            
            {/* Logout Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[100]">
              <div className="w-40 rounded-xl bg-background border border-border shadow-xl overflow-hidden">
                <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground border-b border-border bg-muted/30 uppercase tracking-widest">
                  {t("account")}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Status Controller */}
      <div className="bg-white border-b border-border px-6 py-4 flex flex-wrap items-center gap-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Restaurant Control</p>
            <p className="text-sm font-semibold text-foreground">Manage Live Status</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-xl border border-border">
          <div className="flex gap-1">
            <button
              onClick={async () => {
                const newStatus = { isOpen: true, isManual: false };
                setRestaurantStatus(newStatus);
                await updateRestaurantStatus(newStatus);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !restaurantStatus?.isManual 
                  ? "bg-white text-amber-700 shadow-sm border border-amber-100" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AUTO (TIME)
            </button>
            <button
              onClick={async () => {
                const newStatus = { isOpen: true, isManual: true };
                setRestaurantStatus(newStatus);
                await updateRestaurantStatus(newStatus);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                restaurantStatus?.isManual && restaurantStatus?.isOpen
                  ? "bg-green-500 text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FORCE OPEN
            </button>
            <button
              onClick={async () => {
                const newStatus = { isOpen: false, isManual: true };
                setRestaurantStatus(newStatus);
                await updateRestaurantStatus(newStatus);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                restaurantStatus?.isManual && !restaurantStatus?.isOpen
                  ? "bg-red-500 text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FORCE CLOSED
            </button>
          </div>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          <div className="flex items-center gap-2 pr-2">
            <div className={`h-2 w-2 rounded-full ${
              restaurantStatus?.isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              {restaurantStatus?.isOpen ? "System Status: Open" : "System Status: Closed"}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10">

        {/* Nav tabs */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {(["overview", "monthly", "menu", "stock"] as const).map(tab => (
            <button key={tab} onClick={() => setView(tab)}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-widest transition capitalize ${view === tab ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}>
              {t(tab === "menu" ? "menu_mgmt" : tab)}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {view === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map(card => (
                <div key={card.label} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{card.label}</p>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-serif text-xl text-foreground">Monthly Revenue (2025)</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#b45309" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top items */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-serif text-xl text-foreground">Top Selling Items</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={160} />
                  <Tooltip />
                  <Bar dataKey="qty" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* MONTHLY */}
        {view === "monthly" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-serif text-xl text-foreground">Revenue & Orders by Month</h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#b45309" strokeWidth={2} dot={{ r: 4 }} name="Revenue (₹)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#0284c7" strokeWidth={2} dot={{ r: 4 }} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly table */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm overflow-x-auto">
              <h2 className="mb-4 font-serif text-xl text-foreground">Monthly Breakdown</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold tracking-widest text-muted-foreground">
                    <th className="pb-3 pr-6">MONTH</th>
                    <th className="pb-3 pr-6">ORDERS</th>
                    <th className="pb-3 pr-6">REVENUE</th>
                    <th className="pb-3">AVG ORDER</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(row => (
                    <tr key={row.month} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 pr-6 font-medium">{row.month}</td>
                      <td className="py-3 pr-6 text-blue-600">{row.orders}</td>
                      <td className="py-3 pr-6 text-green-600 font-semibold">₹{row.revenue.toLocaleString()}</td>
                      <td className="py-3 text-amber-600">₹{row.orders ? Math.round(row.revenue / row.orders) : 0}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-3 pr-6">TOTAL</td>
                    <td className="py-3 pr-6 text-blue-600">{totalOrders}</td>
                    <td className="py-3 pr-6 text-green-600">₹{yearlyRevenue.toLocaleString()}</td>
                    <td className="py-3 text-amber-600">₹{avgOrder}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STOCK */}
        {view === "stock" && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stock.map(item => {
                const left = item.total - item.used
                const pct = Math.round((left / item.total) * 100)
                const color = pct > 50 ? "bg-green-500" : pct > 25 ? "bg-amber-500" : "bg-red-500"
                return (
                  <div key={item.name} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>{pct}%</span>
                    </div>
                    <div className="mb-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used: {item.used} {item.unit}</span>
                      <span className="font-semibold text-foreground">Left: {left} {item.unit}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stock chart */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-serif text-xl text-foreground">Stock Overview (Live)</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stock.map(s => ({ name: s.name, left: s.total - s.used, used: s.used }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Used" />
                  <Bar dataKey="left" fill="#22c55e" radius={[4, 4, 0, 0]} name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* WAITERS 
        {view === "waiters" && (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl text-foreground">Staff Performance</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {waiterStats.map(w => (
                <div key={w.name} className="rounded-xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {w.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">Waiter</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <p className="font-bold text-blue-600">{w.orders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-bold text-green-600">₹{w.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={waiterStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#b45309" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
*/}
        {/* MENU MANAGEMENT */}
        {view === "menu" && (
          <div className="flex flex-col gap-8">
            {/* Add Item Form */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-xl text-foreground">Add New Menu Item</h2>
              <form onSubmit={handleAddMenuItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Name</label>
                  <input required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Item Name" />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Description</label>
                  <input required value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Short description" />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Price (₹)</label>
                  <input required type="number" min="0" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 250" />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Category</label>
                  <select required value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none bg-background text-foreground">
                    <option>Starters</option>
                    <option>Main Course</option>
                    <option>Breads</option>
                    <option>Desserts</option>
                    <option>Cold Beverages</option>
                    <option>Paneer Special</option>
                    <option>Breakfast</option>
                    <option>All Day</option>
                    <option>Marathi Special</option>
                    <option>Tandoori Bread</option>
                    <option>Basmati Ki Khushboo</option>
                  </select>
                </div>
                <div className="lg:col-span-6 flex justify-end mt-2">
                  <button disabled={isAdding} type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Plus className="h-4 w-4" /> {isAdding ? "Adding..." : "Add Item"}
                  </button>
                </div>
              </form>
            </div>

            {/* Menu Items Table */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm overflow-x-auto">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-serif text-xl text-foreground">Menu Items</h2>
                <div className="flex flex-wrap gap-2">
                  {["All", ...Array.from(new Set(menuItems.map(i => i.category)))].map(cat => (
                    <button key={cat} onClick={() => setActiveMenuCategory(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition ${activeMenuCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {menuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No menu items found.</p>
              ) : (
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold tracking-widest text-muted-foreground">
                      <th className="pb-3 pr-6">ITEM NAME</th>
                      <th className="pb-3 pr-6 hidden sm:table-cell">DESCRIPTION</th>
                      <th className="pb-3 pr-6">CATEGORY</th>
                      <th className="pb-3 pr-6">PRICE</th>
                      <th className="pb-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeMenuCategory === "All" ? menuItems : menuItems.filter(i => i.category === activeMenuCategory)).map(item => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="py-3 pr-6 font-medium text-foreground">{item.name}</td>
                        <td className="py-3 pr-6 text-muted-foreground hidden sm:table-cell truncate max-w-[200px]">{item.description}</td>
                        <td className="py-3 pr-6"><span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">{item.category}</span></td>
                        <td className="py-3 pr-6 font-bold text-green-600">₹{item.price}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Item">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* RESERVATIONS 
        {view === "reservations" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm overflow-x-auto">
              <h2 className="mb-4 font-serif text-xl text-foreground">Upcoming Reservations</h2>
              {reservations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reservations found.</p>
              ) : (
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold tracking-widest text-muted-foreground">
                      <th className="pb-3 pr-6">DATE & TIME</th>
                      <th className="pb-3 pr-6">CUSTOMER</th>
                      <th className="pb-3 pr-6">CONTACT</th>
                      <th className="pb-3 pr-6">PARTY SIZE</th>
                      <th className="pb-3 pr-6">RESTAURANT</th>
                      <th className="pb-3">NOTES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr key={res.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="py-3 pr-6 font-medium text-amber-700">
                          {res.date} <br />
                          <span className="text-xs text-muted-foreground">{res.time}</span>
                        </td>
                        <td className="py-3 pr-6 font-medium">{res.customerName}</td>
                        <td className="py-3 pr-6 text-muted-foreground text-xs">
                          {res.phone || "N/A"} <br />
                          {res.email || ""}
                        </td>
                        <td className="py-3 pr-6 text-blue-600 font-bold">{res.partySize}</td>
                        <td className="py-3 pr-6 text-foreground text-xs">{res.restaurant || "Main Dining"}</td>
                        <td className="py-3 text-xs text-muted-foreground max-w-[200px] truncate" title={res.notes || ""}>
                          {res.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* OFFERS MANAGEMENT 
        {view === "offers" && (
          <div className="flex flex-col gap-8">
            {/* Add Offer Form 
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-xl text-foreground">Add New Offer</h2>
              <form onSubmit={handleAddOffer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Title</label>
                  <input required value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Summer Special 20% Off" />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Description</label>
                  <input required value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Valid on items above ₹500" />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Orig. Price (₹)</label>
                  <input type="number" min="0" value={newOffer.originalPrice} onChange={e => setNewOffer({ ...newOffer, originalPrice: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 500" />
                </div>
                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Disc. Price (₹)</label>
                  <input type="number" min="0" value={newOffer.discountedPrice} onChange={e => setNewOffer({ ...newOffer, discountedPrice: e.target.value })} className="w-full rounded-lg border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 399" />
                </div>
                <div className="lg:col-span-6 flex justify-end mt-2">
                  <button disabled={isAddingOffer} type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-10 py-3 text-sm font-bold tracking-widest text-primary-foreground hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase">
                    <Plus className="h-4 w-4" /> {isAddingOffer ? "Saving..." : "Save Special Offer"}
                  </button>
                </div>
              </form>
            </div>

            {/* Offers Table 
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm overflow-x-auto">
              <h2 className="mb-6 font-serif text-xl text-foreground">Current Offers</h2>

              {offers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active offers found.</p>
              ) : (
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold tracking-widest text-muted-foreground">
                      <th className="pb-3 pr-6">OFFER TITLE</th>
                      <th className="pb-3 pr-6">DESCRIPTION</th>
                      <th className="pb-3 pr-6">PRICES (₹)</th>
                      <th className="pb-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="py-3 pr-6 font-medium text-foreground">{offer.title}</td>
                        <td className="py-3 pr-6 text-muted-foreground">{offer.description}</td>
                        <td className="py-3 pr-6">
                          {offer.originalPrice && offer.discountedPrice ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground line-through">₹{offer.originalPrice}</span>
                              <span className="font-bold text-green-600">₹{offer.discountedPrice}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="flex items-center gap-1 ml-auto px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                            title="Delete Offer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}*/}

      </main>
    </div>
  )
}

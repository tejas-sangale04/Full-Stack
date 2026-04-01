"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Star, CheckCircle, Gift, ShoppingCart, LogOut, Trophy } from "lucide-react"
import { Navbar } from "@/components/navbar"
import FloatingBookingButton from "@/components/floating-booking-button"

const TASKS = [
  { id: "review",     title: "Write a Review",          desc: "Share your dining experience on Google",     points: 50,  icon: "⭐" },
  { id: "refer",      title: "Refer a Friend",           desc: "Bring a friend who dines with us",           points: 100, icon: "👥" },
  { id: "birthday",   title: "Birthday Visit",           desc: "Dine with us on your birthday",              points: 150, icon: "🎂" },
  { id: "instagram",  title: "Post on Instagram",        desc: "Tag us @Vriandavan in your food post",       points: 75,  icon: "📸" },
  { id: "feedback",   title: "Fill Feedback Form",       desc: "Complete our in-restaurant feedback card",   points: 30,  icon: "📝" },
  { id: "visit5",     title: "5th Visit Milestone",      desc: "Complete 5 visits to the restaurant",        points: 200, icon: "🏆" },
  { id: "weekday",    title: "Weekday Lunch",            desc: "Dine on any weekday between 12–3 PM",        points: 40,  icon: "🌞" },
  { id: "family",     title: "Family Dining (4+ people)","desc": "Dine as a group of 4 or more",             points: 120, icon: "👨‍👩‍👧‍👦" },
]

const REDEEMABLE = [
  { name: "Tea",              price: 30,  points: 30  },
  { name: "Coffee",           price: 40,  points: 40  },
  { name: "Lassi (Sweet)",    price: 50,  points: 50  },
  { name: "Misal Pav",        price: 110, points: 110 },
  { name: "Onion Pakoda",     price: 100, points: 100 },
  { name: "Finger Chips",     price: 130, points: 130 },
  { name: "Veg Sandwich",     price: 80,  points: 80  },
  { name: "Aloo Paratha",     price: 100, points: 100 },
  { name: "Paneer Paratha",   price: 140, points: 140 },
  { name: "Mix Veg",          price: 220, points: 220 },
  { name: "Palak Paneer",     price: 260, points: 260 },
  { name: "Paneer Butter Masala", price: 270, points: 270 },
  { name: "Breakfast Combo",  price: 199, points: 180 },
  { name: "Starter Trio",     price: 549, points: 500 },
]

type UserData = { points: number; completedTasks: string[]; redeemed: { name: string; points: number; date: string }[] }

function getKey(username: string) { return `rewards_${username}` }

function loadUserData(username: string): UserData {
  const stored = localStorage.getItem(getKey(username))
  if (stored) return JSON.parse(stored)
  return { points: 0, completedTasks: [], redeemed: [] }
}

function saveUserData(username: string, data: UserData) {
  localStorage.setItem(getKey(username), JSON.stringify(data))
}

export default function RewardsPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [userData, setUserData] = useState<UserData>({ points: 0, completedTasks: [], redeemed: [] })
  const [tab, setTab] = useState<"tasks" | "redeem" | "history">("tasks")
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const refresh = useCallback((user: string) => {
    setUserData(loadUserData(user))
  }, [])

  useEffect(() => {
    const session = localStorage.getItem("session")
    if (!session) { router.push("/login"); return }
    const { role, username: u } = JSON.parse(session)
    if (role !== "customer") { router.push("/login"); return }
    setUsername(u)
    refresh(u)
  }, [router, refresh])

  const completeTask = (task: typeof TASKS[0]) => {
    if (userData.completedTasks.includes(task.id)) return
    const updated: UserData = {
      ...userData,
      points: userData.points + task.points,
      completedTasks: [...userData.completedTasks, task.id],
    }
    saveUserData(username, updated)
    setUserData(updated)
    showToast(`+${task.points} points earned for "${task.title}"!`)
  }

  const redeem = (item: typeof REDEEMABLE[0]) => {
    if (userData.points < item.points) return
    const updated: UserData = {
      ...userData,
      points: userData.points - item.points,
      redeemed: [...userData.redeemed, { name: item.name, points: item.points, date: new Date().toLocaleDateString() }],
    }
    saveUserData(username, updated)
    setUserData(updated)
    showToast(`"${item.name}" redeemed successfully!`)
  }

  const tier = userData.points >= 1000 ? { label: "Gold", color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-300" }
    : userData.points >= 400 ? { label: "Silver", color: "text-slate-500", bg: "bg-slate-50 border-slate-300" }
    : { label: "Bronze", color: "text-amber-700", bg: "bg-amber-50 border-amber-300" }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-16">

        {/* Toast */}
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm tracking-[0.15em] text-muted-foreground">Welcome back</p>
            <h1 className="font-serif text-4xl text-foreground">My Rewards</h1>
          </div>
          <button onClick={() => { localStorage.removeItem("session"); router.push("/login") }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>

        {/* Points card */}
        <div className={`mb-10 rounded-2xl border-2 p-6 ${tier.bg} flex flex-wrap items-center justify-between gap-6`}>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Trophy className={`h-8 w-8 ${tier.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">YOUR POINTS</p>
              <p className={`text-5xl font-bold ${tier.color}`}>{userData.points}</p>
              <p className={`text-sm font-semibold ${tier.color}`}>{tier.label} Member</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🥉 Bronze: 0–399 pts</p>
            <p>🥈 Silver: 400–999 pts</p>
            <p>🥇 Gold: 1000+ pts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          {(["tasks","redeem","history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs font-semibold tracking-[0.12em] capitalize border-b-2 -mb-[2px] transition ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t === "tasks" ? "Earn Points" : t === "redeem" ? "Redeem" : "History"}
            </button>
          ))}
        </div>

        {/* TASKS */}
        {tab === "tasks" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TASKS.map(task => {
              const done = userData.completedTasks.includes(task.id)
              return (
                <div key={task.id} className={`rounded-2xl border p-5 flex flex-col gap-3 transition ${done ? "border-green-300 bg-green-50" : "border-border bg-background hover:border-primary/30 hover:shadow-sm"}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{task.icon}</span>
                    {done && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{task.desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {task.points} pts
                    </span>
                    <button
                      onClick={() => completeTask(task)}
                      disabled={done}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        done ? "bg-green-100 text-green-700 cursor-default" : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {done ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* REDEEM */}
        {tab === "redeem" && (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">1 point = ₹1. Redeem points to get dishes for free.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {REDEEMABLE.map(item => {
                const canRedeem = userData.points >= item.points
                return (
                  <div key={item.name} className={`rounded-2xl border p-5 flex flex-col gap-3 ${canRedeem ? "border-border bg-background" : "border-border/50 bg-muted/20 opacity-60"}`}>
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-xs text-muted-foreground">Worth ₹{item.price}</p>
                        <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {item.points} pts
                        </p>
                      </div>
                      <button
                        onClick={() => redeem(item)}
                        disabled={!canRedeem}
                        className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Redeem
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="mb-6 font-serif text-xl text-foreground">Redemption History</h2>
            {userData.redeemed.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No redemptions yet. Earn points and redeem dishes!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...userData.redeemed].reverse().map((r, i) => (
                  <div key={`${r.date}-${r.name}-${i}`} className="flex items-center justify-between rounded-lg border border-border px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-amber-600 font-semibold">-{r.points} pts</span>
                      <span className="text-muted-foreground">{r.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
      <FloatingBookingButton />
    </div>
  )
}

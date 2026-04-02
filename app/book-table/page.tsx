"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { UtensilsCrossed, User, Calendar, Clock, MessageSquare, Mail, Phone, X } from "lucide-react"
import Link from "next/link"
import { createReservation } from "@/app/actions/reservations"

export default function BookTablePage() {
  
  const [restaurant, setRestaurant] = useState("");
  const [numDiners, setNumDiners] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async () => {
    if (!guestName || !date || !time || numDiners === 0) {
      setStatus({ loading: false, error: "Please fill all required fields (Name, Date, Time, Diners)", success: false });
      return;
    }
    setStatus({ loading: true, error: "", success: false });
    const res = await createReservation({
      customerName: guestName,
      email: guestEmail,
      phone: guestPhone,
      restaurant,
      date,
      time,
      partySize: Number(numDiners),
      notes,
    });
    if (res.success) {
      setStatus({ loading: false, error: "", success: true });
    } else {
      setStatus({ loading: false, error: res.error || "Failed", success: false });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-2 py-15 sm:px-6 lg:px-10">
        {/* Close Button */}
        <div className="mb-8 flex justify-end">
          <Link href="/" className="rounded-full p-2 hover:bg-muted transition-colors">
            <X className="h-6 w-6 text-muted-foreground" />
          </Link>
        </div>

        <div className="space-y-8">
          {/* Row 2: Restaurant and Number of Diners */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Select Restaurant */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                SELECT A RESTAURANT
              </label>
              <div className="relative">
                <UtensilsCrossed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <select 
                  className="w-full appearance-none rounded-lg border border-border bg-background px-10 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                >
                  <option value="">Select a restaurant</option>
                  <option value="Vrundavan Main Dining">Vrundavan Main Dining</option>
                  <option value="Vrundavan Garden">Vrundavan Garden</option>
                </select>
              </div>
            </div>

            {/* Number of Diners */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                NUMBER OF DINERS
              </label>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={numDiners}
                  onChange={(e) => setNumDiners(e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="w-24 rounded-lg border border-border bg-background px-4 py-3 text-center text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
                  <span className="text-xs">i</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Date and Time Slot */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Preferred Dining Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                PREFERRED DINING DATE?
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-10 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                TIME SLOT
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <select 
                  className="w-full appearance-none rounded-lg border border-border bg-background px-10 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Select Meal Period</option>
                  <option value="Breakfast (7:00 AM - 11:00 AM)">Breakfast (7:00 AM - 11:00 AM)</option>
                  <option value="Lunch (12:00 PM - 3:00 PM)">Lunch (12:00 PM - 3:00 PM)</option>
                  <option value="Dinner (6:00 PM - 11:00 PM)">Dinner (6:00 PM - 11:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Special Requests and Additional Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Special Requests */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                ANY SPECIAL REQUESTS?
              </label>
              <div className="relative">
                <UtensilsCrossed className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                <select className="w-full appearance-none rounded-lg border border-border bg-background px-10 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Select</option>
                  <option>Window Seat</option>
                  <option>Quiet Area</option>
                  <option>Birthday Celebration</option>
                  <option>Anniversary</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                ADDITIONAL DETAILS
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Eg. allergies, celebrations, or anything you would like us to take care of."
                  className="w-full rounded-lg border border-border bg-background px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Guest Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Guest Name */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Guest Name"
                  className="w-full rounded-lg border border-border bg-background px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Guest Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Guest Phone Number"
                    className="w-full rounded-lg border border-border bg-background px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
                  <span className="text-xs">i</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 6: Guest Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Guest Email"
                className="w-full rounded-lg border border-border bg-background px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center justify-center pt-6 space-y-4">
            {status.error && <p className="text-red-500 font-medium">{status.error}</p>}
            {status.success ? (
              <p className="text-green-600 font-bold text-lg">Table Booked Successfully!</p>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={status.loading}
                className="rounded-full bg-primary px-12 py-4 text-base font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status.loading ? "BOOKING..." : "BOOK TABLE"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

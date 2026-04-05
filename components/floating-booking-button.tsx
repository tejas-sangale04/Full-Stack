"use client"

/*import { motion } from "framer-motion"
import { UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

const FloatingBookingButton = () => {
  const { t } = useLanguage()

  return (
    <Link href="/book-table">
      <motion.div
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center cursor-pointer"
        // Main floating animation
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Rotating background frame 
        <motion.div
          className="absolute w-24 h-24 border-2 border-amber-600 rounded-sm"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Primary button body 
        <motion.div
          className="relative bg-[#e2c18d] w-26 h-26 flex flex-col items-center justify-center shadow-xl p-4 text-center rounded-sm"
          whileHover={{ scale: 1.05 }}
        >
          <UtensilsCrossed className="w-10 h-10 mb-1 text-black" strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-black leading-tight">
            {t("book_a_table")}
          </span>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default FloatingBookingButton
*/
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [showMarathi, setShowMarathi] = useState(false)
  const [hasSeen, setHasSeen] = useState(true)

  // Marathi word with proper character grouping (graphemes)
  // "वृंदावन" -> ["वृ", "ं", "द", "ा", "व", "न"] or similar grouping
  // To avoid matra breakage, we split using a regex that keeps combining marks with their base characters
  const marathiWord = "वृंदावन"
  const marathiChars = marathiWord.match(/.\p{M}*/gu) || [marathiWord]

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenSplash")
    
    if (!seen) {
      setHasSeen(false)
      sessionStorage.setItem("hasSeenSplash", "true")

      // Transition to Marathi after English is fully revealed
      const marathiTimer = setTimeout(() => {
        setShowMarathi(true)
      }, 3500)

      // Final exit
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      return () => {
        clearTimeout(marathiTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  if (hasSeen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* Full Screen Image Animation */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 2, ease: "easeOut" }
              }}
              className="absolute inset-0"
            >
              <Image
                src="/startimage.webp"
                alt="Vrundavan Welcome"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Welcome Text Overlay */}
            <div className="relative flex h-full flex-col items-center justify-center p-4 translate-y-20">
              <motion.div
                initial="hidden"
                animate="visible"
                className="text-center"
              >

                <div className="flex flex-col items-center">
                  {/* Top Line: "Welcome to" */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1,
                        transition: { staggerChildren: 0.08, delayChildren: 1 }
                      }
                    }}
                    className="flex flex-wrap justify-center gap-[0.2em] mb-4"
                  >
                    {"Welcome to".split(" ").map((word, wordIndex) => (
                      <span key={wordIndex} className="flex whitespace-nowrap">
                        {word.split("").map((letter, letterIndex) => (
                          <motion.span
                            key={letterIndex}
                            variants={{
                              hidden: { scale: 0, opacity: 0 },
                              visible: { scale: 1, opacity: 1 }
                            }}
                            className="font-serif text-3xl font-light tracking-wide text-white/90 sm:text-5xl lg:text-7xl uppercase"
                          >
                            {letter}
                          </motion.span>
                        ))}
                        <span className="w-[0.3em]" />
                      </span>
                    ))}
                  </motion.div>

                  {/* Brand Name Swap Area */}
                  <div className="relative h-24 sm:h-32 lg:h-48 flex items-center justify-center min-w-[300px]">
                       <motion.div
                          initial="hidden"
                          animate="visible"
                          className="flex justify-center"
                        >
                          {marathiChars.map((char, i) => (
                            <motion.span
                              key={i}
                              variants={{
                                hidden: {
                                  scale: 0,
                                  opacity: 0,
                                },
                                visible: {
                                  scale: 1,
                                  opacity: 1,
                                },
                              }}
                              transition={{ delay: 1.5 + i * 0.1, type: "spring" }}
                              style={{ 
                                color: "rgba(195, 2, 2, 0.92)",
                                fontFamily: "var(--font-noto-devanagari), serif"
                              }}
                              className="text-5xl font-bold sm:text-7xl lg:text-9xl drop-shadow-2xl"
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: "80%",
                    opacity: 1,
                    transition: { delay: 2.5, duration: 1.5, ease: "easeInOut" }
                  }}
                  className="mx-auto mt-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

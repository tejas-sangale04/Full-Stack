"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [showMarathi, setShowMarathi] = useState(false)

  // Marathi word with proper character grouping (graphemes)
  // "वृंदावन" -> ["वृ", "ं", "द", "ा", "व", "न"] or similar grouping
  // To avoid matra breakage, we split using a regex that keeps combining marks with their base characters
  const marathiWord = "वृंदावन"
  const marathiChars = marathiWord.match(/.\p{M}*/gu) || [marathiWord]

  useEffect(() => {
    // Transition to Marathi after English is fully revealed
    const marathiTimer = setTimeout(() => {
      setShowMarathi(true)
    }, 4500)

    // Final exit
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 9000)

    return () => {
      clearTimeout(marathiTimer)
      clearTimeout(hideTimer)
    }
  }, [])

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
                src="/startimage.png"
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
                {/* Decorative Leading Dot */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: [-100, 200],
                    opacity: [0, 1, 0],
                    transition: { duration: 2, ease: "linear" }
                  }}
                  className="mx-auto mb-8 h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                />

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
                    <AnimatePresence mode="wait">
                      {!showMarathi ? (
                        <motion.div
                          key="english"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                          transition={{ duration: 0.8 }}
                          className="flex justify-center"
                        >
                          {"Vrundavan".split("").map((letter, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.5 + (i * 0.08), type: "spring" }}
                              style={{ color: "rgba(195, 2, 2, 0.92)" }}
                              className="font-serif text-5xl font-bold sm:text-7xl lg:text-9xl drop-shadow-2xl"
                            >
                              {letter}
                            </motion.span>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="marathi"
                          initial={{ opacity: 0, filter: "blur(5px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="flex justify-center"
                        >
                          {marathiChars.map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.1, type: "spring" }}
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
                      )}
                    </AnimatePresence>
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

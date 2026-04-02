"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "mr" | "hi"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    // Navbar
    about: "ABOUT",
    menu: "MENU",
    offers: "OFFERS",
    contact: "CONTACT",
    book_now: "BOOK NOW",
    select_menu: "SELECT A MENU",
    all_day: "All Day",
    starters: "Starters",
    main_course: "Main Course",
    paneer_special: "Paneer Special",
    breakfast: "Breakfast",
    drinks: "Drinks",
    login_join: "LOGIN / JOIN",
    logout: "Logout",
    account: "Account",
    language: "Language",

    // Hero Section

    // Admin
    admin_dashboard: "Admin Dashboard",
    refresh: "Refresh",
    overview: "Overview",
    monthly: "Monthly",
    reservations: "Reservations",
    stock: "Stock",
    menu_mgmt: "Menu Management",
    offers_mgmt: "Offers Management",

    // About Section
    about_title: "About Vrundavan",
    about_p1: "Welcome to Vrundavan, where culinary excellence meets timeless elegance. Our restaurant offers an unforgettable dining experience that celebrates authentic flavors and exceptional hospitality.",
    about_p2: "With a commitment to using the finest ingredients and traditional cooking techniques, we craft dishes that tell a story of heritage and innovation. Each meal is prepared with passion and served in an atmosphere designed for memorable moments.",
    about_p3: "Whether you're joining us for an intimate dinner or a special celebration, our dedicated team ensures every visit is extraordinary.",
    book_a_table: "Book A Table",
    services_menus_title: "MENUS",
    services_menus_sub: "Breakfast, lunch, dinner and late tipples",
    services_reservations_title: "RESERVATIONS",
    services_reservations_sub: "For bookings and large groups",
    services_offers_title: "OFFERS",
    services_offers_sub: "Special deals and promotions",
  },
  mr: {
    // Navbar
    about: "आमच्याबद्दल",
    menu: "मेनू",
    offers: "ऑफर",
    contact: "संपर्क",
    book_now: "आत्ता बुक करा",
    select_menu: "मेनू निवडा",
    all_day: "दिवभर",
    starters: "स्टार्टर्स",
    main_course: "मुख्य जेवण",
    paneer_special: "पनीर स्पेशल",
    breakfast: "न्याहारी",
    drinks: "पेये",
    login_join: "लॉगिन / नोंदणी",
    logout: "लॉगआउट",
    account: "खाते",
    language: "भाषा",

    // Hero Section
    // Admin
    admin_dashboard: "अ‍ॅडमिन डॅशबोर्ड",
    refresh: "रिफ्रेश",
    overview: "आढावा",
    monthly: "मासिक",
    reservations: "आरक्षण",
    stock: "स्टॉक",
    menu_mgmt: "मेनू व्यवस्थापन",
    offers_mgmt: "ऑफर व्यवस्थापन",

    // About Section
    about_title: "वृंदावन बद्दल",
    about_p1: "वृंदावनमध्ये आपले स्वागत आहे, जिथे उत्कृष्ट चव आणि शाश्वत अभिजातता एकत्र येतात. आमचे रेस्टॉरंट एक अविस्मरणीय जेवणाचा अनुभव देते जो अस्सल फ्लेवर्स आणि अपवादात्मक आदरातिथ्य साजरा करतो.",
    about_p2: "उत्कृष्ट साहित्य आणि पारंपारिक स्वयंपाक तंत्र वापरण्याच्या वचनबद्धतेसह, आम्ही वारसा आणि नाविन्यपूर्णतेची कथा सांगणारे पदार्थ तयार करतो. प्रत्येक जेवण आवडीने तयार केले जाते आणि संस्मरणीय क्षणांसाठी डिझाइन केलेल्या वातावरणात दिले जाते.",
    about_p3: "तुम्ही आमच्यासोबत स्नेहभोजनासाठी किंवा खास उत्सवासाठी येत असाल, आमची समर्पित टीम तुमची प्रत्येक भेट विलक्षण असेल याची खात्री करते.",
    book_a_table: "टेबल बुक करा",
    services_menus_title: "मेनू",
    services_menus_sub: "न्याहारी, दुपारचे आणि रात्रीचे जेवण",
    services_reservations_title: "आरक्षण",
    services_reservations_sub: "बुकिंग आणि मोठ्या गटांसाठी",
    services_offers_title: "ऑफर",
    services_offers_sub: "विशेष सौदे आणि जाहिराती",
  },
  hi: {
    // Navbar
    about: "हमारे बारे में",
    menu: "मेनू",
    offers: "ऑफ़र",
    contact: "संपर्क",
    book_now: "अभी बुक करें",
    select_menu: "मेनू चुनें",
    all_day: "पूरे दिन",
    starters: "स्टार्टर्स",
    main_course: "मुख्य भोजन",
    paneer_special: "पनीर स्पेशल",
    breakfast: "नाश्ता",
    drinks: "पेय",
    login_join: "लॉगिन / शामिल हों",
    logout: "लॉगआउट",
    account: "खाता",
    language: "भाषा",

    // Hero Section

    // Admin
    admin_dashboard: "एडमिन डैशबोर्ड",
    refresh: "रिफ्रेश",
    overview: "सिंहावलोकन",
    monthly: "मासिक",
    reservations: "आरक्षण",
    stock: "स्टॉक",
    menu_mgmt: "मेनू प्रबंधन",
    offers_mgmt: "ऑफ़र प्रबंधन",

    // About Section
    about_title: "वृंदावन के बारे में",
    about_p1: "वृंदावन में आपका स्वागत है, जहां पाक उत्कृष्टता कालातीत लालित्य से मिलती है। हमारा रेस्तरां एक अविस्मरणीय भोजन अनुभव प्रदान करता है जो प्रामाणिक स्वाद और असाधारण आतिथ्य का जश्न मनाता है।",
    about_p2: "बेहतरीन सामग्री और पारंपरिक खाना पकाने की तकनीक का उपयोग करने की प्रतिबद्धता के साथ, हम ऐसे व्यंजन तैयार करते हैं जो विरासत और नवाचार की कहानी बताते हैं। प्रत्येक भोजन जुनून के साथ तैयार किया जाता है और यादगार पलों के लिए डिज़ाइन किए गए वातावरण में परोसा जाता है।",
    about_p3: "वेदर यू'रे जॉइनिंग अस फॉर एन इंटिमेट डिनर और अ स्पेशल सेलिब्रेशन, हमारी डेडिकेटेड टीम यह सुनिश्चित करती है कि हर मुलाकात असाधारण हो।",
    book_a_table: "टेबल बुक करें",
    services_menus_title: "मेनू",
    services_menus_sub: "नाश्ता, दोपहर और रात का भोजन",
    services_reservations_title: "आरक्षण",
    services_reservations_sub: "बुकिंग और बड़े समूहों के लिए",
    services_offers_title: "ऑफ़र",
    services_offers_sub: "विशेष सौदे और प्रचार",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language
    if (saved && (saved === "en" || saved === "mr" || saved === "hi")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("app_lang", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

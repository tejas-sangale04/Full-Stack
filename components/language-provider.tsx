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
    restaurant_name: "Vrundavan",
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
    open_now: "OPEN NOW",
    closed: "CLOSED",
    opens_at: "Opens at",

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

    // Location
    visit_title: "Visit Us",
    visit_subtitle: "Find us at our convenient location",
    address_label: "Address",
    phone_label: "Phone",
    email_label: "Email",
    hours_label: "Opening Hours",
    directions_btn: "GET DIRECTIONS",
    mon_fri: "Monday - Friday",
    sat_sun: "Saturday - Sunday",

    // Menu Page
    menu_subtitle: "Authentic Indian cuisine",
    menu_title: "Our Menus",
    menu_description: "At Vrundavan, you'll find the soul of traditional Indian cooking — home kitchens, street stalls, and festive feasts all on one table. Come, eat your way through flavours crafted with love, for breakfast, lunch, evening chai, or a full dinner spread. Much awaits you.",
    search_placeholder: "Search menu items...",
    search_results: "Search Results",
    no_items_found: "No items found for",
    results_for: "results for",

    // Offers Page
    offers_subtitle: "Save more, eat well",
    offers_title: "Special Offers",
    offers_description: "Handpicked deals crafted for every occasion",
    new_offer_badge: "NEW OFFER",
    special_deal_badge: "SPECIAL DEAL",
    claim_offer_btn: "CLAIM OFFER",

    // Book Table
    select_restaurant: "SELECT A RESTAURANT",
    restaurant_placeholder: "Select a restaurant",
    diners_label: "NUMBER OF DINERS",
    date_label: "PREFERRED DINING DATE?",
    time_label: "TIME SLOT",
    time_placeholder: "Select Meal Period",
    requests_label: "ANY SPECIAL REQUESTS?",
    requests_placeholder: "Select",
    details_label: "ADDITIONAL DETAILS",
    details_placeholder: "Eg. allergies, celebrations, or anything you would like us to take care of.",
    name_placeholder: "Guest Name",
    phone_placeholder: "Guest Phone Number",
    email_placeholder: "Guest Email",
    book_btn: "BOOK TABLE",
    booking_loading: "BOOKING...",
    booking_success: "Table Booked Successfully!",
    booking_error: "Please fill all required fields",
  },
  mr: {
    // Navbar
    about: "आमच्याबद्दल",
    menu: "मेनू",
    restaurant_name: "वृंदावन",
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
    open_now: "सुरू आहे",
    closed: "बंद आहे",
    opens_at: "सकाळी उघडते",

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

    // Location
    visit_title: "आम्हाला भेट द्या",
    visit_subtitle: "आमच्या सोयीस्कर ठिकाणी आम्हाला शोधा",
    address_label: "पत्ता",
    phone_label: "फोन",
    email_label: "ईमेल",
    hours_label: "उघडण्याच्या वेळा",
    directions_btn: "दिशानिर्देश मिळवा",
    mon_fri: "सोमवार - शुक्रवार",
    sat_sun: "शनिवार - रविवार",
 
     // Menu Page
     menu_subtitle: "अस्सल भारतीय पाककृती",
     menu_title: "आमचे मेनू",
     menu_description: "वृंदावनमध्ये, तुम्हाला पारंपारिक भारतीय स्वयंपाकाचा आत्मा सापडेल - घरगुती स्वयंपाकघर, रस्त्यावरील स्टॉल्स आणि उत्सवाची मेजवानी सर्व एकाच टेबलावर. या, सकाळचा नाश्ता, दुपारचे जेवण, संध्याकाळचा चहा किंवा पूर्ण रात्रीच्या जेवणासाठी प्रेमाने तयार केलेल्या चवींचा आनंद घ्या. बरेच काही तुमची वाट पाहत आहे.",
     search_placeholder: "मेनू आयटम शोधा...",
     search_results: "शोध निकाल",
     no_items_found: "यासाठी कोणतेही आयटम सापडले नाहीत",
     results_for: "निकाल यासाठी",

    // Offers Page
    offers_subtitle: "अधिक बचत करा, चांगले जेवा",
    offers_title: "विशेष ऑफर",
    offers_description: "प्रत्येक प्रसंगासाठी खास निवडलेले सौदे",
    new_offer_badge: "नवीन ऑफर",
    special_deal_badge: "विशेष सौदा",
    claim_offer_btn: "ऑफर मिळवा",

    // Book Table
    select_restaurant: "रेस्टॉरंट निवडा",
    restaurant_placeholder: "रेस्टॉरंट निवडा",
    diners_label: "जेवणाऱ्यांची संख्या",
    date_label: "पसंतीची तारीख",
    time_label: "वेळेची स्लॉट",
    time_placeholder: "जेवणाची वेळ निवडा",
    requests_label: "काही खास विनंत्या?",
    requests_placeholder: "निवडा",
    details_label: "अतिरिक्त तपशील",
    details_placeholder: "उदा. ॲलर्जी, उत्सव किंवा आपण आमची काळजी घेऊ इच्छित असलेले काहीही.",
    name_placeholder: "पाहुण्याचे नाव",
    phone_placeholder: "पाहुण्याचा फोन नंबर",
    email_placeholder: "पाहुण्याचा ईमेल",
    book_btn: "टेबल बुक करा",
    booking_loading: "बुकिंग होत आहे...",
    booking_success: "टेबल यशस्वीरित्या बुक झाले!",
    booking_error: "कृपया सर्व आवश्यक फील्ड भरा",
   },
  hi: {
    // Navbar
    about: "हमारे बारे में",
    menu: "मेनू",
    offers: "ऑफ़र",
    contact: "संपर्क",
    restaurant_name: "वृंदावन",
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
    open_now: "खुला है",
    closed: "बंद है",
    opens_at: "सुबह खुलता है",

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
    about_p3: "चाहे आप हमारे साथ इत्मीनान से भोजन के लिए आ रहे हों या किसी विशेष उत्सव के लिए, हमारी समर्पित टीम सुनिश्चित करती है कि आपकी हर मुलाकात असाधारण हो।",
    book_a_table: "टेबल बुक करें",
    services_menus_title: "मेनू",
    services_menus_sub: "नाश्ता, दोपहर और रात का भोजन",
    services_reservations_title: "आरक्षण",
    services_reservations_sub: "बुकिंग और बड़े समूहों के लिए",
    services_offers_title: "ऑफ़र",
    services_offers_sub: "विशेष सौदे और प्रचार",

    // Location
    visit_title: "हमसे मिलें",
    visit_subtitle: "हमारे सुविधाजनक स्थान पर हमें खोजें",
    address_label: "पता",
    phone_label: "फ़ोन",
    email_label: "ईमेल",
    hours_label: "खुलने का समय",
    directions_btn: "दिशानिर्देश प्राप्त करें",
    mon_fri: "सोमवार - शुक्रवार",
    sat_sun: "शनिवार - रविवार",
 
     // Menu Page
     menu_subtitle: "प्रामाणिक भारतीय व्यंजन",
     menu_title: "हमारे मेनू",
     menu_description: "वृंदावन में, आपको पारंपरिक भारतीय खाना पकाने की आत्मा मिलेगी - घरेलू रसोई, सड़क के स्टॉल और उत्सव के दावतें सभी एक ही मेज पर। आइए, नाश्ते, दोपहर के भोजन, शाम की चाय या पूरे रात के खाने के लिए प्यार से तैयार किए गए स्वादों का आनंद लें। बहुत कुछ आपका इंतज़ार कर रहा है।",
     search_placeholder: "मेनू आइटम खोजें...",
     search_results: "खोज परिणाम",
     no_items_found: "के लिए कोई आइटम नहीं मिला",
     results_for: "परिणाम इसके लिए",

    // Offers Page
    offers_subtitle: "अधिक बचत करें, अच्छा खाएं",
    offers_title: "विशेष ऑफ़र",
    offers_description: "हर अवसर के लिए चुने गए विशेष सौदे",
    new_offer_badge: "नया ऑफ़र",
    special_deal_badge: "विशेष सौदा",
    claim_offer_btn: "ऑफ़र प्राप्त करें",

    // Book Table
    select_restaurant: "रेस्टोरेंट चुनें",
    restaurant_placeholder: "एक रेस्टोरेंट चुनें",
    diners_label: "भोजन करने वालों की संख्या",
    date_label: "पसंदीदा भोजन तिथि?",
    time_label: "समय स्लॉट",
    time_placeholder: "भोजन अवधि चुनें",
    requests_label: "कोई विशेष अनुरोध?",
    requests_placeholder: "चुनें",
    details_label: "अतिरिक्त विवरण",
    details_placeholder: "जैसे: एलर्जी, उत्सव, या कुछ भी जिसे आप चाहते हैं कि हम ध्यान रखें।",
    name_placeholder: "अतिथि का नाम",
    phone_placeholder: "अतिथि फ़ोन नंबर",
    email_placeholder: "अतिथि ईमेल",
    book_btn: "टेबल बुक करें",
    booking_loading: "बुकिंग हो रही है...",
    booking_success: "टेबल सफलतापूर्वक बुक हो गया!",
    booking_error: "कृपया सभी आवश्यक फ़ील्ड भरें",
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

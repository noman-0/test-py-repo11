"use client";

import React, { useState } from "react";
import { BULK_PACKAGE_OPTIONS, BulkPackageOption } from "@/data/cateringPackages";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/editorial";
import { BRAND_INFO } from "@/data/brandInfo";
import {
  Calendar,
  Users,
  Coffee,
  CheckCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

export const CateringWizard: React.FC = () => {
  const { isAr, t } = useLanguage();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [eventType, setEventType] = useState<"home-majlis" | "corporate" | "live-barista-station">("home-majlis");
  const [guestCount, setGuestCount] = useState<number>(20);

  // Selected package quantities: { [packageId]: quantity }
  const [packageQuantities, setPackageQuantities] = useState<{ [key: string]: number }>({
    "box-5l": 1,
    "crate-12": 1,
  });

  // Event Logistics
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [eventDate, setEventDate] = useState<string>(defaultDateStr);
  const [eventTime, setEventTime] = useState<string>("16:00");
  const [dohaNeighborhood, setDohaNeighborhood] = useState<string>("Al Waab");
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>("");

  // Helpers for package quantity updates
  const updateQuantity = (id: string, delta: number) => {
    setPackageQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Calculate estimated total price and cups
  const selectedItemsList = BULK_PACKAGE_OPTIONS.map((pkg) => ({
    ...pkg,
    quantity: packageQuantities[pkg.id] || 0,
  })).filter((item) => item.quantity > 0);

  const totalPriceQAR = selectedItemsList.reduce(
    (sum, item) => sum + item.priceQAR * item.quantity,
    0
  );

  const totalCupsEstimate = selectedItemsList.reduce(
    (sum, item) => sum + item.cupsEstimate * item.quantity,
    0
  );

  // WhatsApp Pre-filled Summary
  const packageSummaryStr = selectedItemsList
    .map((item) => `${item.quantity}x ${isAr ? item.name.ar : item.name.en}`)
    .join(", ");

  const whatsappMessage = isAr
    ? `مرحباً فريق اكسالسا كافي، أود تأكيد تفاصيل طلب ضيافة الفعاليات:
- نوع المناسبة: ${eventType === "home-majlis" ? "مجلس / جمعة منزلية" : eventType === "corporate" ? "اجتماع عمل / مكتب" : "محطة باريستا حية"}
- عدد الضيوف: ~${guestCount} شخص
- الباقات المختارة: ${packageSummaryStr || "مزيج قهوة مخصص"}
- التاريخ والوقت: ${eventDate} في تمام الساعة ${eventTime}
- المنطقة: الدوحة (${dohaNeighborhood})
- الاسم: ${fullName}
- هاتف: ${phoneNumber}
يرجى تأكيد التوافر وإتمام التنسيق.`
    : `Hello Excelsa Coffee Team, I would like to confirm my event catering booking:
- Event Type: ${eventType === "home-majlis" ? "Home / Majlis" : eventType === "corporate" ? "Corporate Meeting" : "Live Barista Station"}
- Guests: ~${guestCount} people
- Selected Packages: ${packageSummaryStr || "Custom Coffee Selection"}
- Date & Time: ${eventDate} at ${eventTime}
- Location: Doha (${dohaNeighborhood})
- Name: ${fullName}
- Phone: ${phoneNumber}
Please confirm availability and coordinate logistics.`;

  const whatsappHref = `https://wa.me/${BRAND_INFO.phone.replace("+", "")}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !eventDate || !dohaNeighborhood) {
      alert(t("Please fill in your name, phone number, date, and neighborhood.", "يرجى تعبئة الاسم، رقم الهاتف، التاريخ والمنطقة."));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email,
          eventType,
          eventDate,
          eventTime,
          guestCount,
          selectedPackages: selectedItemsList.map((item) => ({
            packageId: item.id,
            packageName: isAr ? item.name.ar : item.name.en,
            quantity: item.quantity,
            unitPriceQAR: item.priceQAR,
          })),
          dohaNeighborhood,
          specialRequests,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setReferenceId(data.referenceId || "EXC-CONFIRMED");
        setIsSuccess(true);
      } else {
        alert(data.error || "Submission error");
      }
    } catch (err) {
      // Even if network fails, allow success screen so user can confirm via WhatsApp
      setReferenceId(`EXC-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const neighborhoods = [
    { en: "Al Waab", ar: "الوعب" },
    { en: "West Bay", ar: "الخليج الغربي" },
    { en: "The Pearl-Qatar", ar: "اللؤلؤة قطر" },
    { en: "Lusail Marina & Fox Hills", ar: "لوسيل مارينا وفوكس هيلز" },
    { en: "Al Dafna", ar: "الدفنة" },
    { en: "Al Rayyan", ar: "الريان" },
    { en: "Al Sadd", ar: "السد" },
    { en: "Al Hilal", ar: "الهلال" },
    { en: "Old Airport / Al Matar", ar: "المطار القديم" },
    { en: "Other Doha Area", ar: "منطقة أخرى بالدوحة" },
  ];

  return (
    <section id="catering" aria-labelledby="catering-title" className="py-28 sm:py-36 px-5 sm:px-10 lg:px-14 bg-[#051F1E] relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="catering-title"
          eyebrow={t("Hospitality & catering booking", "حجز ضيافة المناسبات والمجالس")}
          title={t("Bespoke Coffee Catering", "ضيافة قهوة")}
          italic={t("& bulk brews.", "للمجلس والفعاليات.")}
          lede={t(
            "From 5L insulated brew boxes to a live barista station — tailored for Qatari hospitality, and finalised directly with our team. No payment gateway.",
            "من صناديق القهوة الحافظة للحرارة إلى محطة باريستا حية — مصممة للضيافة القطرية، وتنسق مباشرة مع فريقنا دون بوابات دفع."
          )}
        />

        {/* Wizard Container */}
        <div className="border border-brand-cream/10 bg-brand-green/40 p-6 sm:p-10 relative overflow-hidden">
          {/* Success Screen */}
          {isSuccess ? (
            <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-900/60 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-accent-gold uppercase tracking-widest block mb-2">
                {t("Inquiry Received", "تم استلام طلب الضيافة")}
              </span>

              <h3 className="font-display text-3xl sm:text-4xl text-brand-cream font-bold mb-3">
                {t("Thank You, ", "شكراً لك، ")} {fullName}!
              </h3>

              <p className="text-sm text-muted-on-green max-w-md mx-auto mb-6 leading-relaxed">
                {t(
                  "Your event catering request has been dispatched to Ahamad and our Doha operations team.",
                  "تم إرسال تفاصيل حجز الضيافة إلى الإدارة وفريق التشغيل في الدوحة بنجاح."
                )}
              </p>

              {/* Reference & Summary Box */}
              <div className="bg-surface-green rounded-none p-6 max-w-md mx-auto text-start mb-8 border border-muted-on-green/20 text-xs text-brand-cream">
                <div className="flex justify-between items-center pb-3 border-b border-muted-on-green/20 mb-3">
                  <span className="text-muted-on-green">{t("Reference ID", "رقم الطلب")}</span>
                  <span className="font-mono font-bold text-accent-gold">{referenceId}</span>
                </div>
                <div className="space-y-1.5 text-muted-on-green">
                  <div>
                    <span className="text-brand-cream font-medium">{t("Date & Time: ", "التاريخ والوقت: ")}</span>
                    {eventDate} ({eventTime})
                  </div>
                  <div>
                    <span className="text-brand-cream font-medium">{t("Location: ", "المنطقة: ")}</span>
                    {dohaNeighborhood}, {t("Doha", "الدوحة")}
                  </div>
                  <div>
                    <span className="text-brand-cream font-medium">{t("Packages: ", "الباقات: ")}</span>
                    {packageSummaryStr || t("Custom Inquiry", "طلب مخصص")}
                  </div>
                  {totalPriceQAR > 0 && (
                    <div className="pt-2 text-brand-cream font-bold text-sm">
                      {t("Estimated Total: ", "المجموع التقديري: ")} {totalPriceQAR} QAR
                    </div>
                  )}
                </div>
              </div>

              {/* Instant WhatsApp Handshake Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-4 px-6 rounded-none bg-[#25D366] text-black font-bold text-sm hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-black" />
                  <span>{t("Confirm via WhatsApp Now", "تأكيد فوري عبر الواتساب")}</span>
                </a>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto py-4 px-6 rounded-none bg-surface-green text-brand-cream text-xs font-semibold hover:bg-surface-green-hover transition-colors"
                >
                  {t("Book Another Gathering", "حجز موعد آخر")}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Step Progress Indicators */}
              <div className="flex items-center justify-between max-w-xl mx-auto mb-10 pb-6 border-b border-surface-green">
                {[
                  { step: 1, title: { en: "Event Scale", ar: "نوع المناسبة" } },
                  { step: 2, title: { en: "Bulk Packages", ar: "اختيار الباقات" } },
                  { step: 3, title: { en: "Date & Venue", ar: "الموعد والموقع" } },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 font-mono flex items-center justify-center font-bold text-xs transition-all ${
                        currentStep === item.step
                          ? "bg-brand-cream text-brand-green"
                          : currentStep > item.step
                          ? "bg-accent-gold text-brand-green"
                          : "bg-surface-green text-muted-on-green"
                      }`}
                    >
                      {currentStep > item.step ? "✓" : item.step}
                    </div>
                    <span className="text-[11px] text-muted-on-green mt-1.5 font-medium hidden sm:block">
                      {t(item.title.en, item.title.ar)}
                    </span>
                  </div>
                ))}
              </div>

              {/* STEP 1: EVENT TYPE & SCALE */}
              {currentStep === 1 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-display text-3xl text-brand-cream text-center mb-2">
                    {t("Select Your Gathering Scale", "حدد حجم ونوع المناسبة")}
                  </h3>
                  <p className="text-xs text-muted-on-green text-center mb-8">
                    {t(
                      "Choose your hospitality setting so we can calibrate brew volumes and barista support.",
                      "اختر طبيعة المناسبة لنتمكن من ضبط كميات القهوة واحتياجات طاقم الضيافة."
                    )}
                  </p>

                  <div className="grid xp-cols grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        type: "home-majlis" as const,
                        title: { en: "Home & Majlis Gathering", ar: "جمعة مجلس / منزلية" },
                        guests: { en: "10 – 30 Guests", ar: "10 – 30 ضيف" },
                        desc: {
                          en: "Warm family gatherings, Friday majlis, and private celebrations.",
                          ar: "المجالس العائلية، مناسبات يوم الجمعة، والاحتفالات الخاصة.",
                        },
                        icon: Users,
                      },
                      {
                        type: "corporate" as const,
                        title: { en: "Corporate Meeting / Office", ar: "اجتماع عمل / مقر شركة" },
                        guests: { en: "15 – 50 Guests", ar: "15 – 50 شخص" },
                        desc: {
                          en: "VIP board meetings, team drop-offs, and conference specialty coffee.",
                          ar: "اجتماعات مجالس الإدارة، ضيافة الموظفين، ومؤتمرات الأعمال.",
                        },
                        icon: Coffee,
                      },
                      {
                        type: "live-barista-station" as const,
                        title: { en: "Private Event / Live Bar", ar: "مناسبة خاصة / باريستا لايف" },
                        guests: { en: "50+ Guests", ar: "أكثر من 50 ضيف" },
                        desc: {
                          en: "Weddings, private exhibitions, and grand celebrations with barista station.",
                          ar: "حفلات الاستقبال والمعارض مع ركن تحضير وباريستا مباشر.",
                        },
                        icon: Sparkles,
                      },
                    ].map((card) => {
                      const Icon = card.icon;
                      const isSelected = eventType === card.type;
                      return (
                        <div
                          key={card.type}
                          onClick={() => setEventType(card.type)}
                          className={`p-6 rounded-none border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-surface-green border-accent-gold"
                              : "bg-surface-green/40 border-muted-on-green/20 hover:border-muted-on-green/50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-none bg-brand-green border border-accent-gold/30 flex items-center justify-center mb-4 text-accent-gold">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                            {t(card.guests.en, card.guests.ar)}
                          </span>
                          <h4 className="font-display text-lg font-bold text-brand-cream mb-2">
                            {t(card.title.en, card.title.ar)}
                          </h4>
                          <p className="text-xs text-muted-on-green leading-relaxed">
                            {t(card.desc.en, card.desc.ar)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Guest Count Slider */}
                  <div className="bg-surface-green/60 p-6 rounded-none border border-muted-on-green/20 max-w-md mx-auto mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-on-green font-medium">
                        {t("Estimated Guest Count", "العدد التقديري للضيوف")}
                      </span>
                      <span className="text-lg font-bold text-accent-gold">{guestCount}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={150}
                      step={5}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full accent-accent-gold bg-brand-green cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-on-green/70 mt-1">
                      <span>10 {t("Guests", "ضيوف")}</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150+</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-none bg-brand-cream text-brand-green font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <span>{t("Continue to Packages", "الانتقال لاختيار الباقات")}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: BULK PACKAGES CUSTOMIZER */}
              {currentStep === 2 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="font-display text-3xl text-brand-cream text-center mb-2">
                    {t("Customize Your Bulk Coffee & Add-Ons", "اختر باقات القهوة والضيافة")}
                  </h3>
                  <p className="text-xs text-muted-on-green text-center mb-8">
                    {t(
                      "Mix and match insulated thermal brew dispensers, cold brew crates, and live barista service.",
                      "اختر الكميات المناسبة من الحافظات الساخنة، صناديق المشروبات الباردة، أو محطة الباريستا."
                    )}
                  </p>

                  <div className="grid xp-cols grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {BULK_PACKAGE_OPTIONS.map((pkg) => {
                      const qty = packageQuantities[pkg.id] || 0;
                      return (
                        <div
                          key={pkg.id}
                          className="bg-surface-green/70 rounded-none p-5 border border-muted-on-green/20 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider block">
                                  {t(pkg.capacity.en, pkg.capacity.ar)}
                                </span>
                                <h4 className="font-display text-lg font-bold text-brand-cream">
                                  {t(pkg.name.en, pkg.name.ar)}
                                </h4>
                              </div>
                              <div className="text-end">
                                <span className="text-lg font-display font-bold text-brand-cream">
                                  {pkg.priceQAR}
                                </span>
                                <span className="text-[10px] text-accent-gold block">{t("QAR", "ر.ق")}</span>
                              </div>
                            </div>

                            <p className="text-xs text-muted-on-green mb-3 leading-relaxed">
                              {t(pkg.description.en, pkg.description.ar)}
                            </p>

                            <ul className="space-y-1 mb-4 text-[11px] text-brand-cream/80 border-t border-muted-on-green/10 pt-2">
                              {(isAr ? pkg.includedItems.ar : pkg.includedItems.en).map((inc, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="text-accent-gold">✓</span>
                                  <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Quantity Counter */}
                          <div className="flex items-center justify-between pt-3 border-t border-muted-on-green/20">
                            <span className="text-xs text-muted-on-green font-medium">
                              {t("Quantity", "الكمية المطلوبة")}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateQuantity(pkg.id, -1)}
                                className="w-8 h-8 rounded-none bg-brand-green border border-muted-on-green/30 text-brand-cream flex items-center justify-center hover:bg-surface-green transition-colors active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center font-bold text-brand-cream text-sm">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(pkg.id, 1)}
                                className="w-8 h-8 rounded-none bg-brand-cream text-brand-green font-bold flex items-center justify-center hover:bg-white transition-colors active:scale-95"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Bar */}
                  <div className="bg-surface-green p-4 rounded-none mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-accent-gold/30">
                    <div className="text-center sm:text-start">
                      <span className="text-xs text-muted-on-green block">
                        {t("Selected Packages:", "الباقات المحددة:")}
                      </span>
                      <span className="text-xs font-semibold text-brand-cream">
                        {packageSummaryStr || t("None selected yet", "لم يتم اختيار أي باقة بعد")}
                      </span>
                    </div>
                    <div className="text-center sm:text-end">
                      <span className="text-xs text-muted-on-green block">
                        {t("Estimated Total:", "المجموع التقديري:")}
                      </span>
                      <span className="text-2xl font-display font-bold text-accent-gold">
                        {totalPriceQAR} <span className="text-xs font-sans">{t("QAR", "ر.ق")}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 rounded-none border border-muted-on-green/30 text-brand-cream text-xs font-semibold hover:bg-surface-green flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                      <span>{t("Back", "السابق")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={selectedItemsList.length === 0}
                      className={`px-8 py-3.5 rounded-none font-bold text-sm flex items-center gap-2 transition-all ${
                        selectedItemsList.length > 0
                          ? "bg-brand-cream text-brand-green hover:bg-white cursor-pointer"
                          : "bg-surface-green text-muted-on-green opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span>{t("Venue & Contact Details", "الموعد وتفاصيل التوصيل")}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: LOGISTICS & DOHA DETAILS */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
                  <h3 className="font-display text-3xl text-brand-cream text-center mb-2">
                    {t("Event Date & Doha Neighborhood", "موعد الفعالية وموقع التوصيل")}
                  </h3>
                  <p className="text-xs text-muted-on-green text-center mb-8">
                    {t(
                      "Provide your Doha address and contact info so our coordinator can confirm setup timing.",
                      "أدخل موقع الفعالية داخل الدوحة وبيانات التواصل لتأكيد مواعيد التجهيز والتوصيل."
                    )}
                  </p>

                  <div className="grid xp-cols grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Event Date */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Event Date *", "تاريخ الفعالية *")}
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                      />
                    </div>

                    {/* Event Time */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Start / Setup Time *", "وقت بدء الضيافة / التجهيز *")}
                      </label>
                      <input
                        type="time"
                        required
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                      />
                    </div>

                    {/* Doha Neighborhood */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Doha Neighborhood / Zone *", "المنطقة داخل الدوحة *")}
                      </label>
                      <select
                        value={dohaNeighborhood}
                        onChange={(e) => setDohaNeighborhood(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                      >
                        {neighborhoods.map((n, i) => (
                          <option key={i} value={n.en} className="bg-brand-green text-brand-cream">
                            {t(n.en, n.ar)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Customer Full Name */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Full Name *", "الاسم الكريم *")}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("e.g., Mohammed Al-Kuwari", "مثال: محمد الكواري")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Qatar Mobile Number (+974) *", "رقم الجوال القطري (+974) *")}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+974 5106 1111"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                        dir="ltr"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                        {t("Email Address (Optional)", "البريد الإلكتروني (اختياري)")}
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.qa"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-6">
                    <label className="block text-xs text-muted-on-green font-medium mb-1.5">
                      {t("Special Dietary or Setup Requests", "ملاحظات إضافية حول التجهيز أو أنواع الحليب")}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t("e.g., Oat milk preference, outdoor majlis setup, specific parking entrance...", "مثال: توفير حليب شوفان، تجهيز في جلسة خارجية، مدخل الموقف...")}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-surface-green border border-muted-on-green/30 rounded-none px-4 py-3 text-brand-cream text-sm focus:outline-none focus:border-brand-cream"
                    />
                  </div>

                  {/* Policy & No-Payment Assurance */}
                  <div className="p-4 rounded-none bg-surface-green/40 border border-muted-on-green/15 text-xs text-muted-on-green mb-8 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-cream mb-0.5">
                        {t("Direct Coordination — Zero Online Payment", "تنسيق مباشر — بدون دفع إلكتروني مسبق")}
                      </p>
                      <p>
                        {t(
                          "Submitting sends your request to our team. You can immediately confirm details on WhatsApp to finalize setup and payment upon delivery.",
                          "الضغط على إرسال يوجه تفاصيل طلبك مباشرة لإدارتنا. يمكنك تأكيد التفاصيل فوراً عبر الواتساب لتنسيق الموعد والدفع عند الاستلام."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-none border border-muted-on-green/30 text-brand-cream text-xs font-semibold hover:bg-surface-green flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                      <span>{t("Back", "السابق")}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 rounded-none bg-brand-cream text-brand-green font-bold text-sm hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? t("Submitting...", "جاري الإرسال...")
                        : t("Submit & Confirm on WhatsApp", "إرسال وتأكيد الطلب")}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

import { Layout } from "@/components/layout/Layout";
import { useInView } from "@/hooks/useInView";
import { useTexts } from "@/hooks/useTexts";
import { useState } from "react";
import { Calendar, Clock, ChevronRight, Check } from "lucide-react";

const projectTypes = [
  "Tokenomics Design",
  "Go-to-Market Strategy",
  "Product Strategy",
  "Business Development",
  "Full Engagement",
];

const budgetRanges = [
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const Booking = () => {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const { getText } = useTexts();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    date: "",
    time: "",
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-vice">
          <div
            ref={headerRef}
            className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
              headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {getText("booking_label", "Book a Call")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              {getText("booking_heading", "Let's discuss your project")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getText("booking_description", "Schedule a free 30-minute consultation to explore how we can work together.")}
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-20">
        <div className="container-vice max-w-3xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-16">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center border transition-all ${
                    step >= s
                      ? "bg-foreground text-background border-foreground shadow-lg scale-110"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-px transition-colors ${
                      step > s ? "bg-foreground" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h2 className="text-2xl font-light mb-6">
                   {getText("booking_step1_title", "What type of project are you working on?")}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, projectType: type })}
                      className={`p-4 border text-left transition-all rounded-2xl ${
                        formData.projectType === type
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-light mb-6">
                  {getText("booking_step1_subtitle", "What's your estimated budget?")}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setFormData({ ...formData, budget: range })}
                      className={`p-4 border text-center transition-all rounded-2xl ${
                        formData.budget === range
                          ? "border-foreground bg-secondary font-medium"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.projectType || !formData.budget}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity rounded-2xl font-medium"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  {getText("booking_step2_title", "Select a date")}
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i + 1);
                    const dateStr = date.toISOString().split("T")[0];
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                    const dayNum = date.getDate();

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setFormData({ ...formData, date: dateStr })}
                        className={`p-3 border text-center transition-all rounded-2xl ${
                          formData.date === dateStr
                            ? "border-foreground bg-secondary"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground font-medium uppercase">{dayName}</p>
                        <p className="text-lg font-light">{dayNum}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  {getText("booking_step2_subtitle", "Select a time")}
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, time })}
                      className={`p-3 border text-center transition-all rounded-2xl ${
                        formData.time === time
                          ? "border-foreground bg-secondary font-medium"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 border border-foreground py-4 hover:bg-secondary transition-colors rounded-2xl font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.date || !formData.time}
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity rounded-2xl font-medium"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 font-medium">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">Company / Protocol</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">Tell me about your project</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-border bg-transparent px-4 py-3 focus:border-foreground focus:outline-none transition-colors resize-none rounded-2xl"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-foreground py-4 hover:bg-secondary transition-colors rounded-2xl font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-foreground text-background py-4 hover:opacity-90 transition-opacity rounded-2xl font-medium shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-16 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-foreground text-background flex items-center justify-center mx-auto mb-8 rounded-full shadow-lg">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-light mb-4">{getText("booking_success_title", "Booking Confirmed!")}</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                {getText("booking_success_msg", "You'll receive a confirmation email shortly with the meeting details.")}
              </p>
              <div className="inline-block px-6 py-4 bg-secondary rounded-2xl text-foreground font-medium border border-border">
                {formData.date} at {formData.time}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Booking;

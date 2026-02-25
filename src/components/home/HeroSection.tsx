import { ArrowDown } from "lucide-react";
import victorPortrait from "@/assets/victor-chime.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="container-vice relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-6rem)] items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 xl:col-span-5 relative pt-12 lg:pt-0">
            {/* Vertical Text */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-0 animate-[slideInLeft_0.8s_ease-out_0.2s_forwards]"
            >
              <span className="vertical-text text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Business Developer
              </span>
            </div>

            {/* Stats */}
            <div
              className="flex gap-12 mb-8 lg:mb-16 lg:ml-12 opacity-0 animate-[fadeUp_0.8s_ease-out_0.3s_forwards]"
            >
              <div>
                <p className="stat-number">+200</p>
                <p className="stat-label">Project completed</p>
              </div>
              <div>
                <p className="stat-number">+50</p>
                <p className="stat-label">Startup raised</p>
              </div>
            </div>

            {/* Main Headline */}
            <div
              className="lg:ml-12 opacity-0 animate-[fadeUp_0.8s_ease-out_0.5s_forwards]"
            >
              <h1 className="hero-headline mb-6">Hello</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md">
                — It's Victor Chime, a Tokenomist & Product Strategist.
              </p>
            </div>

            {/* Scroll Indicator */}
            <div
              className="absolute bottom-12 left-0 lg:left-12 hidden lg:flex items-center gap-3 opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]"
            >
              <span className="scroll-indicator">Scroll down</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* Year */}
            <div
              className="absolute bottom-12 left-0 hidden lg:block opacity-0 animate-[fadeIn_0.8s_ease-out_0.9s_forwards]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span className="text-xs text-muted-foreground tracking-widest">
                2026
              </span>
            </div>
          </div>

          {/* Right Content - Portrait */}
          <div
            className="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end items-end opacity-0 animate-[fadeIn_1s_ease-out_0.4s_forwards]"
          >
            <div className="relative w-full max-w-lg lg:max-w-none lg:w-auto">
              <img
                src={victorPortrait}
                alt="Victor Chime - Business Developer & Tokenomist"
                className="w-full h-auto lg:h-[85vh] object-cover object-top grayscale"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div
        className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]"
      >
        <span className="scroll-indicator text-xs">Scroll down</span>
        <ArrowDown className="w-3 h-3 animate-bounce" />
      </div>
    </section>
  );
};

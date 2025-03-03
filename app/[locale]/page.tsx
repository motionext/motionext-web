import Image from "next/image";
import { Toaster } from "sonner";
import { getMessages } from "@/lib/get-messages";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

import FeatureCard from "@/components/FeatureCard";
import DeveloperCard from "@/components/DeveloperCard";
import TestimonialCard from "@/components/TestimonialCard";
import FaqAccordion from "@/components/FaqAccordion";

import GitHubButton from "@/components/GitHubButton";
import InstagramButton from "@/components/InstagramButton";

export interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.home;

  // Prepare data for the FAQ component
  const faqItems = [
    { question: t.faqSection.questions.q1, answer: t.faqSection.questions.a1 },
    { question: t.faqSection.questions.q2, answer: t.faqSection.questions.a2 },
    { question: t.faqSection.questions.q3, answer: t.faqSection.questions.a3 },
    { question: t.faqSection.questions.q4, answer: t.faqSection.questions.a4 },
    { question: t.faqSection.questions.q5, answer: t.faqSection.questions.a5 },
    { question: t.faqSection.questions.q6, answer: t.faqSection.questions.a6 },
    { question: t.faqSection.questions.q7, answer: t.faqSection.questions.a7 },
  ];

  // Get the number of active users from the database (with cache)
  // const activeUsers = await getActiveUsers();

  return (
    <>
      <Navbar messages={t} />
      <Toaster position="top-center" />

      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[size:24px_24px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl rounded-full"></div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-5 gap-8 items-center relative">
            <div className="text-center lg:text-left space-y-6 lg:col-span-3 relative z-10">
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-4 inline-block"
              >
                {t.comingSoonQ32025}
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 leading-tight">
                {t.welcome}
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-row gap-4 relative z-20 justify-center lg:justify-start">
                <GitHubButton repoUrl="https://github.com/motionext" />
                <InstagramButton profileUrl="https://www.instagram.com/motionext.app" />
              </div>
            </div>

            <div className="relative lg:block w-full max-w-[300px] mx-auto lg:col-span-2 z-0">
              {/* Brightness effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-70 animate-pulse"></div>

              {/* Device mockup */}
              <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-0.5 shadow-xl">
                <div className="aspect-[9/19] relative overflow-hidden rounded-md">
                  <Image
                    src="/mockup.webp"
                    alt="Motionext App Mockup"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics section */}
      {/* <section className="relative w-full py-16 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
              {t.statsSection.title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {t.statsSection.subtitle}
            </p>
          </div>

          <div className="flex justify-center">
            <StatsCard
              value={activeUsers}
              label={t.statsSection.users}
              suffix="+"
              duration={300}
            />
          </div>
        </div>
      </section> */}

      {/* Features section */}
      <section
        id="features"
        className="relative w-full py-24 md:py-32 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="px-4 py-1 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-4 inline-block"
            >
              {t.features}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t.mainFeatures}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              title={t.bodyMeasurements}
              description={t.bodyMeasurementsDesc}
              icon="📏"
            />
            <FeatureCard
              title={t.calorieCounter}
              description={t.calorieCounterDesc}
              icon="🥗"
            />
            <FeatureCard
              title={t.workoutAssistant}
              description={t.workoutAssistantDesc}
              icon="💪"
            />
            <FeatureCard
              title={t.hydrationMonitor}
              description={t.hydrationMonitorDesc}
              icon="💧"
            />
            <FeatureCard
              title={t.intermittentFasting}
              description={t.intermittentFastingDesc}
              icon="⏱️"
            />
            <FeatureCard
              title={t.mentalHealth}
              description={t.mentalHealthDesc}
              icon="🧘"
            />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="relative w-full py-24 md:py-32 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="px-4 py-1 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-4 inline-block"
            >
              {t.userTestimonials}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t.testimonials}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              name={t.testimonial1.name}
              role={t.testimonial1.role}
              text={t.testimonial1.text}
              avatar="/avatars/rafael.webp"
            />
            <TestimonialCard
              name={t.testimonial2.name}
              role={t.testimonial2.role}
              text={t.testimonial2.text}
              avatar="/avatars/diogo.webp"
            />
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="relative w-full py-24 md:py-32 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
              {t.faqSection.title}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {t.faqSection.subtitle}
            </p>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* Section of the Team */}
      <section
        id="team"
        className="relative w-full py-24 md:py-32 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="px-4 py-1 text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-4 inline-block"
            >
              {t.team}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t.ourTeam}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <DeveloperCard
              image="/avatars/rafael.webp"
              name="Rafael Soares"
              role={t.leadFullStackDeveloper}
              email="rafaelsoares@motionext.app"
              github="rsoaresdev"
            />
            <DeveloperCard
              image="/avatars/diogo.webp"
              name="Diogo Gonçalves"
              role={t.designer}
              email="diogogoncalves@motionext.app"
              github="bugalves"
            />
          </div>
        </div>
      </section>

      <Footer messages={messages} />
    </>
  );
}

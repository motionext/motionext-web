import { getMessages } from "@/lib/get-messages";
import { Badge } from "@/components/ui/badge";
import FeatureCard from "@/components/FeatureCard";
import DeveloperCard from "@/components/DeveloperCard";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.home;

  return (
    <>
      <Navbar messages={t} />
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
bg-[size:24px_24px] dark:bg-[size:24px_24px]-z-10"
      ></div>
      <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8 mt-7">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 leading-tight">
                {t.welcome}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {t.description}
              </p>
              <div className="flex lg:justify-start justify-center">
                <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              </div>
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl blur opacity-70 animate-pulse"></div>
                <Badge
                  variant="secondary"
                  className="relative text-xl py-3 px-6 font-bold shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {t.comingSoonQ32025}
                </Badge>
              </div>
            </div>
            <div className="relative lg:block hidden w-full max-w-[300px] mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-lg opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] p-6 shadow-2xl">
                <div className="aspect-[9/19] relative">
                  <Image
                    src="/mockup.webp"
                    alt="Motionext App Preview"
                    fill
                    className="object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative w-full py-24 md:py-32 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {t.mainFeatures}
          </h2>
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

      <section
        id="team"
        className="relative w-full py-24 md:py-32 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {t.ourTeam}
          </h2>
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
              role={t.coLeadDeveloper}
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

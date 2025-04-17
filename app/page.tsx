import Hero from "@/components/hero";
import { ArrowRightIcon, CodeBracketIcon, UserGroupIcon, FireIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default async function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Where Boulder's Builders Connect
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join a thriving community of developers, creators, and tech enthusiasts in Boulder. 
              Share projects, learn together, and build meaningful connections.
            </p>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium 
              hover:bg-emerald-700 transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer">
              Join the Community
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Abstract Background Pattern */}
        <div className="absolute top-0 left-0 right-0 h-full opacity-10 pointer-events-none">
          <div className="absolute transform rotate-45 -translate-x-1/2 -translate-y-1/2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-64 h-64 border-2 border-emerald-500 rounded-lg absolute"
                style={{ top: `${i * 100}px`, left: `${i * 100}px` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Everything You Need to Connect & Grow
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<CodeBracketIcon className="w-8 h-8 text-emerald-600" />}
            title="Share Projects"
            description="Showcase your latest builds and get feedback from fellow developers"
          />
          <FeatureCard 
            icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-emerald-600" />}
            title="Collaborate"
            description="Find partners for your next project through our messaging system"
          />
          <FeatureCard 
            icon={<UserGroupIcon className="w-8 h-8 text-emerald-600" />}
            title="Learn Together"
            description="Share and discover new skills with the Boulder tech community"
          />
          <FeatureCard 
            icon={<FireIcon className="w-8 h-8 text-emerald-600" />}
            title="Build Streaks"
            description="Stay motivated with daily sharing and learning streaks"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Boulder's Tech Community?
          </h2>
          <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
            Connect with local developers, share your projects, and be part of something bigger.
          </p>
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-medium 
            hover:bg-emerald-50 transition-colors duration-200">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm 
    hover:shadow-md transition-shadow duration-200">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

import {
  IconSparkles,
  IconChartLine,
  IconChartBar,
  IconBell,
  IconTrendingUp,
  IconLanguage,
  IconFileText,
  IconDownload,
  IconBrain,
  IconBrandPython,
  IconDatabase,
  IconBrandReact,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconChartBar,
    title: "Real-time Sentiment Dashboard",
    description:
      "Monitor emotions across all your Instagram content with live updates and beautiful visualizations.",
  },
  {
    icon: IconBell,
    title: "AI-Powered Alerts",
    description:
      "Get instant notifications when sentiment shifts or negativity spikes are detected.",
  },
  {
    icon: IconTrendingUp,
    title: "Influencer Ranking",
    description:
      "Track and rank influencers based on sentiment scores and engagement metrics.",
  },
  {
    icon: IconLanguage,
    title: "Multilingual Support",
    description:
      "Analyze content in Hindi, Hinglish, Marathi, and more with advanced NLP models.",
  },
  {
    icon: IconSparkles,
    title: "Viral Prediction",
    description:
      "Leverage AI to predict which posts are most likely to go viral based on sentiment trends.",
  },
  {
    icon: IconFileText,
    title: "PDF Reports",
    description:
      "Generate comprehensive sentiment reports with charts and insights for stakeholders.",
  },
];
const steps = [
  {
    icon: IconDownload,
    title: "Fetch Data",
    description:
      "Connect your Instagram account and automatically pull posts, comments, and engagement metrics.",
  },
  {
    icon: IconBrain,
    title: "Analyze",
    description:
      "Our AI models process sentiment, detect emotions, and identify trends across your content.",
  },
  {
    icon: IconChartLine,
    title: "Visualize",
    description:
      "View actionable insights through interactive dashboards and comprehensive reports.",
  },
];
const techStack = [
  { name: "Python", color: "from-blue-500 to-yellow-500" },
  { name: "Flask", color: "from-gray-700 to-gray-900" },
  { name: "Next.js", color: "from-gray-800 to-black" },
  { name: "MongoDB", color: "from-green-500 to-green-700" },
  { name: "DaisyUI", color: "from-purple-500 to-pink-500" },
  { name: "HuggingFace", color: "from-yellow-400 to-orange-500" },
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-base-content px-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary/50 via-neutral to-primary/50 rounded-full opacity-20 blur-3xl animate-float"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-secondary/50 via-neutral to-secondary/50 rounded-full opacity-20 blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">
                <IconSparkles className="w-4 h-4 text-primary" />
                <span className="text-base-content">AI-Powered Analytics</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Analyze Instagram Sentiment with{" "}
                <span className="text-base-content">AI</span>
              </h1>

              <p className="text-xl text-neutral-foreground max-w-2xl">
                Monitor emotions, predict virality, and track audience mood in
                real time. Transform Instagram insights into actionable
                intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="btn btn-lg btn-primary hover:scale-105 transition-transform">
                  <IconSparkles className="w-5 h-5" />
                  Get Started
                </button>
                <button className="btn btn-lg btn-info btn-outline hover:scale-105 transition-transform">
                  <IconChartLine className="w-5 h-5" />
                  View Demo
                </button>
              </div>

              {/* Stats */}
              <div
                className="stats mt-8 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="stat">
                  <div className="stat-title">Posts Analyzed</div>
                  <div className="stat-value text-primary">1.2M+</div>
                  <div className="stat-desc">in the last month</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Average Sentiment</div>
                  <div className="stat-value text-secondary">+78%</div>
                  <div className="stat-desc">Positive Engagement</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Predicted Virality</div>
                  <div className="stat-value text-accent">92%</div>
                  <div className="stat-desc">Accuracy Rate</div>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div
              className="relative animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-b/50 backdrop-blur-sm">
                <img
                  src={"/dashboard-preview.jpg"}
                  alt="InstaPulse AI Dashboard Preview showing sentiment analysis charts and metrics"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-secondary/20 pointer-events-none"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-b animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-tr from-primary/40 to-primary/20 rounded-full flex items-center justify-center">
                    <IconSparkles className="w-6 h-6 text-base-content" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Live Sentiment</div>
                    <div className="text-xs text-neutral">Positive 87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-10 bg-neutral/30" id="features">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Powerful <span className="text-base-content">Features</span>
            </h2>
            <p className="text-xl text-neutral-foreground max-w-2xl mx-auto">
              Everything you need to understand and leverage Instagram sentiment
              data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border border-b"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-body">
                  <div className="w-16 h-16 bg-linear-to-tr from-primary/40 to-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="w-8 h-8 text-base-content" />
                  </div>
                  <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                  <p className="text-neutral-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-10" id="how-it-works">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It <span className="text-base-content">Works</span>
            </h2>
            <p className="text-xl text-neutral-foreground max-w-2xl mx-auto">
              Three simple steps to unlock powerful Instagram sentiment insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 gradient-full opacity-30"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 bg-linear-to-tr from-primary/40 to-primary/20 rounded-full flex items-center justify-center shadow-xl relative z-10">
                    <step.icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 gradient-secondary rounded-full blur-xl opacity-50 animate-glow"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold shadow-lg z-20">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-10 bg-neutral/30" id="tech-stack">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built with <span className="text-base-content">Modern Tech</span>
            </h2>
            <p className="text-xl text-neutral-foreground max-w-2xl mx-auto">
              Powered by industry-leading technologies and frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="card bg-card hover:shadow-xl transition-all duration-300 hover:scale-110 animate-fade-in border border-b"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-body items-center justify-center p-6">
                  <div
                    className={`w-16 h-16 bg-linear-to-br ${tech.color} rounded-xl mb-3 flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                  </div>
                  <h3 className="font-semibold text-center">{tech.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Additional tech icons */}
          <div className="flex justify-center items-center gap-8 mt-12 flex-wrap">
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-md border border-b">
              <IconBrandPython className="w-6 h-6 text-primary" />
              <span className="font-medium">Python AI Models</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-md border border-b">
              <IconDatabase className="w-6 h-6 text-accent" />
              <span className="font-medium">Real-time Database</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-md border border-b">
              <IconBrandReact className="w-6 h-6 text-secondary" />
              <span className="font-medium">Modern UI</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

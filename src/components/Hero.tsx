import { Button } from "@/components/ui/button";
import { Camera, Star, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-photography.jpg";

const Hero = () => {
  const stats = [
    { icon: Camera, label: "Photos Captured", value: "10K+" },
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Star, label: "Client Rating", value: "4.9" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Professional Photography"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Capture Your
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Perfect Moment
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Professional photography services with cutting-edge automation tools. 
              From stunning portraits to complete website solutions, we bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="hero" size="xl" className="group">
                <Camera className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Book Photo Session
              </Button>
              <Button variant="premium" size="xl">
                View Portfolio
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Services Preview */}
          <div className="hidden lg:block slide-up">
            <div className="grid grid-cols-1 gap-6">
              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Photography Services</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Professional photo shoots starting from Rp 250,000
                    </p>
                    <div className="text-primary font-semibold">From Rp 250.000</div>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Website Development</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Complete website solutions for your business
                    </p>
                    <div className="text-accent font-semibold">From Rp 700.000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-60 animate-pulse" />
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-accent rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-3 h-3 bg-primary rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;
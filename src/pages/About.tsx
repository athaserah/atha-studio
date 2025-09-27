import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Award, Users, Clock, Star, Heart, Palette, Zap } from "lucide-react";

const About = () => {
  const skills = [
    { name: "Portrait Photography", level: 95 },
    { name: "Landscape Photography", level: 90 },
    { name: "Wedding Photography", level: 92 },
    { name: "Product Photography", level: 88 },
    { name: "Photo Editing", level: 96 },
    { name: "Studio Lighting", level: 89 },
  ];

  const services = [
    {
      icon: Camera,
      title: "Professional Photography",
      description: "Capturing life's precious moments with artistic vision and technical excellence.",
      specialties: ["Portraits", "Weddings", "Events", "Commercial"]
    },
    {
      icon: Palette,
      title: "Photo Enhancement",
      description: "Advanced editing and retouching services to make your photos truly stunning.",
      specialties: ["Color Grading", "Retouching", "Artistic Effects", "Restoration"]
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Cutting-edge tools for watermarking, batch processing, and AI enhancement.",
      specialties: ["Watermarking", "Batch Resize", "AI Enhancement", "Quality Control"]
    },
  ];

  const achievements = [
    { icon: Award, value: "25+", label: "Awards Won" },
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Camera, value: "10K+", label: "Photos Captured" },
    { icon: Clock, value: "5+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}ChronoLens Pro
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              I'm a passionate photographer with over 5 years of experience capturing life's most 
              beautiful moments. My style blends artistic vision with technical precision, creating 
              timeless images that tell compelling stories.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-primary" />
                <span>Passionate about capturing authentic emotions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-primary" />
                <span>Committed to delivering exceptional quality</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-primary" />
                <span>Utilizing cutting-edge technology and techniques</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                <Camera className="h-5 w-5" />
                Book a Session
              </Button>
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </div>
          </div>

          <div className="slide-up">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face"
                alt="Photographer Portrait"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 fade-in">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={achievement.label} className="text-center hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{achievement.value}</div>
                  <div className="text-muted-foreground">{achievement.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skills */}
        <div className="mb-20 slide-up">
          <h2 className="text-3xl font-bold text-center mb-12">
            My Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-primary font-semibold">{skill.level}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${skill.level}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">
            What I Offer
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.title} 
                  className="group hover:shadow-glow transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {service.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="group-hover:bg-primary/10">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 p-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's work together to capture your special moments and bring your creative vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Camera className="h-5 w-5" />
              Book Photography Session
            </Button>
            <Button variant="premium" size="lg">
              Request Website Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
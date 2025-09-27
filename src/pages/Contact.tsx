import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Facebook,
  Camera,
  Globe,
  Calendar as CalendarIcon,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

const Contact = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [photoPackage, setPhotoPackage] = useState("");
  const [websitePackage, setWebsitePackage] = useState("");

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@chronolens.pro",
      href: "mailto:hello@chronolens.pro"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+62 812-3456-7890",
      href: "tel:+6281234567890"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Jakarta, Indonesia",
      href: "https://maps.google.com"
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "@chronolens.pro" },
    { icon: Twitter, href: "#", label: "@chronolens" },
    { icon: Facebook, href: "#", label: "ChronoLens Pro" }
  ];

  const photoPackages = [
    {
      name: "Basic Portrait",
      price: "Rp 250.000",
      duration: "1 hour",
      photos: "10 edited photos",
      features: ["Studio or outdoor", "Basic editing", "Digital delivery"]
    },
    {
      name: "Premium Portrait",
      price: "Rp 500.000",
      duration: "2 hours",
      photos: "25 edited photos",
      features: ["Multiple locations", "Advanced editing", "Print package included"]
    },
    {
      name: "Wedding Package",
      price: "Rp 2.500.000",
      duration: "Full day",
      photos: "200+ edited photos",
      features: ["Ceremony & reception", "Two photographers", "Online gallery"]
    }
  ];

  const websitePackages = [
    {
      name: "Basic Website",
      price: "Rp 700.000",
      features: ["5 pages", "Responsive design", "Basic SEO", "Contact form"]
    },
    {
      name: "Professional Website",
      price: "Rp 1.500.000",
      features: ["10 pages", "Custom design", "Advanced SEO", "Blog system", "Social integration"]
    },
    {
      name: "E-commerce Website",
      price: "Rp 3.000.000",
      features: ["Online store", "Payment integration", "Inventory management", "Order tracking"]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Get In
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Touch
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Contact us for photography services 
            or website development. We're here to help create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 slide-up">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={contact.label}
                      href={contact.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300 group"
                    >
                      <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <div className="font-medium">{contact.label}</div>
                        <div className="text-muted-foreground text-sm">{contact.value}</div>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-300 group"
                      >
                        <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Service Packages */}
            {selectedService === "photography" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span>Photography Packages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {photoPackages.map((pkg) => (
                    <div 
                      key={pkg.name}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        photoPackage === pkg.name 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPhotoPackage(pkg.name)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {pkg.price}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {pkg.duration} • {pkg.photos}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedService === "website" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Website Packages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {websitePackages.map((pkg) => (
                    <div 
                      key={pkg.name}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        websitePackage === pkg.name 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setWebsitePackage(pkg.name)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {pkg.price}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+62 812-3456-7890" />
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type *</label>
                  <Select value={selectedService} onValueChange={setSelectedService} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photography">Photography Services</SelectItem>
                      <SelectItem value="website">Website Development</SelectItem>
                      <SelectItem value="consultation">General Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection for Photography */}
                {selectedService === "photography" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Package Selection */}
                {selectedService === "photography" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Package</label>
                    <Select value={photoPackage} onValueChange={setPhotoPackage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a photography package" />
                      </SelectTrigger>
                      <SelectContent>
                        {photoPackages.map((pkg) => (
                          <SelectItem key={pkg.name} value={pkg.name}>
                            {pkg.name} - {pkg.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedService === "website" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Package</label>
                    <Select value={websitePackage} onValueChange={setWebsitePackage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a website package" />
                      </SelectTrigger>
                      <SelectContent>
                        {websitePackages.map((pkg) => (
                          <SelectItem key={pkg.name} value={pkg.name}>
                            {pkg.name} - {pkg.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea 
                    placeholder="Tell us about your project, requirements, or any questions you have..."
                    className="min-h-32"
                    required
                  />
                </div>

                {/* Price Information */}
                {(selectedService === "photography" || selectedService === "website") && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium">Pricing Information</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedService === "photography" 
                        ? "Photography services start from Rp 250.000. Final pricing depends on your specific requirements and chosen package."
                        : "Website development starts from Rp 700.000. Cost varies based on complexity and features required."
                      }
                    </p>
                  </div>
                )}

                <Button type="submit" variant="hero" className="w-full" size="lg">
                  <Mail className="h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
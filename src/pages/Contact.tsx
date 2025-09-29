import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import Navbar from "@/components/Navbar";
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

const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  service: z.string().min(1, 'Pilih jenis layanan'),
  package: z.string().min(1, 'Pilih paket'),
  budget: z.string().min(1, 'Pilih range budget'),
  message: z.string().optional()
});

const Contact = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [photoPackage, setPhotoPackage] = useState("");
  const [websitePackage, setWebsitePackage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentPackage = selectedService === 'photography' ? photoPackage : websitePackage;
      const budget = selectedService === 'photography' 
        ? photoPackages.find(p => p.name === photoPackage)?.price || ''
        : websitePackages.find(p => p.name === websitePackage)?.price || '';

      const validatedData = bookingSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: selectedService,
        package: currentPackage,
        budget: budget,
        message: formData.message
      });

      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_name: validatedData.name,
          customer_email: validatedData.email,
          customer_phone: validatedData.phone,
          service_type: validatedData.service,
          package_type: validatedData.package,
          event_date: selectedDate?.toISOString().split('T')[0] || null,
          budget_range: validatedData.budget,
          message: validatedData.message || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Pemesanan berhasil!",
        description: "Terima kasih, kami akan menghubungi Anda segera.",
      });

      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSelectedService('');
      setSelectedDate(undefined);
      setPhotoPackage('');
      setWebsitePackage('');
    } catch (error: any) {
      console.error('Booking error:', error);
      
      if (error.errors) {
        const errorMessage = error.errors.map((err: any) => err.message).join(', ');
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Terjadi kesalahan saat mengirim pemesanan",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Hit Me
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Up Dong!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Siap wujudin visi lu jadi kenyataan? Gas kontak gue buat jasa foto 
            atau bikin website. Gue siap bantu lu bikin sesuatu yang amazing!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8 slide-up order-2 lg:order-1">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Info Kontak</span>
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
                <CardTitle>Follow Gue</CardTitle>
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
                    <span>Paket Fotoan Kece</span>
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
                    <span>Paket Website Kece</span>
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
          <Card className="slide-up order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Kirim Pesan ke Gue</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input 
                      placeholder="Your full name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    placeholder="+62 812-3456-7890" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
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
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
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

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                  <Mail className="h-5 w-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
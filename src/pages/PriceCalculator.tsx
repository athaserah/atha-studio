import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function PriceCalculator() {
  const [serviceType, setServiceType] = useState("wedding");
  const [duration, setDuration] = useState("half");
  const [addons, setAddons] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const basePrices = {
    wedding: { half: 3000000, full: 5000000, multi: 8000000 },
    prewedding: { half: 2000000, full: 3500000, multi: 6000000 },
    graduation: { half: 500000, full: 1000000, multi: 1500000 },
    birthday: { half: 800000, full: 1500000, multi: 2500000 },
    corporate: { half: 2000000, full: 4000000, multi: 7000000 }
  };

  const addonPrices = {
    video: 2000000,
    album: 1500000,
    drone: 1000000,
    makeup: 1500000,
    prints: 500000,
    editing: 800000
  };

  const calculatePrice = () => {
    const base = basePrices[serviceType as keyof typeof basePrices][duration as keyof typeof basePrices.wedding];
    const addonTotal = addons.reduce((sum, addon) => sum + addonPrices[addon as keyof typeof addonPrices], 0);
    const total = base + addonTotal;
    setTotalPrice(total);

    // Log to database
    supabase.from('price_calculator_logs').insert({
      service_type: serviceType,
      selections: { duration, addons },
      total_price: total
    }).then(({ error }) => {
      if (error) console.error('Error logging calculation:', error);
    });
  };

  const toggleAddon = (addon: string) => {
    setAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Kalkulator Harga</h1>
            <p className="text-muted-foreground">Hitung estimasi biaya layanan fotografi Anda</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pilih Layanan Anda
              </CardTitle>
              <CardDescription>Sesuaikan dengan kebutuhan acara Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Jenis Layanan</Label>
                <RadioGroup value={serviceType} onValueChange={setServiceType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wedding" id="wedding" />
                    <Label htmlFor="wedding">Pernikahan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prewedding" id="prewedding" />
                    <Label htmlFor="prewedding">Prewedding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="graduation" id="graduation" />
                    <Label htmlFor="graduation">Wisuda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="birthday" id="birthday" />
                    <Label htmlFor="birthday">Ulang Tahun</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corporate" id="corporate" />
                    <Label htmlFor="corporate">Corporate Event</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Durasi</Label>
                <RadioGroup value={duration} onValueChange={setDuration}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half" id="half" />
                    <Label htmlFor="half">Half Day (4-6 jam)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full">Full Day (8-10 jam)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multi" id="multi" />
                    <Label htmlFor="multi">Multi Day (2+ hari)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Add-ons</Label>
                <div className="space-y-3">
                  {Object.entries(addonPrices).map(([key, price]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key} 
                        checked={addons.includes(key)}
                        onCheckedChange={() => toggleAddon(key)}
                      />
                      <Label htmlFor={key} className="flex justify-between w-full cursor-pointer">
                        <span className="capitalize">{key === 'drone' ? 'Drone Footage' : key === 'makeup' ? 'Makeup Artist' : key === 'album' ? 'Album Foto' : key === 'video' ? 'Videografi' : key === 'prints' ? 'Cetak Foto' : 'Editing Premium'}</span>
                        <span className="text-muted-foreground">{formatPrice(price)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={calculatePrice} className="w-full" size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Hitung Total
              </Button>

              {totalPrice > 0 && (
                <Card className="bg-primary/5 border-primary">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Estimasi Total Harga</p>
                      <p className="text-4xl font-bold text-primary">{formatPrice(totalPrice)}</p>
                      <p className="text-xs text-muted-foreground mt-2">*Harga dapat berubah sesuai kebutuhan spesifik</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

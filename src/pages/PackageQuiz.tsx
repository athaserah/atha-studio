import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: { value: string; label: string; score: Record<string, number> }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Apa jenis acara yang akan Anda adakan?",
    options: [
      { value: "wedding", label: "Pernikahan", score: { wedding_premium: 3, wedding_standard: 2 } },
      { value: "prewedding", label: "Prewedding", score: { prewedding_deluxe: 3, prewedding_basic: 2 } },
      { value: "graduation", label: "Wisuda", score: { graduation_package: 3 } },
      { value: "birthday", label: "Ulang Tahun/Event Personal", score: { event_package: 3 } }
    ]
  },
  {
    id: 2,
    question: "Berapa budget yang Anda siapkan?",
    options: [
      { value: "low", label: "< Rp 2 juta", score: { graduation_package: 2, prewedding_basic: 2 } },
      { value: "mid", label: "Rp 2-5 juta", score: { wedding_standard: 2, prewedding_deluxe: 2, event_package: 2 } },
      { value: "high", label: "> Rp 5 juta", score: { wedding_premium: 3, prewedding_deluxe: 1 } }
    ]
  },
  {
    id: 3,
    question: "Berapa lama durasi acara?",
    options: [
      { value: "short", label: "1-3 jam", score: { graduation_package: 2, prewedding_basic: 1 } },
      { value: "medium", label: "4-8 jam", score: { wedding_standard: 2, event_package: 2 } },
      { value: "long", label: "Lebih dari 8 jam atau multi-hari", score: { wedding_premium: 3, prewedding_deluxe: 2 } }
    ]
  },
  {
    id: 4,
    question: "Apakah Anda membutuhkan videografi?",
    options: [
      { value: "yes", label: "Ya, sangat penting", score: { wedding_premium: 2, prewedding_deluxe: 2 } },
      { value: "maybe", label: "Mungkin, jika sesuai budget", score: { wedding_standard: 1, event_package: 1 } },
      { value: "no", label: "Tidak, hanya foto", score: { graduation_package: 1, prewedding_basic: 1 } }
    ]
  },
  {
    id: 5,
    question: "Apakah Anda ingin mendapatkan hasil berupa album cetak?",
    options: [
      { value: "yes", label: "Ya, album premium", score: { wedding_premium: 2, wedding_standard: 1 } },
      { value: "digital", label: "Digital saja sudah cukup", score: { graduation_package: 2, event_package: 2, prewedding_basic: 2 } },
      { value: "both", label: "Keduanya (digital & album)", score: { wedding_premium: 3, prewedding_deluxe: 2 } }
    ]
  }
];

const packages = {
  wedding_premium: {
    name: "Wedding Premium Package",
    price: "Rp 8.000.000+",
    features: ["Full day coverage", "2 fotografer + 1 videografer", "Album premium", "Drone footage", "All edited photos (500+)", "Cinematic video"]
  },
  wedding_standard: {
    name: "Wedding Standard Package",
    price: "Rp 5.000.000",
    features: ["Half day coverage", "1 fotografer + 1 videografer", "Digital album", "300+ edited photos", "Highlight video"]
  },
  prewedding_deluxe: {
    name: "Prewedding Deluxe",
    price: "Rp 3.500.000",
    features: ["2 lokasi", "Full day", "Makeup artist included", "200+ edited photos", "Cinematic video", "Album 20x30"]
  },
  prewedding_basic: {
    name: "Prewedding Basic",
    price: "Rp 2.000.000",
    features: ["1 lokasi", "4 jam", "100+ edited photos", "Digital files"]
  },
  graduation_package: {
    name: "Paket Wisuda",
    price: "Rp 500.000",
    features: ["1-2 jam", "50+ edited photos", "Digital files", "Express editing (2 hari)"]
  },
  event_package: {
    name: "Event Package",
    price: "Rp 1.500.000",
    features: ["4-6 jam", "1 fotografer", "200+ edited photos", "Digital files", "Basic editing"]
  }
};

export default function PackageQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const scores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(o => o.value === answerValue);
      
      if (option) {
        Object.entries(option.score).forEach(([pkg, points]) => {
          scores[pkg] = (scores[pkg] || 0) + points;
        });
      }
    });

    const recommended = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    setResult(recommended);

    // Save to database
    supabase.from('quiz_results').insert({
      answers,
      recommended_package: recommended,
      email: email || null
    }).then(({ error }) => {
      if (error) console.error('Error saving quiz result:', error);
    });
  };

  const saveResult = async () => {
    if (!email) {
      toast({
        title: "Email diperlukan",
        description: "Masukkan email untuk menerima detail paket",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('quiz_results').insert({
      answers,
      recommended_package: result!,
      email
    });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan hasil. Silakan coba lagi.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Berhasil!",
        description: "Kami akan mengirim detail paket ke email Anda"
      });
    }
  };

  if (result) {
    const pkg = packages[result as keyof typeof packages];
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl">Paket yang Cocok untuk Anda!</CardTitle>
                <CardDescription>Berdasarkan jawaban Anda, kami merekomendasikan:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <h2 className="text-2xl font-bold mb-2">{pkg.name}</h2>
                  <p className="text-3xl font-bold text-primary">{pkg.price}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Fitur yang Termasuk:</h3>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email">Kirim detail paket ke email saya:</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={saveResult} className="w-full">
                    Kirim Detail Paket
                  </Button>
                </div>

                <Button variant="outline" onClick={() => { setResult(null); setCurrentQuestion(0); setAnswers({}); }} className="w-full">
                  Ulangi Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Paket Mana yang Cocok?</h1>
            <p className="text-muted-foreground">Jawab 5 pertanyaan untuk menemukan paket terbaik untuk Anda</p>
          </div>

          <Card>
            <CardHeader>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer}>
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <Button variant="outline" onClick={prevQuestion} className="flex-1">
                    Kembali
                  </Button>
                )}
                <Button 
                  onClick={nextQuestion} 
                  disabled={!answers[currentQ.id]}
                  className="flex-1"
                >
                  {currentQuestion === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

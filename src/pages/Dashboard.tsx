import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Camera, Globe, User, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Download, FileText } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  phone: string;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  service_type: string;
  package_type: string;
  event_date: string;
  status: string;
  budget_range: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  issued_date: string;
  booking_id: string;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  photo_count?: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      fetchBookings();
      fetchInvoices();
      fetchGalleries();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data profil",
        variant: "destructive",
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pemesanan",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchGalleries = async () => {
    try {
      const { data, error } = await supabase
        .from('client_galleries')
        .select(`
          *,
          gallery_photos(count)
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleries(data?.map(g => ({
        ...g,
        photo_count: g.gallery_photos?.[0]?.count || 0
      })) || []);
    } catch (error: any) {
      console.error('Error fetching galleries:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Menunggu', variant: 'secondary' as const },
      confirmed: { label: 'Dikonfirmasi', variant: 'default' as const },
      completed: { label: 'Selesai', variant: 'outline' as const },
      cancelled: { label: 'Dibatalkan', variant: 'destructive' as const },
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getServiceIcon = (serviceType: string) => {
    return serviceType === 'photography' ? (
      <Camera className="h-4 w-4" />
    ) : (
      <Globe className="h-4 w-4" />
    );
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Gue</h1>
            <p className="text-muted-foreground">
              Selamat datang balik, {profile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Balik ke Website
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-5">
            <TabsTrigger value="bookings">Pesanan</TabsTrigger>
            <TabsTrigger value="galleries">Galeri</TabsTrigger>
            <TabsTrigger value="invoices">Invoice</TabsTrigger>
            <TabsTrigger value="photos" className="hidden md:block">Koleksi</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Daftar Pesanan Gue</h2>
                <Badge variant="secondary">{bookings.length} total</Badge>
              </div>
              
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada pesanan nih bos</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getServiceIcon(booking.service_type)}
                            <CardTitle className="text-lg">
                              {booking.customer_name}
                            </CardTitle>
                          </div>
                          <Badge {...getStatusBadge(booking.status)}>
                            {getStatusBadge(booking.status).label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Layanan:</p>
                            <p className="text-muted-foreground capitalize">
                              {booking.service_type === 'photography' ? 'Fotografi' : 'Website'} - {booking.package_type}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Budget:</p>
                            <p className="text-muted-foreground">{booking.budget_range}</p>
                          </div>
                          <div>
                            <p className="font-medium">Email:</p>
                            <p className="text-muted-foreground">{booking.customer_email}</p>
                          </div>
                          <div>
                            <p className="font-medium">Tanggal:</p>
                            <p className="text-muted-foreground">
                              {booking.event_date || 'Belum ditentukan'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="galleries" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Galeri Pribadi Gue</h2>
                <Badge variant="secondary">{galleries.length} galeri</Badge>
              </div>
              
              {galleries.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada galeri pribadi nih</p>
                    <p className="text-sm text-muted-foreground mt-2">Admin akan membuat galeri setelah acara selesai</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {galleries.map((gallery) => (
                    <Card key={gallery.id} className="hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{gallery.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{gallery.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{gallery.photo_count || 0} foto</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Lihat & Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Invoice Gue</h2>
                <Badge variant="secondary">{invoices.length} invoice</Badge>
              </div>
              
              {invoices.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada invoice</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {invoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Tanggal: {new Date(invoice.issued_date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}>
                            {invoice.status === 'paid' ? 'Lunas' : invoice.status === 'pending' ? 'Belum Bayar' : 'Terlambat'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold">
                              Rp {invoice.amount.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Dibayar:</span>
                            <span>Rp {invoice.paid_amount.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sisa:</span>
                            <span className="font-semibold text-primary">
                              Rp {(invoice.amount - invoice.paid_amount).toLocaleString('id-ID')}
                            </span>
                          </div>
                          {invoice.due_date && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Jatuh Tempo:</span>
                              <span>{new Date(invoice.due_date).toLocaleDateString('id-ID')}</span>
                            </div>
                          )}
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Manajemen Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Segera Hadir</h3>
                  <p className="text-muted-foreground mb-4">
                    Fitur upload dan manajemen foto akan tersedia di update berikutnya
                  </p>
                  <Badge variant="outline">Phase 2</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil Saya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="font-medium">Nama Lengkap:</p>
                  <p className="text-muted-foreground">
                    {profile?.full_name || 'Belum diatur'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Bio:</p>
                  <p className="text-muted-foreground">
                    {profile?.bio || 'Belum diatur'}
                  </p>
                </div>
                <div className="pt-4">
                  <Badge variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit profil akan tersedia segera
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
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

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      fetchBookings();
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang, {profile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Kembali ke Website
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Pemesanan</TabsTrigger>
            <TabsTrigger value="photos">Foto</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Daftar Pemesanan</h2>
                <Badge variant="secondary">{bookings.length} total</Badge>
              </div>
              
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada pemesanan</p>
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
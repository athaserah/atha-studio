import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, Edit, Plus, Users, BookOpen, Image, Upload, X, 
  ArrowLeft, LayoutGrid, Star, User, Shield, Camera, TrendingUp, Activity, Calendar, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminAboutManager from '@/components/AdminAboutManager';
import { AdminHeroManager } from '@/components/AdminHeroManager';
import { ImageCropDialog } from '@/components/ImageCropDialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  phone: string;
  avatar_url: string;
  created_at: string;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  package_type: string;
  event_date: string;
  event_location: string;
  budget_range: string;
  message: string;
  status: string;
  created_at: string;
}

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  sort_order: number;
  user_id: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

type ActiveSection = 'dashboard' | 'bookings' | 'photos' | 'hero' | 'about' | 'users' | 'roles';

const adminMenuItems = [
  { id: 'bookings' as const, icon: BookOpen, title: 'Pesanan', description: 'Kelola pesanan pelanggan', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'photos' as const, icon: Camera, title: 'Galeri Foto', description: 'Kelola foto portfolio', color: 'from-purple-500/20 to-pink-500/20' },
  { id: 'hero' as const, icon: Star, title: 'Hero Stats', description: 'Kelola statistik homepage', color: 'from-amber-500/20 to-yellow-500/20' },
  { id: 'about' as const, icon: User, title: 'Halaman About', description: 'Kelola halaman tentang kami', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'users' as const, icon: Users, title: 'Pengguna', description: 'Lihat data pengguna', color: 'from-indigo-500/20 to-blue-500/20' },
  { id: 'roles' as const, icon: Shield, title: 'Hak Akses', description: 'Kelola role pengguna', color: 'from-red-500/20 to-orange-500/20' },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [userRoles, setUserRoles] = React.useState<UserRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<ActiveSection>('dashboard');
  
  const [editingPhoto, setEditingPhoto] = React.useState<Photo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    fetchAllData();
    
    const bookingsChannel = supabase
      .channel('admin-bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchAllData())
      .subscribe();

    const photosChannel = supabase
      .channel('admin-photos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => fetchAllData())
      .subscribe();

    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchAllData())
      .subscribe();

    const rolesChannel = supabase
      .channel('admin-roles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, () => fetchAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(photosChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [profilesRes, bookingsRes, photosRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('photos').select('*').order('sort_order', { ascending: true }),
        supabase.from('user_roles').select('*').order('created_at', { ascending: false })
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (bookingsRes.error) throw bookingsRes.error;
      if (photosRes.error) throw photosRes.error;
      if (rolesRes.error) throw rolesRes.error;

      setProfiles(profilesRes.data || []);
      setBookings(bookingsRes.data || []);
      setPhotos(photosRes.data || []);
      setUserRoles(rolesRes.data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Status pesanan diperbarui" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Pesanan dihapus" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updatePhoto = async (photo: Partial<Photo>) => {
    try {
      const { error } = await supabase.from('photos').update(photo).eq('id', photo.id);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Foto diperbarui" });
      setEditingPhoto(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase.from('photos').delete().eq('id', photoId);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Foto dihapus" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const createPhoto = async (photoData: Omit<Photo, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('photos').insert([{ ...photoData, user_id: user?.id }]);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Foto ditambahkan" });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Role pengguna diperbarui" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate activity data for charts
  const getActivityData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayBookings = bookings.filter(b => b.created_at.startsWith(dateStr)).length;
      const dayPhotos = photos.filter(p => p.created_at.startsWith(dateStr)).length;
      last7Days.push({
        date: date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
        aktivitas: dayBookings + dayPhotos,
      });
    }
    return last7Days;
  };

  const getCategoryData = () => {
    const categories: { [key: string]: number } = {};
    photos.forEach(photo => {
      const cat = photo.category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const getStatusData = () => {
    return [
      { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
      { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
      { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
    ].filter(item => item.value > 0);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(221, 83%, 53%)', 'hsl(262, 83%, 58%)'];
  const activityData = getActivityData();
  const totalActivity = activityData.reduce((sum, d) => sum + d.aktivitas, 0);
  const avgDaily = (totalActivity / 7).toFixed(1);

  // Dashboard View with Premium Design
  if (activeSection === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl relative">
          {/* Header with Animation */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">Selamat Datang, Admin</h1>
                <p className="text-muted-foreground">Kelola konten website Atha Studio dengan mudah</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards with Glassmorphism */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 stagger-children">
            <Card className="card-premium gradient-border group relative overflow-hidden border-l-4 border-l-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Activity className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Aktivitas</p>
                <p className="text-3xl font-bold text-foreground mb-1">{totalActivity}</p>
                <p className="text-xs text-muted-foreground">dalam 7 hari terakhir</p>
              </CardContent>
            </Card>

            <Card className="card-premium gradient-border group relative overflow-hidden border-l-4 border-l-green-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                    <TrendingUp className="h-6 w-6 text-green-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Rata-rata Harian</p>
                <p className="text-3xl font-bold text-foreground mb-1">{avgDaily}</p>
                <p className="text-xs text-muted-foreground">aktivitas per hari</p>
              </CardContent>
            </Card>

            <Card className="card-premium gradient-border group relative overflow-hidden border-l-4 border-l-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                    <Star className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Foto Unggulan</p>
                <p className="text-3xl font-bold text-foreground mb-1">{photos.filter(p => p.is_featured).length}</p>
                <p className="text-xs text-muted-foreground">dari {photos.length} foto</p>
              </CardContent>
            </Card>

            <Card className="card-premium gradient-border group relative overflow-hidden border-l-4 border-l-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                    <Calendar className="h-6 w-6 text-purple-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Pesanan Baru</p>
                <p className="text-3xl font-bold text-foreground mb-1">{bookings.filter(b => b.status === 'pending').length}</p>
                <p className="text-xs text-muted-foreground">menunggu konfirmasi</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart with Glassmorphism */}
          <Card className="mb-8 glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Aktivitas Harian</CardTitle>
              </div>
              <CardDescription>Grafik aktivitas admin dalam 7 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-soft)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aktivitas" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row with Modern Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 stagger-children" style={{ animationDelay: '0.3s' }}>
            {/* Status Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Status Pesanan</CardTitle>
                </div>
                <CardDescription>Distribusi status booking saat ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Kategori Foto</CardTitle>
                </div>
                <CardDescription>Distribusi foto per kategori</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategoryData()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px'
                        }} 
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Cards with Premium Design */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              Menu Admin
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {adminMenuItems.map((item, index) => {
                const Icon = item.icon;
                const count = item.id === 'bookings' ? bookings.length : 
                             item.id === 'photos' ? photos.length : 
                             item.id === 'users' ? profiles.length : 
                             item.id === 'roles' ? userRoles.length : null;
                
                return (
                  <Card 
                    key={item.id}
                    className="card-premium gradient-border cursor-pointer group relative overflow-hidden"
                    onClick={() => setActiveSection(item.id)}
                    style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <CardContent className="p-6 relative">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Icon className="h-7 w-7 text-primary group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 flex items-center gap-2 group-hover:text-primary transition-colors">
                            {item.title}
                            {count !== null && (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">{count}</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          
                          {/* Arrow that appears on hover */}
                          <div className="mt-3 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                            <span className="text-sm font-medium">Kelola</span>
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Content Section with Back Button and Modern Design
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl relative">
        {/* Header with Back Button */}
        <div className="mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('dashboard')}
            className="mb-4 -ml-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {adminMenuItems.find(m => m.id === activeSection)?.icon && 
                React.createElement(adminMenuItems.find(m => m.id === activeSection)!.icon, { className: "h-6 w-6 text-primary" })
              }
            </div>
            <h1 className="text-3xl font-bold">
              {adminMenuItems.find(m => m.id === activeSection)?.title || 'Admin Panel'}
            </h1>
          </div>
        </div>

        {/* Bookings Section with Modern Table */}
        {activeSection === 'bookings' && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Manajemen Pesanan</CardTitle>
              </div>
              <CardDescription>Lihat dan kelola pesanan pelanggan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Layanan</TableHead>
                      <TableHead className="font-semibold">Tanggal</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Budget</TableHead>
                      <TableHead className="font-semibold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Belum ada pesanan</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking, index) => (
                        <TableRow 
                          key={booking.id} 
                          className="border-border/50 hover:bg-muted/30 transition-colors"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">{booking.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">{booking.service_type}</div>
                              <div className="text-sm text-muted-foreground">{booking.package_type}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {booking.event_date ? new Date(booking.event_date).toLocaleDateString('id-ID') : '-'}
                          </TableCell>
                          <TableCell>
                            <Select value={booking.status} onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                              <SelectTrigger className="w-36 border-border/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                                    Pending
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="confirmed">
                                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">
                                    Confirmed
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/30">
                                    Cancelled
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="font-medium text-foreground">{booking.budget_range}</TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteBooking(booking.id)}
                              className="hover:scale-105 transition-transform"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photos Section with Modern Grid */}
        {activeSection === 'photos' && (
          <Card className="glass-card animate-fade-in">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Manajemen Foto</CardTitle>
                </div>
                <CardDescription>Kelola galeri dan portfolio foto</CardDescription>
              </div>
              <Button 
                onClick={() => { setEditingPhoto(null); setIsDialogOpen(true); }}
                className="group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tambah Foto
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <Camera className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg">Belum ada foto</p>
                      <p className="text-muted-foreground/60 text-sm">Klik "Tambah Foto" untuk menambahkan foto baru</p>
                    </div>
                  </div>
                ) : (
                  photos.map((photo, index) => (
                    <Card 
                      key={photo.id} 
                      className="card-premium group overflow-hidden"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={photo.image_url} 
                          alt={photo.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        {photo.is_featured && (
                          <Badge className="absolute top-3 left-3 bg-primary shadow-lg">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg truncate mb-2 group-hover:text-primary transition-colors">{photo.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{photo.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs border-border/50">
                            {photo.category || 'Uncategorized'}
                          </Badge>
                          {/* Toggle Featured */}
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`featured-${photo.id}`} className="text-xs text-muted-foreground cursor-pointer">
                              <Star className={`h-4 w-4 transition-colors ${photo.is_featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                            </Label>
                            <Switch 
                              id={`featured-${photo.id}`}
                              checked={photo.is_featured}
                              onCheckedChange={async (checked) => {
                                try {
                                  const { error } = await supabase.from('photos').update({ is_featured: checked }).eq('id', photo.id);
                                  if (error) throw error;
                                  toast({ title: checked ? "Ditandai unggulan" : "Dihapus dari unggulan" });
                                } catch (error: any) {
                                  toast({ title: "Error", description: error.message, variant: "destructive" });
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors" 
                            onClick={() => { setEditingPhoto(photo); setIsDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deletePhoto(photo.id)}
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Dialog - Controlled programmatically */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <PhotoDialog 
            photo={editingPhoto} 
            onSave={editingPhoto ? updatePhoto : createPhoto}
            onClose={() => { setIsDialogOpen(false); setEditingPhoto(null); }}
          />
        </Dialog>

        {/* Hero Stats Section */}
        {activeSection === 'hero' && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Hero Stats</CardTitle>
              </div>
              <CardDescription>Kelola statistik yang tampil di halaman utama</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminHeroManager />
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="animate-fade-in">
            <AdminAboutManager />
          </div>
        )}

        {/* Users Section with Modern Table */}
        {activeSection === 'users' && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Daftar Pengguna</CardTitle>
              </div>
              <CardDescription>Lihat semua pengguna terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Nama</TableHead>
                      <TableHead className="font-semibold">Telepon</TableHead>
                      <TableHead className="font-semibold">Bio</TableHead>
                      <TableHead className="font-semibold">Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Belum ada pengguna</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      profiles.map((profile, index) => (
                        <TableRow 
                          key={profile.id}
                          className="border-border/50 hover:bg-muted/30 transition-colors"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <TableCell className="font-medium text-foreground">{profile.full_name || 'N/A'}</TableCell>
                          <TableCell className="text-foreground">{profile.phone || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate text-muted-foreground">{profile.bio || 'N/A'}</TableCell>
                          <TableCell className="text-foreground">{new Date(profile.created_at).toLocaleDateString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles Section with Modern Table */}
        {activeSection === 'roles' && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Manajemen Hak Akses</CardTitle>
              </div>
              <CardDescription>Kelola role dan permission pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">User ID</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Dibuat</TableHead>
                      <TableHead className="font-semibold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Shield className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Belum ada role</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      userRoles.map((role, index) => (
                        <TableRow 
                          key={role.id}
                          className="border-border/50 hover:bg-muted/30 transition-colors"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <TableCell className="font-mono text-sm text-foreground">{role.user_id.substring(0, 8)}...</TableCell>
                          <TableCell>
                            <Select value={role.role} onValueChange={(value) => updateUserRole(role.user_id, value as 'admin' | 'user')}>
                              <SelectTrigger className="w-32 border-border/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                                    Admin
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="user">
                                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                    User
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-foreground">{new Date(role.created_at).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={role.role === 'admin' ? 'default' : 'secondary'}
                              className={role.role === 'admin' ? 'bg-primary' : ''}
                            >
                              {role.role === 'admin' ? 'Administrator' : 'Regular User'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


// Photo Dialog Component with Modern Design
function PhotoDialog({ photo, onSave, onClose }: { photo: Photo | null; onSave: (photo: any) => void; onClose: () => void; }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(photo?.image_url || '');
  const [cropDialogOpen, setCropDialogOpen] = React.useState(false);
  const [originalImage, setOriginalImage] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    title: photo?.title || '',
    description: photo?.description || '',
    image_url: photo?.image_url || '',
    category: photo?.category || '',
    tags: photo?.tags?.join(', ') || '',
    is_featured: photo?.is_featured || false,
    sort_order: photo?.sort_order || 0
  });

  // Update formData when photo prop changes
  React.useEffect(() => {
    if (photo) {
      setFormData({
        title: photo.title || '',
        description: photo.description || '',
        image_url: photo.image_url || '',
        category: photo.category || '',
        tags: photo.tags?.join(', ') || '',
        is_featured: photo.is_featured || false,
        sort_order: photo.sort_order || 0
      });
      setPreviewUrl(photo.image_url || '');
    } else {
      // Reset form for new photo
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '',
        tags: '',
        is_featured: false,
        sort_order: 0
      });
      setPreviewUrl('');
    }
  }, [photo]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "File harus berupa gambar", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Ukuran file maksimal 10MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setOriginalImage(reader.result as string); setCropDialogOpen(true); };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${user?.id}/${fileName}`;
      const { error } = await supabase.storage.from('photos').upload(filePath, croppedBlob, { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setPreviewUrl(publicUrl);
      toast({ title: "Berhasil", description: "Foto berhasil diupload" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const photoData = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean), ...(photo && { id: photo.id }) };
    onSave(photoData);
  };

  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto glass-card border-border/50">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          {photo ? 'Edit Foto' : 'Tambah Foto Baru'}
        </DialogTitle>
        <DialogDescription>{photo ? 'Update detail foto portfolio' : 'Upload foto baru ke galeri portfolio'}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Upload Foto</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
            {previewUrl ? (
              <div className="relative group">
                <img src={previewUrl} alt="Preview" className="w-full h-56 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="hover:scale-110 transition-transform" 
                    onClick={() => { setPreviewUrl(''); setFormData(prev => ({ ...prev, image_url: '' })); }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">Klik untuk upload atau drag & drop</div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">Mengupload...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url" className="text-sm font-semibold">URL Gambar (opsional)</Label>
          <Input 
            id="image_url" 
            type="url" 
            value={formData.image_url} 
            onChange={(e) => { setFormData(prev => ({ ...prev, image_url: e.target.value })); setPreviewUrl(e.target.value); }} 
            placeholder="https://example.com/image.jpg"
            className="border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold">Judul <span className="text-destructive">*</span></Label>
          <Input 
            id="title" 
            value={formData.title} 
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
            required 
            placeholder="Contoh: Wedding Outdoor Photography"
            className="border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">Deskripsi</Label>
          <Textarea 
            id="description" 
            value={formData.description} 
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Deskripsi singkat tentang foto ini..."
            rows={3}
            className="border-border/50 focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="border-border/50 focus:border-primary">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="architecture">Arsitektur</SelectItem>
                <SelectItem value="product">Produk</SelectItem>
                <SelectItem value="street">Street</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order" className="text-sm font-semibold">Urutan Tampil</Label>
            <Input 
              id="sort_order" 
              type="number" 
              value={formData.sort_order} 
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
              className="border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-semibold">Tags (pisahkan dengan koma)</Label>
          <Input 
            id="tags" 
            value={formData.tags} 
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} 
            placeholder="wedding, outdoor, romantic, sunset"
            className="border-border/50 focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <input 
            type="checkbox" 
            id="is_featured" 
            checked={formData.is_featured} 
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} 
            className="rounded border-border w-5 h-5 cursor-pointer"
          />
          <Label htmlFor="is_featured" className="text-sm font-semibold cursor-pointer flex items-center gap-2">
            <Star className={`h-4 w-4 ${formData.is_featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
            Tandai sebagai Foto Unggulan
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="hover:bg-muted">
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.image_url || uploading}
            className="min-w-[100px]"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Proses...</span>
              </div>
            ) : (
              photo ? 'Update Foto' : 'Simpan Foto'
            )}
          </Button>
        </DialogFooter>
      </form>

      <ImageCropDialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} imageSrc={originalImage} onCropComplete={handleCropComplete} />
    </DialogContent>
  );
}

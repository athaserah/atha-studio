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
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, Edit, Plus, Users, BookOpen, Image, Upload, X, 
  ArrowLeft, LayoutGrid, Star, User, Shield, Camera
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminAboutManager from '@/components/AdminAboutManager';
import { AdminHeroManager } from '@/components/AdminHeroManager';
import { ImageCropDialog } from '@/components/ImageCropDialog';

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
  { id: 'bookings' as const, icon: BookOpen, title: 'Pesanan', description: 'Kelola pesanan pelanggan' },
  { id: 'photos' as const, icon: Camera, title: 'Galeri Foto', description: 'Kelola foto portfolio' },
  { id: 'hero' as const, icon: Star, title: 'Hero Stats', description: 'Kelola statistik homepage' },
  { id: 'about' as const, icon: User, title: 'Halaman About', description: 'Kelola halaman tentang kami' },
  { id: 'users' as const, icon: Users, title: 'Pengguna', description: 'Lihat data pengguna' },
  { id: 'roles' as const, icon: Shield, title: 'Hak Akses', description: 'Kelola role pengguna' },
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Dashboard View - Card Grid like reference
  if (activeSection === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Selamat Datang, Admin</h1>
            <p className="text-muted-foreground">Kelola konten website Atha Studio</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const count = item.id === 'bookings' ? bookings.length : 
                           item.id === 'photos' ? photos.length : 
                           item.id === 'users' ? profiles.length : 
                           item.id === 'roles' ? userRoles.length : null;
              
              return (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                  onClick={() => setActiveSection(item.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                          {item.title}
                          {count !== null && (
                            <Badge variant="secondary" className="text-xs">{count}</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">{bookings.filter(b => b.status === 'pending').length}</div>
                <p className="text-sm text-muted-foreground">Pesanan Pending</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</div>
                <p className="text-sm text-muted-foreground">Dikonfirmasi</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{photos.length}</div>
                <p className="text-sm text-muted-foreground">Total Foto</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{profiles.length}</div>
                <p className="text-sm text-muted-foreground">Pengguna</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Content Section with Back Button
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold">
            {adminMenuItems.find(m => m.id === activeSection)?.title || 'Admin Panel'}
          </h1>
        </div>

        {/* Bookings Section */}
        {activeSection === 'bookings' && (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Pesanan</CardTitle>
              <CardDescription>Lihat dan kelola pesanan pelanggan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Layanan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Belum ada pesanan
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.service_type}</div>
                              <div className="text-sm text-muted-foreground">{booking.package_type}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.event_date ? new Date(booking.event_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                          <TableCell>
                            <Select value={booking.status} onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{booking.budget_range}</TableCell>
                          <TableCell>
                            <Button variant="destructive" size="sm" onClick={() => deleteBooking(booking.id)}>
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

        {/* Photos Section */}
        {activeSection === 'photos' && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Manajemen Foto</CardTitle>
                <CardDescription>Kelola galeri dan portfolio foto</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPhoto(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Foto
                  </Button>
                </DialogTrigger>
                <PhotoDialog 
                  photo={editingPhoto} 
                  onSave={editingPhoto ? updatePhoto : createPhoto}
                  onClose={() => setIsDialogOpen(false)}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Belum ada foto. Klik "Tambah Foto" untuk menambahkan.
                  </div>
                ) : (
                  photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                        {photo.is_featured && (
                          <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{photo.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{photo.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{photo.category || 'Uncategorized'}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingPhoto(photo); setIsDialogOpen(true); }}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePhoto(photo.id)}>
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

        {/* Hero Stats Section */}
        {activeSection === 'hero' && (
          <Card>
            <CardHeader>
              <CardTitle>Hero Stats</CardTitle>
              <CardDescription>Kelola statistik yang tampil di halaman utama</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminHeroManager />
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        {activeSection === 'about' && <AdminAboutManager />}

        {/* Users Section */}
        {activeSection === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
              <CardDescription>Lihat semua pengguna terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Bio</TableHead>
                      <TableHead>Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Belum ada pengguna
                        </TableCell>
                      </TableRow>
                    ) : (
                      profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.full_name || 'N/A'}</TableCell>
                          <TableCell>{profile.phone || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{profile.bio || 'N/A'}</TableCell>
                          <TableCell>{new Date(profile.created_at).toLocaleDateString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles Section */}
        {activeSection === 'roles' && (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Hak Akses</CardTitle>
              <CardDescription>Kelola role dan permission pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Belum ada data role
                        </TableCell>
                      </TableRow>
                    ) : (
                      userRoles.map((userRole) => (
                        <TableRow key={userRole.id}>
                          <TableCell className="font-mono text-xs">{userRole.user_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge variant={userRole.role === 'admin' ? 'default' : 'secondary'}>
                              {userRole.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(userRole.created_at).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Select value={userRole.role} onValueChange={(value: 'admin' | 'user') => updateUserRole(userRole.user_id, value)}>
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
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

// Photo Dialog Component
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
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{photo ? 'Edit Foto' : 'Tambah Foto Baru'}</DialogTitle>
        <DialogDescription>{photo ? 'Update detail foto' : 'Upload foto baru ke galeri'}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Upload Foto</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => { setPreviewUrl(''); setFormData(prev => ({ ...prev, image_url: '' })); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <div className="text-sm text-muted-foreground mb-2">Klik untuk upload</div>
                <Input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
                {uploading && <div className="mt-2 text-sm text-muted-foreground">Mengupload...</div>}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="image_url">URL Gambar (opsional)</Label>
          <Input id="image_url" type="url" value={formData.image_url} onChange={(e) => { setFormData(prev => ({ ...prev, image_url: e.target.value })); setPreviewUrl(e.target.value); }} placeholder="https://example.com/image.jpg" />
        </div>

        <div>
          <Label htmlFor="title">Judul</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
        </div>

        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
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

        <div>
          <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
          <Input id="tags" value={formData.tags} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} placeholder="wedding, outdoor, romantic" />
        </div>

        <div>
          <Label htmlFor="sort_order">Urutan Tampil</Label>
          <Input id="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))} />
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} className="rounded border-border" />
          <Label htmlFor="is_featured">Foto Unggulan</Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={!formData.image_url || uploading}>{photo ? 'Update' : 'Simpan'}</Button>
        </DialogFooter>
      </form>

      <ImageCropDialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} imageSrc={originalImage} onCropComplete={handleCropComplete} />
    </DialogContent>
  );
}
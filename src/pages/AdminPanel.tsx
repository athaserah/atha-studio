import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Users, BookOpen, Image, Upload, X } from 'lucide-react';
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

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [userRoles, setUserRoles] = React.useState<UserRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Form states
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);
  const [editingPhoto, setEditingPhoto] = React.useState<Photo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    fetchAllData();
    
    // Set up real-time listeners for admin
    const bookingsChannel = supabase
      .channel('admin-bookings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        console.log('🔄 Bookings updated - refreshing data');
        fetchAllData();
      })
      .subscribe();

    const photosChannel = supabase
      .channel('admin-photos-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'photos'
      }, () => {
        console.log('🔄 Photos updated - refreshing data');
        fetchAllData();
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        console.log('🔄 Profiles updated - refreshing data');
        fetchAllData();
      })
      .subscribe();

    const rolesChannel = supabase
      .channel('admin-roles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_roles'
      }, () => {
        console.log('🔄 User roles updated - refreshing data');
        fetchAllData();
      })
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
      console.log('📊 Fetching admin data...');
      
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
      
      console.log('✅ Admin data loaded successfully');
    } catch (error: any) {
      console.error('❌ Error fetching admin data:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: "Status booking berhasil diupdate secara real-time!"
      });
      
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error updating booking status:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "✅ Success", 
        description: "Booking berhasil dihapus secara real-time!"
      });
      
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error deleting booking:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updatePhoto = async (photo: Partial<Photo>) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update(photo)
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: "Foto berhasil diupdate secara real-time!"
      });
      
      setEditingPhoto(null);
      setIsDialogOpen(false);
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error updating photo:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: "Foto berhasil dihapus secara real-time!"
      });
      
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error deleting photo:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createPhoto = async (photoData: Omit<Photo, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('photos')
        .insert([{ ...photoData, user_id: user?.id }]);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: "Foto baru berhasil dibuat secara real-time!"
      });
      
      setIsDialogOpen(false);
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error creating photo:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: "Role user berhasil diupdate secara real-time!"
      });
      
      // Data will auto-refresh via real-time listener
    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel Sultan</h1>
        <p className="text-muted-foreground">Atur semua yang ada di website lu bos</p>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Pesanan ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Foto ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User ({profiles.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Pesanan</CardTitle>
              <CardDescription>Liat dan atur semua pesanan customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
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
                        <TableCell>{new Date(booking.event_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select 
                            value={booking.status} 
                            onValueChange={(value) => updateBookingStatus(booking.id, value)}
                          >
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
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Photo Management</CardTitle>
                <CardDescription>Manage gallery photos and portfolio</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPhoto(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photo
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id}>
                    <CardContent className="p-4">
                      <img 
                        src={photo.image_url} 
                        alt={photo.title}
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                      <h3 className="font-medium">{photo.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{photo.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {photo.is_featured && <Badge variant="secondary">Featured</Badge>}
                        <Badge variant="outline">{photo.category}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPhoto(photo);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Stats Management</CardTitle>
              <CardDescription>Kelola statistik yang tampil di halaman utama</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminHeroManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <AdminAboutManager />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View all registered users and their profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.full_name || 'N/A'}</TableCell>
                      <TableCell>{profile.phone || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{profile.bio || 'N/A'}</TableCell>
                      <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((userRole) => (
                    <TableRow key={userRole.id}>
                      <TableCell className="font-mono text-sm">{userRole.user_id}</TableCell>
                      <TableCell>
                        <Badge variant={userRole.role === 'admin' ? 'default' : 'secondary'}>
                          {userRole.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(userRole.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select 
                          value={userRole.role} 
                          onValueChange={(value: 'admin' | 'user') => updateUserRole(userRole.user_id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <AdminAboutManager />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

// Photo Dialog Component
function PhotoDialog({ 
  photo, 
  onSave, 
  onClose 
}: { 
  photo: Photo | null; 
  onSave: (photo: any) => void; 
  onClose: () => void; 
}) {
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive"
      });
      return;
    }

    // Read file and open crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      
      // Create unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload cropped image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, croppedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setPreviewUrl(publicUrl);

      toast({
        title: "Berhasil!",
        description: "Foto berhasil dioptimasi dan diupload"
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal upload foto",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const photoData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      ...(photo && { id: photo.id })
    };
    onSave(photoData);
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{photo ? 'Edit Foto' : 'Tambah Foto Baru'}</DialogTitle>
        <DialogDescription>
          {photo ? 'Update detail foto' : 'Upload foto baru ke galeri'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-2">
          <Label>Upload Foto</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreviewUrl('');
                    setFormData(prev => ({ ...prev, image_url: '' }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <div className="text-sm text-muted-foreground mb-2">
                  Klik untuk upload atau drag & drop
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Mengupload...
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            atau masukkan URL gambar di bawah
          </p>
        </div>

        <div>
          <Label htmlFor="image_url">URL Gambar (opsional)</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, image_url: e.target.value }));
              setPreviewUrl(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="wedding, portrait, product"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="wedding, portrait, outdoor"
          />
        </div>

        <div>
          <Label htmlFor="sort_order">Urutan Tampil</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
            className="rounded border-border"
          />
          <Label htmlFor="is_featured">Foto Unggulan</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={!formData.image_url || uploading}>
            {photo ? 'Update' : 'Simpan'}
          </Button>
        </DialogFooter>
      </form>

      {/* Crop Dialog */}
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={originalImage}
        onCropComplete={handleCropComplete}
      />
    </DialogContent>
  );
}
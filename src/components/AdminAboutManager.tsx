import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Achievement {
  id?: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
}

interface Skill {
  id?: string;
  skill_name: string;
  percentage: number;
  sort_order: number;
}

interface Service {
  id?: string;
  title: string;
  description: string;
  specialties: string[];
  sort_order: number;
}

interface Content {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
}

export default function AdminAboutManager() {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [achievementDialog, setAchievementDialog] = useState<{ open: boolean; data: Achievement | null }>({ open: false, data: null });
  const [skillDialog, setSkillDialog] = useState<{ open: boolean; data: Skill | null }>({ open: false, data: null });
  const [serviceDialog, setServiceDialog] = useState<{ open: boolean; data: Service | null }>({ open: false, data: null });
  const [contentDialog, setContentDialog] = useState<{ open: boolean; data: Content | null }>({ open: false, data: null });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [achievementsRes, skillsRes, servicesRes, contentsRes] = await Promise.all([
        supabase.from('about_achievements').select('*').order('sort_order'),
        supabase.from('about_skills').select('*').order('sort_order'),
        supabase.from('about_services').select('*').order('sort_order'),
        supabase.from('about_content').select('*')
      ]);

      if (achievementsRes.data) setAchievements(achievementsRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (contentsRes.data) setContents(contentsRes.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast({
        title: "❌ Error",
        description: "Gagal memuat data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Achievement CRUD
  const saveAchievement = async (data: Achievement) => {
    try {
      if (data.id) {
        const { error } = await supabase.from('about_achievements').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('about_achievements').insert(data);
        if (error) throw error;
      }
      toast({ title: "✅ Success", description: "Achievement berhasil disimpan!" });
      fetchAllData();
      setAchievementDialog({ open: false, data: null });
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!confirm('Yakin mau hapus achievement ini?')) return;
    try {
      const { error } = await supabase.from('about_achievements').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "✅ Success", description: "Achievement berhasil dihapus!" });
      fetchAllData();
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  // Skill CRUD
  const saveSkill = async (data: Skill) => {
    try {
      if (data.id) {
        const { error } = await supabase.from('about_skills').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('about_skills').insert(data);
        if (error) throw error;
      }
      toast({ title: "✅ Success", description: "Skill berhasil disimpan!" });
      fetchAllData();
      setSkillDialog({ open: false, data: null });
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Yakin mau hapus skill ini?')) return;
    try {
      const { error } = await supabase.from('about_skills').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "✅ Success", description: "Skill berhasil dihapus!" });
      fetchAllData();
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  // Service CRUD
  const saveService = async (data: Service) => {
    try {
      if (data.id) {
        const { error } = await supabase.from('about_services').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('about_services').insert(data);
        if (error) throw error;
      }
      toast({ title: "✅ Success", description: "Service berhasil disimpan!" });
      fetchAllData();
      setServiceDialog({ open: false, data: null });
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Yakin mau hapus service ini?')) return;
    try {
      const { error } = await supabase.from('about_services').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "✅ Success", description: "Service berhasil dihapus!" });
      fetchAllData();
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  // Content CRUD
  const saveContent = async (data: Content) => {
    try {
      const { error } = await supabase
        .from('about_content')
        .update(data)
        .eq('section_key', data.section_key);
      if (error) throw error;
      toast({ title: "✅ Success", description: "Content berhasil disimpan!" });
      fetchAllData();
      setContentDialog({ open: false, data: null });
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Tabs defaultValue="achievements" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>

      {/* Achievements Tab */}
      <TabsContent value="achievements">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Manage pencapaian di halaman About</CardDescription>
            </div>
            <Button onClick={() => setAchievementDialog({ open: true, data: null })} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Achievement
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.icon_name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setAchievementDialog({ open: true, data: item })}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => item.id && deleteAchievement(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Skills Tab */}
      <TabsContent value="skills">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Manage keahlian di halaman About</CardDescription>
            </div>
            <Button onClick={() => setSkillDialog({ open: true, data: null })} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Skill
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Name</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.skill_name}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSkillDialog({ open: true, data: item })}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => item.id && deleteSkill(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Services Tab */}
      <TabsContent value="services">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>Manage layanan di halaman About</CardDescription>
            </div>
            <Button onClick={() => setServiceDialog({ open: true, data: null })} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Service
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setServiceDialog({ open: true, data: item })}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => item.id && deleteService(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Content Tab */}
      <TabsContent value="content">
        <div className="space-y-4">
          {contents.map((content) => (
            <Card key={content.section_key}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="capitalize">{content.section_key} Section</CardTitle>
                </div>
                <Button onClick={() => setContentDialog({ open: true, data: content })} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {content.title && <p><strong>Title:</strong> {content.title}</p>}
                  {content.subtitle && <p><strong>Subtitle:</strong> {content.subtitle}</p>}
                  {content.description && <p><strong>Description:</strong> {content.description}</p>}
                  {content.button_text && <p><strong>Button Text:</strong> {content.button_text}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Dialogs */}
      <AchievementDialog
        open={achievementDialog.open}
        data={achievementDialog.data}
        onClose={() => setAchievementDialog({ open: false, data: null })}
        onSave={saveAchievement}
      />
      <SkillDialog
        open={skillDialog.open}
        data={skillDialog.data}
        onClose={() => setSkillDialog({ open: false, data: null })}
        onSave={saveSkill}
      />
      <ServiceDialog
        open={serviceDialog.open}
        data={serviceDialog.data}
        onClose={() => setServiceDialog({ open: false, data: null })}
        onSave={saveService}
      />
      <ContentDialog
        open={contentDialog.open}
        data={contentDialog.data}
        onClose={() => setContentDialog({ open: false, data: null })}
        onSave={saveContent}
      />
    </Tabs>
  );
}

// Achievement Dialog
function AchievementDialog({ open, data, onClose, onSave }: {
  open: boolean;
  data: Achievement | null;
  onClose: () => void;
  onSave: (data: Achievement) => void;
}) {
  const [formData, setFormData] = useState<Achievement>({
    icon_name: data?.icon_name || 'Camera',
    value: data?.value || '',
    label: data?.label || '',
    sort_order: data?.sort_order || 0,
    ...(data?.id && { id: data.id })
  });

  useEffect(() => {
    if (data) {
      setFormData({
        icon_name: data.icon_name,
        value: data.value,
        label: data.label,
        sort_order: data.sort_order,
        ...(data.id && { id: data.id })
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data?.id ? 'Edit Achievement' : 'Tambah Achievement'}</DialogTitle>
          <DialogDescription>Icons: Award, Users, Camera, Clock, Star</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Icon Name</Label>
            <Input value={formData.icon_name} onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })} required />
          </div>
          <div>
            <Label>Value</Label>
            <Input value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
          </div>
          <div>
            <Label>Label</Label>
            <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} required />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Skill Dialog
function SkillDialog({ open, data, onClose, onSave }: {
  open: boolean;
  data: Skill | null;
  onClose: () => void;
  onSave: (data: Skill) => void;
}) {
  const [formData, setFormData] = useState<Skill>({
    skill_name: data?.skill_name || '',
    percentage: data?.percentage || 0,
    sort_order: data?.sort_order || 0,
    ...(data?.id && { id: data.id })
  });

  useEffect(() => {
    if (data) {
      setFormData({
        skill_name: data.skill_name,
        percentage: data.percentage,
        sort_order: data.sort_order,
        ...(data.id && { id: data.id })
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data?.id ? 'Edit Skill' : 'Tambah Skill'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Skill Name</Label>
            <Input value={formData.skill_name} onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })} required />
          </div>
          <div>
            <Label>Percentage (0-100)</Label>
            <Input type="number" min="0" max="100" value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })} required />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Service Dialog
function ServiceDialog({ open, data, onClose, onSave }: {
  open: boolean;
  data: Service | null;
  onClose: () => void;
  onSave: (data: Service) => void;
}) {
  const [formData, setFormData] = useState<Service>({
    title: data?.title || '',
    description: data?.description || '',
    specialties: data?.specialties || [],
    sort_order: data?.sort_order || 0,
    ...(data?.id && { id: data.id })
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        description: data.description,
        specialties: data.specialties,
        sort_order: data.sort_order,
        ...(data.id && { id: data.id })
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data?.id ? 'Edit Service' : 'Tambah Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div>
            <Label>Specialties (comma separated)</Label>
            <Input 
              value={formData.specialties.join(', ')} 
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split(',').map(s => s.trim()) })} 
              placeholder="Skill 1, Skill 2, Skill 3"
              required 
            />
          </div>
          <div>
            <Label>Sort Order</Label>
            <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Content Dialog
function ContentDialog({ open, data, onClose, onSave }: {
  open: boolean;
  data: Content | null;
  onClose: () => void;
  onSave: (data: Content) => void;
}) {
  const [formData, setFormData] = useState<Content>({
    section_key: data?.section_key || '',
    title: data?.title || '',
    subtitle: data?.subtitle || '',
    description: data?.description || '',
    button_text: data?.button_text || ''
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {data?.section_key} Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {data?.section_key !== 'cta' && (
            <>
              <div>
                <Label>Title</Label>
                <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
              </div>
            </>
          )}
          <div>
            <Label>Description</Label>
            <Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          {data?.section_key === 'cta' && (
            <div>
              <Label>Button Text</Label>
              <Input value={formData.button_text || ''} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

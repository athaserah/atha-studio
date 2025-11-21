import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/types/about';

interface ServiceDialogProps {
  open: boolean;
  data: Service | null;
  onClose: () => void;
  onSave: (data: Service) => void;
}

export function ServiceDialog({ open, data, onClose, onSave }: ServiceDialogProps) {
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

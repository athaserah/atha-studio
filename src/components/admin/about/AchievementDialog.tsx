import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Achievement } from '@/types/about';

interface AchievementDialogProps {
  open: boolean;
  data: Achievement | null;
  onClose: () => void;
  onSave: (data: Achievement) => void;
}

export function AchievementDialog({ open, data, onClose, onSave }: AchievementDialogProps) {
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

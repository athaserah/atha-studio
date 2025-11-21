import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skill } from '@/types/about';

interface SkillDialogProps {
  open: boolean;
  data: Skill | null;
  onClose: () => void;
  onSave: (data: Skill) => void;
}

export function SkillDialog({ open, data, onClose, onSave }: SkillDialogProps) {
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

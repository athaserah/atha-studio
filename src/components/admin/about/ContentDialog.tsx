import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Content } from '@/types/about';

interface ContentDialogProps {
  open: boolean;
  data: Content | null;
  onClose: () => void;
  onSave: (data: Content) => void;
}

export function ContentDialog({ open, data, onClose, onSave }: ContentDialogProps) {
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

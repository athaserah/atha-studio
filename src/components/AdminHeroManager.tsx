import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface HeroStat {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const AdminHeroManager = () => {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStatOpen, setEditingStatOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<HeroStat | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_stats')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      toast.error('Gagal memuat data stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStat = async (stat: Partial<HeroStat>) => {
    try {
      if (stat.id) {
        const { error } = await supabase
          .from('hero_stats')
          .update({
            icon_name: stat.icon_name,
            value: stat.value,
            label: stat.label,
            sort_order: stat.sort_order,
          })
          .eq('id', stat.id);

        if (error) throw error;
        toast.success('Stat berhasil diupdate');
      } else {
        const { error } = await supabase
          .from('hero_stats')
          .insert({
            icon_name: stat.icon_name,
            value: stat.value,
            label: stat.label,
            sort_order: stat.sort_order || 0,
          });

        if (error) throw error;
        toast.success('Stat berhasil ditambahkan');
      }
      
      fetchStats();
      setEditingStatOpen(false);
      setEditingStat(null);
    } catch (error) {
      console.error('Error saving stat:', error);
      toast.error('Gagal menyimpan stat');
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Yakin ingin menghapus stat ini?')) return;

    try {
      const { error } = await supabase
        .from('hero_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Stat berhasil dihapus');
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast.error('Gagal menghapus stat');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Hero Stats</h2>
        <Dialog open={editingStatOpen} onOpenChange={setEditingStatOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStat(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Stat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStat ? 'Edit Stat' : 'Tambah Stat Baru'}
              </DialogTitle>
            </DialogHeader>
            <StatForm
              stat={editingStat}
              onSave={handleSaveStat}
              onCancel={() => {
                setEditingStatOpen(false);
                setEditingStat(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.id}>
              <TableCell>{stat.icon_name}</TableCell>
              <TableCell>{stat.value}</TableCell>
              <TableCell>{stat.label}</TableCell>
              <TableCell>{stat.sort_order}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingStat(stat);
                      setEditingStatOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStat(stat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StatForm = ({
  stat,
  onSave,
  onCancel,
}: {
  stat: HeroStat | null;
  onSave: (stat: Partial<HeroStat>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    icon_name: stat?.icon_name || '',
    value: stat?.value || '',
    label: stat?.label || '',
    sort_order: stat?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stat ? { ...formData, id: stat.id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="icon_name">Nama Icon (Lucide)</Label>
        <Input
          id="icon_name"
          value={formData.icon_name}
          onChange={(e) =>
            setFormData({ ...formData, icon_name: e.target.value })
          }
          placeholder="Camera, Users, Award, Star, dll"
          required
        />
      </div>
      <div>
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          value={formData.value}
          onChange={(e) =>
            setFormData({ ...formData, value: e.target.value })
          }
          placeholder="500+, 4.9/5, dll"
          required
        />
      </div>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) =>
            setFormData({ ...formData, label: e.target.value })
          }
          placeholder="Foto Udah Diabadiin"
          required
        />
      </div>
      <div>
        <Label htmlFor="sort_order">Urutan</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) =>
            setFormData({ ...formData, sort_order: parseInt(e.target.value) })
          }
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
};

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DepartmentEntity } from '@/types';
import AnimatedPage from '@/components/AnimatedPage';
import { departmentService } from '@/services/api';
import { ApiRequestError } from '@/lib/apiClient';

export default function DepartmentManagement() {
  const queryClient = useQueryClient();
  const { data: depts = [], isPending } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.list,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentEntity | null>(null);
  const [form, setForm] = useState({ name: '', head: '', description: '' });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return departmentService.update(editing.id, {
          name: form.name.trim(),
          head: form.head.trim(),
          description: form.description.trim(),
        });
      }
      return departmentService.create({
        name: form.name.trim(),
        head: form.head.trim() || undefined,
        description: form.description.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast.success(editing ? 'Department updated' : 'Department added');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast.error(e instanceof ApiRequestError ? e.message : 'Save failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => departmentService.remove(id),
    onSuccess: () => {
      toast.success('Department removed');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (e: unknown) => {
      toast.error(e instanceof ApiRequestError ? e.message : 'Delete failed');
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', head: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (d: DepartmentEntity) => {
    setEditing(d);
    setForm({ name: d.name, head: d.head ?? '', description: d.description ?? '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    saveMutation.mutate();
  };

  return (
    <AnimatedPage><div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage hospital departments</p>
        </div>
        <Button className="rounded-xl gap-2 shrink-0 w-full sm:w-auto" size="sm" onClick={openNew}><Plus className="w-4 h-4 shrink-0" /> Add Department</Button>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading departments…</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {depts.map(d => (
          <Card key={d.id} className="rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-foreground break-words pr-1">{d.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl" onClick={() => openEdit(d)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl text-destructive" onClick={() => deleteMutation.mutate(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{d.description}</p>
              <div className="text-sm"><span className="text-muted-foreground">Head:</span> <span className="font-medium text-foreground">{d.head || '—'}</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Staff:</span> <span className="font-medium text-foreground">{d.staffCount}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl w-[calc(100vw-1.5rem)] sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Department</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Head</label><Input value={form.head} onChange={e => setForm(p => ({ ...p, head: e.target.value }))} className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Description</label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="rounded-xl" /></div>
            <Button className="w-full rounded-xl" onClick={handleSave} disabled={saveMutation.isPending}>{editing ? 'Update' : 'Add'} Department</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div></AnimatedPage>
  );
}

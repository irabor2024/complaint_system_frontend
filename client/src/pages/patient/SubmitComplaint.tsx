import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { departmentService, complaintService } from '@/services/api';
import type { ComplaintCategory } from '@/types';
import { toast } from 'sonner';
import { ApiRequestError } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const categories: { value: ComplaintCategory; label: string }[] = [
  { value: 'Hygiene', label: 'Hygiene' },
  { value: 'Billing', label: 'Billing' },
  { value: 'Staff Behavior', label: 'Staff Behavior' },
  { value: 'Service Delay', label: 'Service Delay' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Other', label: 'Other' },
];

export default function SubmitComplaint() {
  const { user, isHydrating } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: departments = [],
    isPending: departmentsLoading,
    isError: departmentsError,
    error: departmentsQueryError,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.list,
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '' as ComplaintCategory | '',
    departmentId: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  /** When true, user picks category and department; when false, AI assigns category, priority, and department */
  const [manualCategory, setManualCategory] = useState(false);

  const MAX_FILES = 5;
  const MAX_FILE_MB = 5;
  const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain';

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    setFiles(prev => {
      const next = [...prev];
      for (const f of incoming) {
        if (next.length >= MAX_FILES) break;
        if (f.size > MAX_FILE_MB * 1024 * 1024) {
          toast.error(`${f.name} is larger than ${MAX_FILE_MB} MB`);
          continue;
        }
        if (!ACCEPT.split(',').includes(f.type)) {
          toast.error(`${f.name}: type not allowed (images, PDF, or plain text)`);
          continue;
        }
        if (!next.some(x => x.name === f.name && x.size === f.size)) next.push(f);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isHydrating || !user) return;
    setForm(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone?.trim() ?? '',
    }));
  }, [isHydrating, user?.id, user?.name, user?.email, user?.phone]);

  const submitMutation = useMutation({
    mutationFn: () =>
      complaintService.submit({
        patientName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        automaticCategory: !manualCategory,
        ...(manualCategory ? { category: form.category as ComplaintCategory } : {}),
        ...(manualCategory && form.departmentId ? { departmentId: form.departmentId } : {}),
        description: form.description.trim(),
        files: files.length > 0 ? files : undefined,
      }),
    onSuccess: data => {
      setTicketId(data.ticketId);
      setShowSuccess(true);
      const contact = user
        ? { name: user.name, email: user.email, phone: user.phone?.trim() ?? '' }
        : { name: '', email: '', phone: '' };
      setForm({ ...contact, category: '', departmentId: '', description: '' });
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof ApiRequestError ? e.message : 'Could not submit complaint';
      toast.error(msg);
    },
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCategory && !form.category) {
      toast.error('Please select a category or enable automatic categorization');
      return;
    }
    if (manualCategory && !form.departmentId) {
      toast.error('Please select a department or use automatic routing');
      return;
    }
    submitMutation.mutate();
  };

  return (
    <AnimatedPage><div className="max-w-2xl mx-auto w-full min-w-0 space-y-4 sm:space-y-6 px-0">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Submit a Complaint</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {user
            ? 'Your account name, email, and phone are filled in below. You can change them for this complaint if needed.'
            : 'Fill out the form below to submit your complaint. You do not need an account.'}
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} className="rounded-xl" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="rounded-xl" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
              <Input value={form.phone} onChange={e => update('phone', e.target.value)} className="rounded-xl" />
            </div>
            <div className="rounded-xl border border-border bg-muted/30 px-3 py-3 space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="manual-category"
                  checked={manualCategory}
                  onCheckedChange={v => setManualCategory(v === true)}
                  className="mt-0.5"
                />
                <label htmlFor="manual-category" className="text-sm text-foreground leading-snug cursor-pointer">
                  I will choose category and department myself (otherwise the server analyzes your text to assign category, priority, and department before saving and notifying admins).
                </label>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Category {manualCategory ? '*' : '(automatic)'}
                </label>
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm disabled:opacity-60"
                  required={manualCategory}
                  disabled={!manualCategory}
                >
                  <option value="">{manualCategory ? 'Select category' : 'Assigned from your description'}</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Department {manualCategory ? '*' : '(automatic)'}
                </label>
                <select
                  value={form.departmentId}
                  onChange={e => update('departmentId', e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm disabled:opacity-60"
                  required={manualCategory}
                  disabled={!manualCategory || departmentsLoading || departmentsError}
                >
                  <option value="">
                    {departmentsLoading
                      ? 'Loading departments…'
                      : manualCategory
                        ? 'Select department'
                        : 'Matched from your description'}
                  </option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {departmentsError && (
                  <p className="text-sm text-destructive mt-2">
                    {departmentsQueryError instanceof ApiRequestError
                      ? departmentsQueryError.message
                      : 'Could not load departments. Check that the API is running and CORS settings match your app URL.'}{' '}
                    <button
                      type="button"
                      className="underline font-medium"
                      onClick={() => void refetchDepartments()}
                    >
                      Retry
                    </button>
                  </p>
                )}
                {!departmentsLoading && !departmentsError && departments.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No departments are set up yet. Run the database seed or ask an administrator to add departments.
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)}
                className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Attachments (optional, up to {MAX_FILES}, {MAX_FILE_MB} MB each)
              </label>
              <input
                type="file"
                id="complaint-files"
                className="sr-only"
                multiple
                accept={ACCEPT}
                onChange={e => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <label
                htmlFor="complaint-files"
                onDragOver={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-border rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-muted-foreground cursor-pointer block hover:bg-muted/40 transition-colors"
              >
                Drag & drop files here or click to browse. Allowed: JPG, PNG, GIF, WebP, PDF, TXT.
              </label>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${f.size}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                      <span className="truncate min-w-0">{f.name}</span>
                      <span className="text-muted-foreground shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
                      <button
                        type="button"
                        className="text-destructive text-xs font-medium shrink-0"
                        onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? 'Submitting…' : 'Submit Complaint'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-2xl text-center w-[calc(100vw-1.5rem)] sm:max-w-lg">
          <DialogHeader>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">Complaint Submitted!</DialogTitle>
            <DialogDescription>
              Your complaint has been submitted successfully. Your ticket ID is:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-xl p-4 text-2xl font-bold text-primary break-all">{ticketId}</div>
          <p className="text-sm text-muted-foreground">Save this ID to track your complaint status.</p>
          <p className="text-sm pt-1">
            <Link to="/track" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
              Track your complaint
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </div></AnimatedPage>
  );
}

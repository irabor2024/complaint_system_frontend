import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  const grid =
    count >= 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-3';
  return (
    <div className={`grid ${grid} gap-3 sm:gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[32rem]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} className="text-left p-3">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r} className="border-b border-border">
                  {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} className="p-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="rounded-2xl min-w-0">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <Skeleton className="h-5 w-40 sm:w-48" />
        <Skeleton className="h-[200px] sm:h-[260px] w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

export function ComplaintListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-0">
        <div className="p-3 sm:p-4 border-b border-border flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-3 sm:p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
              <Skeleton className="h-3 w-20 shrink-0 sm:ml-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

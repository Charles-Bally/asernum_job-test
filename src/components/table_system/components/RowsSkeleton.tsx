import { cn } from "@/lib/utils"

type RowsSkeletonProps = {
  columns: number
  rows?: number
  gridTemplateColumns: string
}

export function RowsSkeleton({ columns, rows = 5, gridTemplateColumns }: RowsSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid h-[48px] items-center border-b border-border-light px-[20px]"
          style={{ gridTemplateColumns }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="pr-[10px]">
              <div
                className={cn(
                  "h-[14px] animate-pulse rounded-[4px] bg-surface-muted",
                  colIdx === 0 ? "w-[60%]" : "w-[80%]"
                )}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

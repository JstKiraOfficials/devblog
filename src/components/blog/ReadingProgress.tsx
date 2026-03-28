interface ReadingProgressProps {
  progress: number
}

export const ReadingProgress = ({ progress }: ReadingProgressProps) => (
  <div
    role="progressbar"
    aria-valuenow={Math.round(progress)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Reading progress"
    className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-border"
  >
    <div
      className="h-full bg-primary transition-[width] duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
  </div>
)

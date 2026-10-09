import { Star } from "lucide-react";

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted">
      <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews.toLocaleString("es-CO")} reseñas)</span>}
      <span className="sr-only">Calificación de {value} de 5</span>
    </div>
  );
}

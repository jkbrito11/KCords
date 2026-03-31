import { Badge } from '../ui/badge'

export function FretboardLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="border-sky-400 bg-sky-500/20 text-sky-100">Escala</Badge>
      <Badge className="border-amber-400 bg-amber-500/20 text-amber-100">Acorde ativo</Badge>
      <Badge className="border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100">Digitacao do acorde</Badge>
      <Badge className="border-emerald-400 bg-emerald-500/20 text-emerald-100">Selecao manual</Badge>
    </div>
  )
}

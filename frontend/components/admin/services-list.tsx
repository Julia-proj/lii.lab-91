import { Pencil, Power, Star, Scissors } from 'lucide-react'
import { ServiceCardMobile, type ServiceData, fmt, resolveImg } from '@/components/admin/service-card-mobile'

const categories = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']

interface ServicesListProps {
  services: ServiceData[]
  onEdit: (s: ServiceData) => void
  onToggleActive: (id: string, currentActive: boolean) => void
  onTogglePopular: (id: string, currentPopular: boolean) => void
}

export type { ServiceData }

export function ServicesList({ services, onEdit, onToggleActive, onTogglePopular }: ServicesListProps) {
  const grouped = categories.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }))

  return (
    <>
      {grouped.map(({ category, items }) => {
        if (items.length === 0) return null
        return (
          <div key={category}>
            <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Scissors className="w-3.5 h-3.5" /> {category}
            </h2>

            <div className="sm:hidden space-y-2">
              {items.map((s) => (
                <ServiceCardMobile key={s._id} service={s} onEdit={onEdit} onToggleActive={onToggleActive} onTogglePopular={onTogglePopular} />
              ))}
            </div>

            <div className="hidden sm:block bg-white dark:bg-card rounded-xl border border-neutral-100 dark:border-white/8 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-100 dark:border-white/6">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-12">Foto</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs">Servicio</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-20">Precio</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Duracion</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Estado</th>
                    <th className="text-center px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-20">Popular</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                  {items.map((s) => (
                    <tr key={s._id} className={`hover:bg-neutral-50/60 dark:hover:bg-white/[0.03] transition-colors ${!s.active ? 'opacity-40' : ''}`}>
                      <td className="px-4 py-3">
                        {s.image && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden">
                            <img src={resolveImg(s.image)} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-200">{s.name}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.price}&euro;</td>
                      <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500">{fmt(s.duration)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-neutral-100 dark:bg-white/6 text-neutral-400 dark:text-neutral-500'
                        }`}>
                          {s.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => onTogglePopular(s._id, s.popular ?? false)} className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${s.popular ? 'text-plum bg-plum/10' : 'text-neutral-300 dark:text-neutral-600 hover:text-plum hover:bg-plum/10'}`}>
                          <Star className="w-4 h-4" fill={s.popular ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEdit(s)} className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onToggleActive(s._id, s.active)} className={`p-1.5 rounded transition-colors ${s.active ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </>
  )
}

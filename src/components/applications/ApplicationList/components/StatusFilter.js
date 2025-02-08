import { Badge } from "@/components/ui/badge"
import { getStatusStyle } from '../utils/statusStyles'


export function StatusFilter({ status, currentFilter, onChange, count }) {
  return (
    <button
      onClick={() => onChange(status)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2
        ${status === currentFilter ? 'ring-2 ring-offset-2' : 'opacity-75 hover:opacity-100'}
        ${status === 'All' 
          ? currentFilter === 'All'
            ? 'bg-gray-200 text-gray-800 ring-gray-400'
            : 'bg-gray-100 text-gray-600'
          : getStatusStyle(status, 'badge')}
      `}
    >
      {status}
      {status !== 'All' && count > 0 && (
        <Badge variant="secondary" className="ml-2">
          {count}
        </Badge>
      )}
    </button>
  )
}
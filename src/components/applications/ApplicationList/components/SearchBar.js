import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search applications..."
        className="pl-10 border-gray-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
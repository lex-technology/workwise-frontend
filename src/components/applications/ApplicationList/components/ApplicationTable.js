import { format } from "date-fns"
import { ArrowUpDown, ArrowRight, Calendar, LockIcon, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStatusStyle } from '../utils/statusStyles'
import { ApplicationDatePicker } from './ApplicationDatePicker'
import { PremiumOverlay } from './PremiumOverlay'
import { useApplicationLimit } from '../hooks/useApplicationLimit'
import { useRouter } from 'next/router'
// We extract the SortButton to keep the table component cleaner
const SortButton = ({ label, sortKey, onSort }) => (
  <Button
    variant="ghost"
    onClick={() => onSort(sortKey)}
    className="hover:bg-gray-100"
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
)

export function ApplicationTable({
  applications,
  totalFilteredCount,
  onStatusChange,
  onDateChange,
  onViewDetails,
  onSort,
  STATUS_OPTIONS,
  isPaidUser,
  maxFreeApplications,
  onPricingClick,
  onCreateClick,
  statusFilter
}) {
 // Helper function to render premium teaser rows
    // Helper function to render premium teaser rows
    const renderPremiumTeaser = () => (
        <>
          <TableRow className="bg-gray-50/50">
            <TableCell colSpan={5} className="py-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <LockIcon className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Upgrade to Premium to View More Applications
                </h3>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-50/50">
            <TableCell colSpan={5} className="py-4 text-center">
              <Button
                onClick={onPricingClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                View Pricing
              </Button>
            </TableCell>
          </TableRow>
        </>
      )
    
  
    if (applications.length === 0) {
        return (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {/* ... your existing headers ... */}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    {statusFilter === 'All' ? (
                      // Show create button only if there are no applications at all
                      <>
                        <p className="text-gray-500">No applications yet</p>
                        <Button
                          onClick={onCreateClick}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Your First Application
                        </Button>
                      </>
                    ) : (
                      // Show simple message for filtered results
                      <p className="text-gray-500">
                        No applications found for the selected filter
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      }

  return (
    <div className="relative">
        <Table>
        <TableHeader>
            <TableRow className="bg-gray-50">
            <TableHead className="w-[300px] py-4">
                <SortButton label="Company & Position" sortKey="company" onSort={onSort} />
            </TableHead>
            <TableHead className="py-4">
                <SortButton label="Status" sortKey="status" onSort={onSort} />
            </TableHead>
            <TableHead className="py-4">
                <SortButton label="Date Applied" sortKey="date" onSort={onSort} />
            </TableHead>
            <TableHead className="py-4">
                <SortButton label="Created" sortKey="created_at" onSort={onSort} />
            </TableHead>
            <TableHead className="w-[120px] text-right pr-6 py-4">Actions</TableHead>
            </TableRow>
        </TableHeader>
        
        <TableBody>
            {/* {applications.map((app, index) => ( */}
            {applications.slice(0, isPaidUser ? applications.length : maxFreeApplications)
                .map((app, index) => (
                    <TableRow key={app.id} className="hover:bg-gray-50">
                {/* Company and Position */}
                <TableCell className="py-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{app.company}</span>
                    <span className="text-sm text-gray-500">{app.position}</span>
                </div>
                </TableCell>

                {/* Status Select */}
                <TableCell className="py-4">
                <Select
                    value={app.status}
                    onValueChange={(newStatus) => onStatusChange(newStatus, app.id)}
                >
                    <SelectTrigger className={`w-[140px] ${getStatusStyle(app.status, 'select')}`}>
                    <SelectValue>{app.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                    {STATUS_OPTIONS.filter(status => status !== 'All').map((status) => (
                        <SelectItem 
                        key={status} 
                        value={status}
                        className={getStatusStyle(status, 'select')}
                        >
                        {status}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </TableCell>

                {/* Application Date */}
                <TableCell className="py-4">
                <ApplicationDatePicker
                    date={app.date}
                    onDateChange={(date) => onDateChange(date, app.id)} // Pass the handler directly
                    status={app.status}
                    appId={app.id}  // Make sure to pass the appId
                />
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-gray-500 py-4">
                {app.created_at ? (
                    <span className="text-gray-600">
                    {format(new Date(app.created_at), 'dd/MM/yyyy')}
                    </span>
                ) : (
                    <span className="text-gray-400 italic">
                    Not yet created
                    </span>
                )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-6 py-4">
                <Button
                    variant="ghost"
                    onClick={() => onViewDetails(app.id)}
                    className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </TableCell>
            </TableRow>
            ))}

            {/* Premium teaser rows only if we have more than maxFreeApplications */}
            {!isPaidUser && totalFilteredCount > maxFreeApplications && renderPremiumTeaser()}
        </TableBody>
        </Table>
    </div>
  )
}
import { format } from "date-fns"
import { ArrowUpDown, ArrowRight, Calendar, LockIcon, PlusCircle, Building, User, Clock } from 'lucide-react'
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

// Mobile Card Component
const ApplicationCard = ({ 
  app, 
  onStatusChange, 
  onDateChange, 
  onViewDetails, 
  STATUS_OPTIONS 
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow">
    {/* Header: Company & Position */}
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <Building className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 text-base">{app.company}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600">{app.position}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetails(app.id)}
        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-2"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>

    {/* Status and Date Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Status */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
        <Select
          value={app.status}
          onValueChange={(newStatus) => onStatusChange(newStatus, app.id)}
        >
          <SelectTrigger className={`w-full ${getStatusStyle(app.status, 'select')}`}>
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
      </div>

      {/* Application Date */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Applied Date</label>
        <ApplicationDatePicker
          date={app.date}
          onDateChange={(date) => onDateChange(date, app.id)}
          status={app.status}
          appId={app.id}
        />
      </div>
    </div>

    {/* Created Date */}
    <div className="pt-2 border-t border-gray-100 space-y-3">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>Created:</span>
        {app.created_at ? (
          <span className="text-gray-600">
            {format(new Date(app.created_at), 'dd/MM/yyyy')}
          </span>
        ) : (
          <span className="text-gray-400 italic">Not yet created</span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(app.id)}
        className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50"
      >
        View Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
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
          <div className="relative">
            {/* Desktop Empty State */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[300px] py-4">Company & Position</TableHead>
                    <TableHead className="py-4">Status</TableHead>
                    <TableHead className="py-4">Date Applied</TableHead>
                    <TableHead className="py-4">Created</TableHead>
                    <TableHead className="w-[120px] text-right pr-6 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        {statusFilter === 'All' ? (
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
                          <p className="text-gray-500">
                            No applications found for the selected filter
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Empty State */}
            <div className="lg:hidden">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  {statusFilter === 'All' ? (
                    <>
                      <div className="bg-gray-100 rounded-full p-4 mb-2">
                        <PlusCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Start tracking your job applications
                      </p>
                      <Button
                        onClick={onCreateClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Application
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-100 rounded-full p-4 mb-2">
                        <ArrowRight className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                      <p className="text-gray-500 text-sm">
                        No applications found for the selected filter
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

  const displayedApplications = applications.slice(0, isPaidUser ? applications.length : maxFreeApplications);

  return (
    <div className="relative">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
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
            {displayedApplications.map((app, index) => (
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
                    onDateChange={(date) => onDateChange(date, app.id)}
                    status={app.status}
                    appId={app.id}
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

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden">
        {/* Mobile Sort Controls */}
        <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sort by:</h4>
          <div className="flex flex-wrap gap-2">
            <SortButton label="Company" sortKey="company" onSort={onSort} />
            <SortButton label="Status" sortKey="status" onSort={onSort} />
            <SortButton label="Date" sortKey="date" onSort={onSort} />
            <SortButton label="Created" sortKey="created_at" onSort={onSort} />
          </div>
        </div>

        {/* Application Cards */}
        <div className="space-y-4">
          {displayedApplications.map((app, index) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onStatusChange={onStatusChange}
              onDateChange={onDateChange}
              onViewDetails={onViewDetails}
              STATUS_OPTIONS={STATUS_OPTIONS}
            />
          ))}

          {/* Premium teaser card for mobile */}
          {!isPaidUser && totalFilteredCount > maxFreeApplications && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <LockIcon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                View more applications and unlock advanced features
              </p>
              <Button
                onClick={onPricingClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                View Pricing
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
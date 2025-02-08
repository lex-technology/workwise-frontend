import React, { useCallback, useState, useEffect, useRef } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import DatePicker from "react-datepicker"
import { cn } from "@/lib/utils"
import "react-datepicker/dist/react-datepicker.css"

export function ApplicationDatePicker({ date, onDateChange, status }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : null)

  // Handle internal date changes before propagating up
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate)
    setIsOpen(false)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }, [onDateChange])

  // Synchronize with external date changes
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date))
    }
  }, [date])

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <Button
      variant="outline"
      className={cn(
        "w-[140px] justify-start text-left font-normal",
        !value && "text-muted-foreground"
      )}
      onClick={() => {
        // Only try to open if we're in Applied status
        if (status === 'Applied') {
          setIsOpen(true)
          onClick?.()
        }
      }}
      ref={ref}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value || "Set date applied"}
    </Button>
  ))

  CustomInput.displayName = 'CustomInput'

  if (status === 'Applied') {
    return (
      <div ref={containerRef} className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          customInput={<CustomInput />}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          wrapperClassName="w-full"
          calendarClassName="shadow-lg border border-gray-200 rounded-md bg-white"
          popperClassName="z-[100]"
          popperPlacement="bottom-start"
          popperContainer={({ children }) => (
            <div className="absolute z-[100] min-w-[220px]">
              {children}
            </div>
          )}
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                boundary: 'viewport',
                padding: 8
              }
            },
            {
              name: "offset",
              options: {
                offset: [0, 8]
              }
            }
          ]}
        />
      </div>
    )
  }

  return date ? (
    <span className="text-gray-600">
      {format(new Date(date), 'dd/MM/yyyy')}
    </span>
  ) : (
    <span className="text-gray-400 italic">
      Not yet applied
    </span>
  )
}
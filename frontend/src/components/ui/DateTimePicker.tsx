"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "./calendar"

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date>()
  const [hour, setHour] = React.useState<string>()
  const [minute, setMinute] = React.useState<string>()
  const [meridiem, setMeridiem] = React.useState<'AM' | 'PM'>('AM')

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const formatTime = () => {
    if (hour && minute && date) {
      const d=new Date(date)
      d.setHours(meridiem === 'PM' ? parseInt(hour) + 12 : parseInt(hour))
      d.setMinutes(parseInt(minute)) 
      return d.toLocaleString()
    }
    return ''
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {/* {date ? format(date, "PPP") : <span>Pick a date </span>} */}
            {formatTime() ? formatTime() : <span>Pick a date </span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
          <div className="flex justify-between p-3">
            <Select onValueChange={setHour}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="H" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setMinute}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="M" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="AM" onValueChange={(value) => setMeridiem(value as 'AM' | 'PM')}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="AM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </ Popover>
    </>
  )
}
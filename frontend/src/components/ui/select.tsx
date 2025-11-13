import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none text-gray-500 dark:text-gray-400" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }

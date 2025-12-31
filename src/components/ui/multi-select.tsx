import * as React from "react"
import { X, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
    CommandEmpty,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Framework = Record<"value" | "label", string>

interface MultiSelectProps {
    options: Framework[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
}

export function MultiSelect({ options = [], selected = [], onChange, placeholder = "Select items...", className }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (val: string) => {
        onChange(selected.filter((s) => s !== val))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex min-h-[44px] w-full flex-wrap gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    onClick={() => setOpen(!open)}
                >
                    {selected.length > 0 ? (
                        selected.map((val) => {
                            const option = options.find((o) => o.value === val);
                            const label = option ? option.label : val;
                            return (
                                <Badge key={val} variant="secondary" className="mr-1 mb-1">
                                    {label}
                                    <button
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(val)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnselect(val)
                                        }}
                                        type="button"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            )
                        })
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((framework) => {
                                const isSelected = selected.includes(framework.value)
                                return (
                                    <CommandItem
                                        key={framework.value}
                                        value={framework.label} // Filtering by label usually better UX
                                        onSelect={() => {
                                            if (isSelected) {
                                                handleUnselect(framework.value)
                                            } else {
                                                onChange([...selected, framework.value])
                                            }
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {framework.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FilterWidgetProps {
    label: string;
    currentValue: string;
    onApply: (value: string) => void;
    inputType?: 'text' | 'boolean';
}

export const FilterWidget: React.FC<FilterWidgetProps> = ({ label, currentValue, onApply, inputType = 'text' }) => {
    const [value, setValue] = React.useState(currentValue);

    React.useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    return (
        <div className="space-y-4">
            {inputType === 'boolean' ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="status-mode">
                            {value === 'true' ? 'Active' : (value === 'false' ? 'Inactive' : 'All')}
                        </Label>
                        <Switch
                            id="status-mode"
                            checked={value === 'true'}
                            onCheckedChange={(checked) => {
                                const newVal = checked ? 'true' : 'false';
                                setValue(newVal);
                                onApply(newVal);
                            }}
                            className={
                                value === 'true'
                                    ? 'data-[state=checked]:bg-green-600'
                                    : (value === 'false' ? 'data-[state=unchecked]:bg-red-600' : '')
                            }
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8"
                        onClick={() => {
                            setValue('');
                            onApply('');
                        }}
                    >
                        Clear
                    </Button>
                </div>
            ) : (
                <>
                    <Input
                        placeholder={`Filter ${label}...`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onApply(value);
                            }
                        }}
                        className="h-8 mb-2"
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => onApply(value)}
                        >
                            Filter
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => {
                                setValue('');
                                onApply('');
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

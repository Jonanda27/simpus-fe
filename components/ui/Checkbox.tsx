import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    return (
      <div className="items-top flex space-x-3">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="grid gap-1.5 leading-none">
          <label className="text-sm font-medium text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

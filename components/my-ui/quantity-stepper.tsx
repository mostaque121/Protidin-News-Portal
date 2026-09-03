"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { NumberInput, NumberInputProps } from "./number-input";

export interface QuantityStepperProps extends Omit<
  NumberInputProps,
  "onChange" | "value"
> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const QuantityStepper = React.forwardRef<
  HTMLInputElement,
  QuantityStepperProps
>(
  (
    {
      value: controlledValue,
      defaultValue = 1,
      onChange,
      min = 1,
      max = 99999,
      step = 1,
      disabled = false,
      className,
      onBlur,
      ...props
    },
    ref,
  ) => {
    // Internal state fallback if `value` prop isn't passed
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;

    const updateValue = (newValue: number) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleDecrement = (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled || currentValue <= min) return;
      const newValue = Math.max(min, currentValue - step);
      updateValue(newValue);
    };

    const handleIncrement = (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled || currentValue >= max) return;
      const newValue = Math.min(max, currentValue + step);
      updateValue(newValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let clamped = currentValue;
      if (currentValue < min) clamped = min;
      if (currentValue > max) clamped = max;

      if (clamped !== currentValue) {
        updateValue(clamped);
      }

      onBlur?.(e);
    };

    return (
      <div
        className={cn(
          "flex items-center justify-between w-27.5! h-9 rounded-none border border-input bg-transparent p-1  transition-colors  focus-within:ring-1 focus-within:ring-navy",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || currentValue <= min}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleDecrement}
          className="h-7 w-7 shrink-0 rounded-xs text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer"
        >
          <Minus className="h-3.5 w-3.5" />
          <span className="sr-only">Decrease value</span>
        </Button>

        <NumberInput
          ref={ref}
          value={currentValue}
          onChange={updateValue}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={5}
          className="w-full h-7 border-none bg-transparent px-0 text-center text-sm font-bold text-foreground shadow-none focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground selection:bg-primary/20"
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || currentValue >= max}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleIncrement}
          className="h-7 w-7 shrink-0 rounded-xs text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only">Increase value</span>
        </Button>
      </div>
    );
  },
);

QuantityStepper.displayName = "QuantityStepper";

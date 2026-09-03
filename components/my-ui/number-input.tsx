"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> {
  value?: number;
  onChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>(
      value !== undefined ? String(value) : "",
    );

    // Keep internal string in sync when external numeric value changes
    React.useEffect(() => {
      if (value !== undefined) {
        const currentNumeric = inputValue === "" ? NaN : Number(inputValue);
        if (currentNumeric !== value) {
          setInputValue(String(value));
        }
      } else {
        setInputValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value;

      // Allow empty inputs, integers, and floating decimals
      if (newInputValue !== "" && !/^[0-9]*\.?[0-9]*$/.test(newInputValue)) {
        return;
      }

      setInputValue(newInputValue);

      if (newInputValue === "" || newInputValue === ".") {
        onChange?.(0);
        return;
      }

      const numericValue = Number.parseFloat(newInputValue);
      if (!isNaN(numericValue)) {
        onChange?.(numericValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clean up trailing decimal point on blur
      if (inputValue.endsWith(".")) {
        const cleaned = inputValue.slice(0, -1);
        setInputValue(cleaned);
      }

      if (value !== undefined) {
        setInputValue(String(value));
      }

      props.onBlur?.(e);
    };

    return (
      <Input
        type="text"
        inputMode="decimal"
        ref={ref}
        className={cn(className)}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };

"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useRef } from "react";

type InputOTPProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: {
    active: boolean;
    message: string;
  };
  className?: string;
};

function InputOTP({
  length = 4,
  value,
  onChange,
  disabled,
  error,
  className,
}: InputOTPProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputsRef.current[clamped]?.focus();
    },
    [length],
  );

  const handleChange = (index: number, char: string) => {
    if (disabled) return;

    if (!/^\d?$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    const newValue = newDigits.join("").replace(/\s/g, "");
    onChange(newValue);

    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        handleChange(index, "");
      } else if (index > 0) {
        handleChange(index - 1, "");
        focusInput(index - 1);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      focusInput(Math.min(pasted.length, length - 1));
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex gap-[18px]">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "size-[56px] shrink-0 rounded-[15px] border bg-white text-center text-[20px] font-bold text-foreground outline-none transition-all",
              digit
                ? "border-border-otp"
                : "border-[0.5px] border-border-otp",
              "focus:border-3 focus:border-auchan-red-accent",
              disabled && "cursor-not-allowed bg-neutral-100",
              error?.active && "border-auchan-red",
            )}
          />
        ))}
      </div>
      {error?.active && (
        <p className="mt-2 text-sm text-auchan-red">{error.message}</p>
      )}
    </div>
  );
}

export default InputOTP;

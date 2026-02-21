"use client";

import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputTextProps<T = string> = {
  name?: string;
  registration?: UseFormRegisterReturn;
  topLabel?: {
    text: string;
    required?: boolean;
    className?: string;
  };
  icon?: {
    render: React.ReactNode;
    position: "left" | "right";
    className?: string;
  };
  disabled?: boolean;
  error?: {
    active: boolean;
    message: string;
  };
  config?: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    defaultValue?: T;
    currentValue?: T;
    onChange?: (value: T) => void;
    placeholder?: string;
    type?: string;
    suffix?: React.ReactNode;
    inputClassName?: string;
    directInputClassName?: string;
  };
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ariaDescribedBy?: string;
};

function InputText<T = string>(props: InputTextProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { registration, config = {} } = props;
  const fieldName = registration?.name ?? props.name ?? "";

  const handleRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    registration?.ref(el);
  };

  const handleClickOnContainer = () => {
    if (props.disabled) return;
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleClickOnContainer}
      className={cn(
        "flex w-full flex-col gap-1",
        props.disabled && "cursor-not-allowed",
        props.className,
      )}
    >
      {props.topLabel && (
        <label
          htmlFor={fieldName}
          className={cn(
            "text-[16px] font-medium text-foreground",
            props.topLabel.className,
          )}
        >
          {props.topLabel.text}
          {props.topLabel.required && (
            <span className="text-auchan-red"> *</span>
          )}
        </label>
      )}
      <div
        className={cn(
          "flex h-[56px] w-full items-center rounded-[12px] border border-border-input bg-white px-4 transition-all duration-200 focus-within:border-auchan-red",
          props.disabled && "cursor-not-allowed bg-neutral-100",
          props.error?.active && "border-auchan-red",
          config.inputClassName,
        )}
      >
        {props.icon && props.icon.position === "left" && (
          <div
            className={cn(
              "mr-2 flex items-center text-text-muted",
              props.icon.className,
            )}
          >
            {props.icon.render}
          </div>
        )}
        <input
          ref={handleRef}
          name={fieldName}
          id={fieldName}
          type={config.type ?? "text"}
          className={cn(
            "w-full border-0 bg-transparent p-0 text-[16px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-text-muted",
            props.disabled && "cursor-not-allowed",
            config.directInputClassName,
          )}
          maxLength={config.maxLength}
          minLength={config.minLength}
          pattern={config.pattern}
          {...(registration
            ? {
                onChange: registration.onChange,
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                  registration.onBlur(e);
                  props.onBlur?.(e);
                },
              }
            : {
                defaultValue: config.defaultValue as string | undefined,
                value: (config.currentValue as string) ?? "",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  config.onChange?.(e.target.value as T),
                onBlur: props.onBlur,
              })}
          onFocus={props.onFocus}
          placeholder={config.placeholder}
          disabled={props.disabled}
          aria-describedby={props.ariaDescribedBy}
        />
        {props.icon && props.icon.position === "right" && (
          <div
            className={cn(
              "ml-2 flex items-center text-text-muted",
              props.icon.className,
            )}
          >
            {props.icon.render}
          </div>
        )}
        {config.suffix && (
          <div className="ml-2 flex items-center">{config.suffix}</div>
        )}
      </div>
      {props.error?.active && (
        <p className="mt-1 text-sm text-auchan-red">{props.error.message}</p>
      )}
    </div>
  );
}

export default InputText;

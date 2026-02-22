"use client";

import { cn } from "@/lib/utils";
import type { PasswordValidType } from "@/types/props/password-valid.type";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const CRITERIA_LABELS: Record<keyof PasswordValidType, string> = {
  length: "8 caractères min.",
  uppercase: "1 majuscule",
  lowercase: "1 minuscule",
  number_special: "1 chiffre et 1 spécial",
};

type InputPasswordProps = {
  name?: string;
  registration?: UseFormRegisterReturn;
  topLabel?: {
    text: string;
    required?: boolean;
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
    currentValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    showStrengthIndicator?: boolean;
    showValidationCriteria?: boolean;
  };
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onVisibilityChange?: (visible: boolean) => void;
};

function InputPassword(props: InputPasswordProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isVisible;
    setIsVisible(next);
    props.onVisibilityChange?.(next);
  };

  const password = config.currentValue ?? "";

  const passwordValid: PasswordValidType = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number_special:
      /[0-9]/.test(password) && /[!@#$%^&*\-_:;.,?/]/.test(password),
  };
  const isValidPassword = Object.values(passwordValid).every(Boolean);

  const getPasswordStrength = () => {
    let strength = 0;
    if (passwordValid.length) strength++;
    if (passwordValid.uppercase) strength++;
    if (passwordValid.lowercase) strength++;
    if (passwordValid.number_special) strength += 2;
    return strength;
  };

  const strength =
    config.showStrengthIndicator && password ? getPasswordStrength() : 0;

  const strengthColor =
    strength <= 1
      ? "bg-auchan-red"
      : strength <= 3
        ? "bg-yellow-500"
        : "bg-green-500";
  const strengthWidth = `${(strength / 5) * 100}%`;

  const showCriteria =
    config.showValidationCriteria && password && !isValidPassword;

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
        )}
      >
        <input
          ref={handleRef}
          name={fieldName}
          id={fieldName}
          type={isVisible ? "text" : "password"}
          className={cn(
            "w-full border-0 bg-transparent p-0 text-[16px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-text-muted",
            props.disabled && "cursor-not-allowed",
          )}
          maxLength={config.maxLength}
          minLength={config.minLength}
          {...(registration
            ? {
                onChange: registration.onChange,
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                  registration.onBlur(e);
                  props.onBlur?.(e);
                },
              }
            : {
                value: config.currentValue,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  config.onChange?.(e.target.value),
                onBlur: props.onBlur,
              })}
          onFocus={props.onFocus}
          placeholder={config.placeholder}
          disabled={props.disabled}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="ml-2 flex cursor-pointer items-center text-text-muted transition-colors hover:text-foreground focus:outline-none"
          disabled={props.disabled}
        >
          {isVisible ? (
            <EyeOffIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </button>
      </div>
      {config.showStrengthIndicator && password && (
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-neutral-200">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                strengthColor,
              )}
              style={{ width: strengthWidth }}
            />
          </div>
          <span className="text-xs text-text-muted">
            {strength <= 1 ? "Faible" : strength <= 3 ? "Moyen" : "Fort"}
          </span>
        </div>
      )}
      {showCriteria && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-3">
          {Object.entries(passwordValid).map(([key, value]) => (
            <div key={key} className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  value ? "bg-green-500" : "bg-auchan-red",
                )}
              />
              <p
                className={cn(
                  "text-xs",
                  value ? "text-text-muted" : "text-auchan-red",
                )}
              >
                {CRITERIA_LABELS[key as keyof PasswordValidType]}
              </p>
            </div>
          ))}
        </div>
      )}
      {props.error?.active && (
        <p className="mt-1 text-sm text-auchan-red">{props.error.message}</p>
      )}
    </div>
  );
}

export default InputPassword;

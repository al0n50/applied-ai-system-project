"use client";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import type { LucideIcon } from "lucide-react";

type ToggleOption<T extends string> = {
  value: T;
  icon?: LucideIcon;
  label?: string;
};

type Props<T extends string> = {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <ButtonGroup>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.value}
            variant={value === option.value ? "primary" : "outline"}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {Icon && <Icon />}
            {option.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

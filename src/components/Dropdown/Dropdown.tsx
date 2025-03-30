"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import "./Dropdown.scss";
import { DropdownProps } from "@/types/Dropdown.types";

const Dropdown: React.FC<Readonly<DropdownProps>> = ({
  label,
  placeholder,
  options,
  onChange,
  initialValue,
}) => {
  const [selected, setSelected] = useState<string | null>(initialValue ?? null);

  const handleSelect = (value: string): void => {
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="dropdown-input-wrapper">
      {label && (
        <p className="dropdown-input-wrapper__label font-medium">{label}</p>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="dropdown-input__trigger">
          <span className="dropdown-input__placeholder font-medium">
            {selected
              ? options.find((opt) => opt.value === selected)?.label
              : placeholder}
          </span>
          <ChevronDownIcon className="dropdown-input__icon" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="dropdown-input__content"
          align="start"
          sideOffset={0}
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="dropdown-input__item"
              onSelect={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dropdown;

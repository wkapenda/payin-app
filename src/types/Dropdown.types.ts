export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  initialValue?: string;
}

import { MAIN_COLOR } from "@/constants/colors";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  isBorderBlack?: boolean;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
  isBorderBlack = true,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label style={{color: isBorderBlack?'black':'white'}} className="text-sm text-black">{label}</label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{borderColor:isBorderBlack?`black`:`${MAIN_COLOR}`,color: isBorderBlack?'black':'white'}}
          className="
            w-full
            border
            rounded-xl
            px-4 py-3
            text-sm
            text-black
            borderColor: black
            placeholder-gray-500
            focus:outline-none
            focus:ring-0
            bg-transparent
            transition
          "
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

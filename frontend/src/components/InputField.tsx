import React from "react";

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputField: React.FC<InputFieldProps> = ({ className = "", ...rest }) => (
  <input
    {...rest}
    className={`w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all text-slate-700 font-bold text-lg placeholder:font-medium placeholder:text-slate-400 ${className}`}
  />
);

export default InputField;

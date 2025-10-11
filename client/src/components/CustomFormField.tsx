"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

interface CustomFormFieldProps {
  name: string;
  label?: string;
  type?: "text" | "number" | "textarea" | "switch" | "select" | "file";
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  inputClassName?: string;
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  label,
  type = "text",
  options = [],
  accept,
  className,
  inputClassName,
}) => {
  const form = useFormContext();

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => {
          switch (type) {
            case "textarea":
              return (
                <div>
                  {label && <label className="block text-sm font-medium">{label}</label>}
                  <Textarea {...field} className={inputClassName} />
                  {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
              );

            case "number":
            case "text":
              return (
                <div>
                  {label && <label className="block text-sm font-medium">{label}</label>}
                  <Input type={type} {...field} value={field.value ?? ""} className={inputClassName} />
                  {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
              );

            case "switch":
              return (
                <div className="flex items-center justify-between">
                  {label && <label className="text-sm font-medium">{label}</label>}
                  <Switch checked={field.value} onCheckedChange={field.onChange} className={inputClassName} />
                  {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
              );

            case "select":
              return (
                <div>
                  {label && <label className="block text-sm font-medium">{label}</label>}
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
              );

            case "file":
              return (
                <div>
                  {label && <label className="block text-sm font-medium">{label}</label>}
                  <FilePond
                    allowMultiple
                    acceptedFileTypes={accept ? [accept] : ["image/*"]}
                    className={inputClassName}
                    onupdatefiles={(fileItems) => field.onChange(fileItems.map((fileItem) => fileItem.file))}
                    labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
                    credits={false}
                    name={name}
                  />
                  {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
              );

            default:
              return <></>;
          }
        }}
      />
    </div>
  );
};

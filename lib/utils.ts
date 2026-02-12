import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapZodErrors(errors: z.ZodError) {
  const fieldErrors: { [key: string]: string[] } = {};
  errors.issues.forEach((error) => {
    if (error.path.length > 0) {
      const key = error.path[0].toString();
      if (!fieldErrors[key]) {
        fieldErrors[key] = [];
      }
      fieldErrors[key]?.push(error.message);
    }
  });
  return fieldErrors;
}

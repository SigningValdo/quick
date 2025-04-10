// import type React from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { cva, type VariantProps } from "class-variance-authority";

// const ctaButtonVariants = cva(
//   "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-gofundme-600 text-white hover:bg-gofundme-700 rounded-full",
//         outline:
//           "border border-gofundme-600 text-gofundme-600 hover:bg-gofundme-50 rounded-full",
//         ghost:
//           "text-gofundme-600 hover:bg-gofundme-50 hover:text-gofundme-700 rounded-full",
//         link: "text-gofundme-600 underline-offset-4 hover:underline",
//         secondary:
//           "bg-warmgray-50 text-gray-900 hover:bg-warmgray-100 rounded-full",
//       },
//       size: {
//         default: "h-10 px-6 py-2",
//         sm: "h-8 px-4 text-sm",
//         lg: "h-12 px-8 text-lg",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// export interface CTAButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof ctaButtonVariants> {
//   asChild?: boolean;
// }

// export function CTAButton({
//   className,
//   variant,
//   size,
//   ...props
// }: CTAButtonProps) {
//   return (
//     <Button
//       className={cn(ctaButtonVariants({ variant, size }), className)}
//       {...props}
//     />
//   );
// }

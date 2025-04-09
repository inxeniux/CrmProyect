// src/app/(auth)/register2/page.tsx
// TODO: Esta era una propuesta de cambio en el registro que quedó pendiente (omitir)
import StepForm from "@/components/auth/register/StepForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="/images/hero.png"
          alt="Register Illustration"
          layout="fill"
          objectFit="cover"
          className="rounded-r-xl"
        />
      </div>
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <StepForm />
      </div>
    </div>
  );
}
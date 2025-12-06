import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] to-[#1E1E1E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-small.png"
                alt="PersistQ Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00E0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              PersistQ
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Get started with PersistQ today</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            routing="hash"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: '#00e0ff',
                colorBackground: '#181818',
                colorInputBackground: '#2a2a2a',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: '#a1a1aa',
              },
              elements: {
                rootBox: "w-full",
                card: "bg-[#181818] border border-[#2a2a2a] shadow-xl",
                headerTitle: "text-white font-semibold",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#1e1e1e] text-white",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-gradient-to-r from-[#00E0FF] to-[#8B5CF6] hover:opacity-90 text-white font-medium",
                footerActionLink: "text-[#00E0FF] hover:text-[#00c8e6]",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-[#00E0FF]",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-500",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                dividerLine: "bg-[#2a2a2a]",
                dividerText: "text-gray-400",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                footer: "bg-[#181818] border-t border-[#2a2a2a]",
                footerActionText: "text-gray-400",
                otpCodeFieldInput: "bg-[#2a2a2a] border-[#3a3a3a] text-white",
              },
            }}
            redirectUrl="/dashboard"
            signInUrl="/login"
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00E0FF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

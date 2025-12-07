import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { SharedHeader } from "@/components/shared-header"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1E1E1E]">
      <SharedHeader />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
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
              rootBox: "w-full max-w-md",
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
              footerActionText: "text-gray-400",
              otpCodeFieldInput: "bg-[#2a2a2a] border-[#3a3a3a] text-white",
              // Hide "Secured by Clerk" badge using the footer element
              footer: "hidden",
            },
          }}
          redirectUrl="/dashboard"
          signInUrl="/login"
        />
      </div>
    </div>
  )
}

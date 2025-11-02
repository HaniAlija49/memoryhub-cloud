import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Database } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] to-[#1E1E1E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E0FF] to-[#8B5CF6] flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00E0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              Memory Layer
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Get started with Memory Layer today</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#181818] border border-white/10 shadow-xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "border-white/10 hover:bg-white/5",
                formButtonPrimary: "bg-gradient-to-r from-[#00E0FF] to-[#8B5CF6] hover:opacity-90",
                footerActionLink: "text-[#00E0FF] hover:text-[#00E0FF]/80",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-[#00E0FF]",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-[#0D0D0D] border-white/10 text-white",
                dividerLine: "bg-white/10",
                dividerText: "text-gray-400",
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

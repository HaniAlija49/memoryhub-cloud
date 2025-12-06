"use client"

import { UserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function SettingsPage() {
  return (
    <div className="-m-6 lg:-m-8">
      <UserProfile
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#00e0ff',
            colorBackground: '#0d0d0d',
            colorInputBackground: '#2a2a2a',
            colorInputText: '#ffffff',
            colorText: '#ffffff',
            colorTextSecondary: '#a1a1aa',
          },
          elements: {
            rootBox: 'w-full min-h-screen',
            card: 'bg-[#0d0d0d] border-0 shadow-none w-full min-h-screen rounded-none',
            navbar: 'bg-[#181818] border-b border-[#2a2a2a]',
            navbarButton: 'hover:bg-[#1e1e1e] text-white data-[active]:bg-[#2a2a2a] data-[active]:text-[#00e0ff]',
            navbarButtonIcon: 'text-gray-400 data-[active]:text-[#00e0ff]',
            pageScrollBox: 'bg-[#181818] px-8 py-6',
            page: 'bg-[#181818] gap-6',
            formButtonPrimary: 'bg-gradient-to-r from-[#00e0ff] to-[#8b5cf6] hover:opacity-90 text-white font-medium shadow-sm',
            formButtonReset: 'hover:bg-[#1e1e1e] text-white border-[#2a2a2a]',
            footer: '!hidden',
            headerTitle: 'text-white font-semibold text-lg',
            headerSubtitle: 'text-gray-400 text-sm',
            profileSection: 'bg-[#181818] border-0',
            profileSectionTitle: 'text-white font-medium text-base',
            profileSectionTitleText: 'text-white font-medium',
            profileSectionContent: 'text-gray-300 bg-[#181818]',
            profileSectionPrimaryButton: 'text-[#00e0ff] hover:text-[#00c8e6] font-medium',
            formFieldLabel: 'text-gray-300 font-medium',
            formFieldInput: 'bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-500 focus:border-[#00e0ff] focus:ring-1 focus:ring-[#00e0ff]',
            formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
            identityPreview: 'bg-[#2a2a2a] border-[#3a3a3a] shadow-sm',
            identityPreviewText: 'text-white',
            identityPreviewEditButton: 'text-[#00e0ff] hover:text-[#00c8e6]',
            identityPreviewEditButtonIcon: 'text-[#00e0ff]',
            accordionTriggerButton: 'hover:bg-[#1e1e1e] text-white border-[#2a2a2a]',
            accordionContent: 'bg-[#181818]',
            badge: 'bg-[#2a2a2a] text-white border-[#3a3a3a]',
            breadcrumbsItem: 'text-gray-400',
            breadcrumbsItemDivider: 'text-gray-600',
            formFieldSuccessText: 'text-green-400',
            formFieldErrorText: 'text-red-400',
            menuButton: 'hover:bg-[#1e1e1e] text-white',
            menuList: 'bg-[#181818] border border-[#2a2a2a]',
            menuItem: 'hover:bg-[#1e1e1e] text-white',
            avatarBox: 'border-2 border-[#00e0ff]',
          },
        }}
      />
    </div>
  )
}

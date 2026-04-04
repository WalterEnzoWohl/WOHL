import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { brandLogoWhite, userProfileAvatar } from '@/assets'

interface HeaderProps {
  showBack?: boolean
  backLabel?: string
  title?: string
  rightContent?: ReactNode
  onBack?: () => void
}

export function Header({ showBack, backLabel, title, rightContent, onBack }: HeaderProps) {
  const navigate = useNavigate()
  const resolvedRightContent = rightContent !== undefined ? rightContent : (
    <div className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(18,239,211,0.2)] bg-[#262626]">
      <img src={userProfileAvatar} alt="Profile" className="w-full h-full object-cover" />
    </div>
  )

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <div
      className="shrink-0 h-16 flex items-center px-4 border-b border-[#262626] z-20"
      style={{ background: '#0E0E0E' }}
    >
      <div className="flex flex-1 items-center">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            {backLabel && (
              <span
                className="text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {backLabel}
              </span>
            )}
          </button>
        ) : (
          <div className="-ml-1 flex h-16 w-16 items-center justify-center overflow-visible">
            <img src={brandLogoWhite} alt="GymUp" className="h-20 w-20 object-contain" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center px-2">
        {title ? (
          <span
            className="truncate text-white font-bold text-base"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </span>
        ) : (
          <span
            className="text-white font-extrabold text-2xl italic uppercase tracking-tight leading-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            GYMUP
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {resolvedRightContent}
      </div>
    </div>
  )
}

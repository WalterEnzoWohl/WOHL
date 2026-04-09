import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { brandLogoBlack, brandLogoWhite } from '@/assets'
import { UserAvatar } from './UserAvatar'
import { useAppData } from '../data/AppDataContext'

interface HeaderProps {
  showBack?: boolean
  backLabel?: string
  title?: string
  rightContent?: ReactNode
  onBack?: () => void
}

export function Header({ showBack, backLabel, title, rightContent, onBack }: HeaderProps) {
  const navigate = useNavigate()
  const { appSettings } = useAppData()
  const resolvedRightContent = rightContent !== undefined ? rightContent : (
    <UserAvatar />
  )
  const brandLogo = appSettings.theme === 'light' ? brandLogoBlack : brandLogoWhite

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <div
      className="shrink-0 h-16 flex items-center px-4 border-b border-[#203347] z-20"
      style={{ background: '#0B1F33' }}
    >
      <div className="flex flex-1 items-center">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#90A4B8] hover:text-white transition-colors"
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
            <img src={brandLogo} alt="WOHL" className="theme-preserve h-20 w-20 object-contain" />
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
            className="text-white font-black text-[1.9rem] uppercase tracking-[0.18em] leading-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            WOHL
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {resolvedRightContent}
      </div>
    </div>
  )
}

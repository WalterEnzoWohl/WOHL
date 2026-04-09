import { userProfileAvatar } from '@/assets';
import { useAppData } from '../data/AppDataContext';

type UserAvatarProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
};

export function UserAvatar({
  alt,
  className = 'h-10 w-10 overflow-hidden rounded-full border border-[rgba(18,239,211,0.2)] bg-[#262626]',
  imageClassName = 'theme-preserve h-full w-full object-cover',
}: UserAvatarProps) {
  const { userProfile } = useAppData();
  const resolvedAlt = alt ?? userProfile.fullName ?? 'Profile';
  const resolvedSrc = userProfile.avatarUrl || userProfileAvatar;

  return (
    <div className={className}>
      <img src={resolvedSrc} alt={resolvedAlt} className={imageClassName} />
    </div>
  );
}

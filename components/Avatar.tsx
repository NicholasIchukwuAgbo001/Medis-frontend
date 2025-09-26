import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  className?: string;
}

const getInitials = (name: string): string => {
  if (!name) return '?';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).filter(n => /[a-zA-Z]/.test(n));
  if (initials.length > 1) {
    return `${initials[0]}${initials[initials.length - 1]}`.toUpperCase();
  }
  return (initials[0] || '?').toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ user, className = 'h-10 w-10' }) => {
  const commonClasses = `rounded-full border-2 border-medis-primary/50 flex items-center justify-center object-cover`;

  if (user.avatarUrl) {
    return (
      <img
        className={`${className} ${commonClasses}`}
        src={user.avatarUrl}
        alt={`${user.name}'s avatar`}
      />
    );
  }

  return (
    <div
      className={`${className} ${commonClasses} bg-medis-primary text-white font-bold text-sm`}
      aria-label={`${user.name}'s avatar`}
    >
      <span>{getInitials(user.name)}</span>
    </div>
  );
};

export default Avatar;

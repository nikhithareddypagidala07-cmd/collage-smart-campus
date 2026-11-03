import React from 'react';
import {
  GraduationCap,
  Building2,
  Wrench,
  Sparkles,
  Bus,
  Zap,
  Droplet,
  BookOpen,
  Utensils,
  HelpCircle,
  Folder
} from 'lucide-react';

const iconMap = {
  GraduationCap,
  Building2,
  Wrench,
  Sparkles,
  Bus,
  Zap,
  Droplet,
  BookOpen,
  Utensils,
  HelpCircle
};

export const CategoryIcon = ({ iconName, categoryName, className = 'w-5 h-5' }) => {
  if (iconName && iconMap[iconName]) {
    const IconComponent = iconMap[iconName];
    return <IconComponent className={className} />;
  }

  // Fallback map by category name
  const name = categoryName ? categoryName.toLowerCase() : '';
  if (name.includes('acad')) return <GraduationCap className={className} />;
  if (name.includes('hostel')) return <Building2 className={className} />;
  if (name.includes('infr')) return <Wrench className={className} />;
  if (name.includes('sanit') || name.includes('hygiene')) return <Sparkles className={className} />;
  if (name.includes('trans')) return <Bus className={className} />;
  if (name.includes('elect')) return <Zap className={className} />;
  if (name.includes('water')) return <Droplet className={className} />;
  if (name.includes('libr')) return <BookOpen className={className} />;
  if (name.includes('cant') || name.includes('mess')) return <Utensils className={className} />;

  return <Folder className={className} />;
};

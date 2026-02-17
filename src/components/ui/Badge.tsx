import { getCategoryDef } from "@/lib/constants";

interface BadgeProps {
  category: string;
}

export function Badge({ category }: BadgeProps) {
  const def = getCategoryDef(category);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${def.bgColor} ${def.textColor}`}
    >
      {category}
    </span>
  );
}

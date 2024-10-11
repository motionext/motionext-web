import Link from "next/link";
import { Mail, Github } from "lucide-react";

interface DeveloperCardProps {
  name: string;
  role: string;
  image: string;
  email: string;
  github: string;
}

export default function DeveloperCard({
  name,
  role,
  image,
  email,
  github,
}: DeveloperCardProps) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-48 h-48 rounded-full object-cover mb-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-blue-500/50"
      />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{role}</p>
      <div className="flex space-x-2">
        <Link
          target="_blank"
          href={`https://github.com/${github}`}
          className="inline-flex items-center justify-center p-2 bg-slate-200 dark:bg-slate-600 text-black dark:text-white rounded-lg transition-colors hover:bg-slate-300 dark:hover:bg-slate-500"
        >
          <Github className="w-5 h-5" />
        </Link>
        <Link
          target="_blank"
          href={`mailto:${email}`}
          className="inline-flex items-center justify-center p-2 bg-slate-200 dark:bg-slate-600 text-black dark:text-white rounded-lg transition-colors hover:bg-slate-300 dark:hover:bg-slate-500"
        >
          <Mail className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

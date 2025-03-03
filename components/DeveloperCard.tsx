import Link from "next/link";
import Image from "next/image";
import { Mail, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="w-full max-w-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse" />
            <Image
              src={image}
              alt={name}
              width={140}
              height={140}
              className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg relative z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            {name}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 font-medium">
            {role}
          </p>

          <div className="flex space-x-4">
            <Link href={`mailto:${email}`} className="inline-block w-10 h-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border-2 w-full h-full"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </Link>
            <Link
              href={`https://github.com/${github}`}
              target="_blank"
              className="inline-block w-10 h-10"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:scale-110 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 border-2 w-full h-full"
              >
                <Github className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

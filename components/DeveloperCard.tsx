import Link from "next/link";
import Image from "next/image";
import { Mail, Github } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="w-72 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardContent className="p-0">
        <div className="relative h-72 w-full">
          <Image
            src={image}
            alt={name}
            className="transition-transform duration-300 hover:scale-110"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-2xl font-bold mb-1">{name}</h3>
            <p className="text-sm opacity-80">{role}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4 p-4 bg-gradient-to-r">
        <Button
          variant="secondary"
          size="icon"
          asChild
          className="rounded-full hover:bg-white/20"
        >
          <Link
            aria-label={`Github ${name}`}
            target="_blank"
            href={`https://github.com/${github}`}
          >
            <Github className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          asChild
          className="rounded-full hover:bg-white/20"
        >
          <Link
            aria-label={`Email ${name}`}
            target="_blank"
            href={`mailto:${email}`}
          >
            <Mail className="w-5 h-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg dark:hover:shadow-blue-500/20 transition-shadow duration-300 bg-gray-800 border-gray-300 dark:border-gray-700">
      <CardHeader>
        <div className="text-4xl mb-4">{icon}</div>
        <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-500 dark:text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/src/lib/utils";
import {
  IconAppWindow,
  IconBrandGithub,
  IconCloud,
  IconFile,
  IconLock,
  IconScale,
  IconServer,
  IconVideo,
} from "@tabler/icons-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Open Source",
      description: "MeetingBot is open source. You can contribute to it!",
      icon: <IconBrandGithub />,
    },
    {
      title: "Multiple Platforms",
      description:
        "We provide a unified API for Zoom, Microsoft Teams, and Google Meet.",
      icon: <IconVideo />,
    },
    {
      title: "Multiple Types of Data",
      description: "Work with video, audio, transcripts, and metadata.",
      icon: <IconFile />,
    },
    {
      title: "API",
      description:
        "Easily create bots and access data with a single REST API call.",
      icon: <IconCloud />,
    },
    {
      title: "Self Hosting",
      description:
        "Infrastructure is defined with Terraform, and deployable on AWS.",
      icon: <IconServer />,
    },
    {
      title: "Dashboard",
      description:
        "Use the dashboard to manage your bots, and view data visually.",
      icon: <IconAppWindow />,
    },
    {
      title: "Scalable Infrastructure",
      description:
        "We use AWS ECS to ensure that your bots can scale with your needs.",
      icon: <IconScale />,
    },
    {
      title: "Secure",
      description: "We're building MeetingBot with security as a top priority.",
      icon: <IconLock />,
    },
  ];
  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 dark:border-neutral-800 lg:border-r",
        (index === 0 || index === 4) && "dark:border-neutral-800 lg:border-l",
        index < 4 && "dark:border-neutral-800 lg:border-b",
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-primary dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
};

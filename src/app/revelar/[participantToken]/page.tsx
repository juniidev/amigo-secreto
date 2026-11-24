import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RevealCard from "@/components/RevealCard";

export const instant = false;

interface RevealPageProps {
  params: Promise<{ participantToken: string }>;
}

export default async function RevealPage({ params }: RevealPageProps) {
  const { participantToken } = await params;

  const participant = await prisma.participant.findUnique({
    where: { token: participantToken },
    include: {
      group: true,
      assignedTo: true,
    },
  });

  if (!participant || !participant.assignedTo) {
    notFound();
  }

  return (
    <RevealCard
      participantToken={participant.token}
      participantName={participant.name}
      groupName={participant.group.name}
      budget={participant.group.budget}
      eventDate={participant.group.eventDate}
      initialHasViewed={participant.hasViewed}
      initialWishlist={participant.wishlist}
      assignedToName={participant.assignedTo.name}
      assignedToWishlist={participant.assignedTo.wishlist}
    />
  );
}

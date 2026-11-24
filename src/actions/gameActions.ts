"use server";

import { prisma } from "@/lib/prisma";
import { generateSecretSantaPairs, PlayerInput } from "@/lib/drawAlgorithm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Esquema de validación para evitar datos corruptos
const CreateGroupSchema = z.object({
  name: z.string().min(2, "El nombre del grupo es muy corto"),
  budget: z.string().optional(),
  eventDate: z.string().optional(),
  players: z
    .array(
      z.object({
        tempId: z.string(),
        name: z.string().min(1, "Todos los participantes deben tener nombre"),
        excludedTempIds: z.array(z.string()),
      }),
    )
    .min(3, "Necesitas al menos 3 participantes"),
});

export async function createSecretSantaGroup(
  rawData: z.infer<typeof CreateGroupSchema>,
) {
  try {
    // 1. Validar entrada
    const data = CreateGroupSchema.parse(rawData);

    // 2. Ejecutar el sorteo en memoria antes de tocar la BD
    const pairsMap = generateSecretSantaPairs(data.players as PlayerInput[]);

    // 3. Guardar todo en una transacción atómica
    const result = await prisma.$transaction(async (tx) => {
      // Crear el grupo
      const group = await tx.group.create({
        data: {
          name: data.name,
          budget: data.budget || null,
          eventDate: data.eventDate || null,
        },
      });

      // Crear los participantes y mapear su tempId con su ID real en Postgres
      const tempToRealId = new Map<string, string>();

      for (const player of data.players) {
        const created = await tx.participant.create({
          data: {
            name: player.name.trim(),
            groupId: group.id,
          },
        });
        tempToRealId.set(player.tempId, created.id);
      }

      // Asignar a quién le regala cada uno y guardar sus exclusiones reales
      for (const player of data.players) {
        const giverRealId = tempToRealId.get(player.tempId)!;
        const receiverTempId = pairsMap.get(player.tempId)!;
        const receiverRealId = tempToRealId.get(receiverTempId)!;

        const realExcludedIds = player.excludedTempIds
          .map((tId) => tempToRealId.get(tId))
          .filter(Boolean)
          .join(",");

        await tx.participant.update({
          where: { id: giverRealId },
          data: {
            assignedToId: receiverRealId,
            excludedIds: realExcludedIds || null,
          },
        });
      }

      return group;
    });

    return { success: true, adminToken: result.adminToken };
  } catch (error) {
    console.error("Error creando el sorteo:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al crear el sorteo.",
    };
  }
}

export async function markParticipantAsViewed(participantToken: string) {
  try {
    await prisma.participant.update({
      where: { token: participantToken },
      data: { hasViewed: true },
    });
  } catch (error) {
    console.error("Error marcando como visto:", error);
  }
}

export async function updateWishlist(
  participantToken: string,
  wishlist: string,
) {
  try {
    await prisma.participant.update({
      where: { token: participantToken },
      data: { wishlist: wishlist.trim() },
    });

    revalidatePath(`/revelar/${participantToken}`);
    return { success: true };
  } catch (error) {
    console.error("Error guardando lista de deseos:", error);
    return { success: false, error: "No se pudo guardar tu lista de deseos." };
  }
}

export async function deleteSecretSantaGroup(adminToken: string) {
  try {
    await prisma.group.delete({
      where: { adminToken },
    });
    return { success: true };
  } catch (error) {
    console.error("Error eliminando el grupo:", error);
    return { success: false, error: "No se pudo eliminar la sala." };
  }
}

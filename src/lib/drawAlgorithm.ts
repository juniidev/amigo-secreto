export interface PlayerInput {
  tempId: string;
  name: string;
  excludedTempIds: string[];
}

export function generateSecretSantaPairs(players: PlayerInput[]) {
  if (players.length < 3) {
    throw new Error("Se necesitan al menos 3 participantes para el sorteo.");
  }

  const maxAttempts = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 1. Copia y mezcla usando Fisher-Yates
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 2. Asignación circular: el índice i le regala a i + 1
    let isValid = true;
    const pairs = new Map<string, string>(); // giverTempId -> receiverTempId

    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];

      // Verificar si el receptor está en la lista de excluidos del dador
      if (giver.excludedTempIds.includes(receiver.tempId)) {
        isValid = false;
        break;
      }

      pairs.set(giver.tempId, receiver.tempId);
    }

    if (isValid) {
      return pairs;
    }
  }

  throw new Error(
    "No se encontró una combinación válida con esas exclusiones. Intenta quitar alguna restricción.",
  );
}

import { generateQueueToken } from "../services/token.service";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess } from "../utils/http";
import type { GenerateTokenInput } from "../validators/token";

export const generateTokenHandler = asyncHandler(async (request, response) => {
  const { queueId } = request.body as GenerateTokenInput;
  const token = await generateQueueToken(queueId);

  return sendSuccess(
    response,
    {
      tokenNumber: token.tokenNumber,
    },
    201,
  );
});

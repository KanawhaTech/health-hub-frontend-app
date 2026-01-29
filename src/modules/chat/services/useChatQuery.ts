import { useMutation } from "@tanstack/react-query";
import api from "@/services/axios";

export const useChatMutation = (sessionId: string) => {
  return useMutation<any, Error, FormData>({
    mutationFn: async (payload: FormData) =>
      api.post("/chat/query", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    mutationKey: ["useChatMutation", sessionId],
  });
};

import { useState, useCallback } from "react";
import api from "@/services/api";
import { GeneratedFile } from "@/services/generator/types";

export type { GeneratedFile };

export interface BuilderMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GenerateResponse {
  success?: boolean;
  files?: GeneratedFile[];
  reactNativeCode?: string;
  backendCode?: string;
  databaseSchema?: string;
  previewUrl?: string;
  snackUrl?: string;
  message?: string;
}

const SYSTEM_PROMPT = `You are AppDev — an AI mobile app generator.
Always understand the user's domain and create UI + components ONLY for that domain.
If user says "cricket app", generate cricket UI.
Never generate ecommerce unless ecommerce is explicitly asked.
Output clean component definitions that the mobile preview can render instantly.`;

export default function useBuilder(initialAppName = "MyApp") {
  const [messages, setMessages] = useState<BuilderMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Tell me what you want to build.",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [appName, setAppName] = useState(initialAppName);
  const [snackUrl, setSnackUrl] = useState<string | null>(null);
  const [reactNativeCode, setReactNativeCode] = useState<string>("");
  const [backendCode, setBackendCode] = useState<string>("");
  const [buildComplete, setBuildComplete] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: BuilderMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setBuildComplete(false);

      try {
        const response = await api.post<GenerateResponse>("/api/generate", {
          appName,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text.trim() },
          ],
        });

        if (response.error || !response.data) {
          throw new Error(response.error || "Failed to generate app");
        }

        const data = response.data;

        if (data.success !== false && Array.isArray(data.files)) {
          setGeneratedFiles(data.files);
          setBuildComplete(true);

          if (data.reactNativeCode) setReactNativeCode(data.reactNativeCode);
          if (data.backendCode) setBackendCode(data.backendCode);
          if (data.snackUrl) setSnackUrl(data.snackUrl);

          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: "🎉 Your app has been generated! You can see the preview on the right.",
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: data.message || "Unable to generate UI. Please try a different description.",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `Error: ${errorMessage}`,
            timestamp: new Date(),
          },
        ]);
      }

      setIsLoading(false);
    },
    [appName, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Tell me what you want to build.",
        timestamp: new Date(),
      },
    ]);
    setGeneratedFiles([]);
    setBuildComplete(false);
    setSnackUrl(null);
    setReactNativeCode("");
    setBackendCode("");
  }, []);

  return {
    messages,
    sendMessage,
    generatedFiles,
    isLoading,
    appName,
    setAppName,
    snackUrl,
    reactNativeCode,
    backendCode,
    buildComplete,
    clearMessages,
  };
}

import { useState } from "react";

interface Interaction {
  human_message: string;
  ai_message: string | null;
}

interface UseChatProps {
  apiEndpoint: string;
}

interface UseChatReturn {
  interactions: Interaction[];
  isFetching: boolean;
  currentInput: string;
  setCurrentInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useChat = ({ apiEndpoint }: UseChatProps): UseChatReturn => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentInput, setCurrentInput] = useState("");

  const getAIResponse = async (
    input: string
  ): Promise<Interaction["ai_message"]> => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({ prompt: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim() === "" || isFetching) return;

    setIsFetching(true);
    const newInteraction: Interaction = {
      human_message: currentInput,
      ai_message: null,
    };

    setInteractions((prev) => [...prev, newInteraction]);

    const aiResponse = await getAIResponse(currentInput);

    setInteractions((prev) =>
      prev.map((interaction, index) =>
        index === prev.length - 1
          ? { ...interaction, ai_message: aiResponse }
          : interaction
      )
    );

    setCurrentInput("");
    setIsFetching(false);
  };

  return {
    interactions,
    isFetching,
    currentInput,
    setCurrentInput,
    handleSubmit,
  };
};
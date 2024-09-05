import React, { useState } from "react";
import { Loader } from "lucide-react";

import { Flex } from "@chakra-ui/react";
import QueryResponse from "@/components/organisms/query-response";
import PromptCard from "@/components/molecules/prompt-card";
import { PlaceholdersAndVanishInput } from "@/components/atoms/query-input";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/evm/EthContext";
import { useChat } from "@/hooks/useChat";

const prompts = [
  { text: "How loud is my location?", bgColor: "orange.400" },
  {
    text: "What are the health effects of noise pollution?",
    bgColor: "teal.400",
  },
  { text: "How does the Sirens app work?", bgColor: "red.400" },
  { text: "How does the Sirens app work?", bgColor: "blue.400" },
];

const QueryInterface = () => {
  const { authenticated } = usePrivy();
  const { toggleAccountModal, handleLogin } = useEthContext();
  const {
    interactions,
    isFetching,
    currentInput,
    setCurrentInput,
    handleSubmit,
  } = useChat({ apiEndpoint: "/api/chat" });

  const placeholders = ["Hello?", "I have a question?", "What do you think?"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authenticated) {
      toggleAccountModal();
      handleLogin();
      return;
    }
    handleSubmit(e);
  };

  return (
    <div
      className={`flex bg-[#f9f8f9] flex-col p-2 rounded-3xl  justify-between items-center gap-10`}
    >
      {interactions.length === 0 ? (
        <form onSubmit={onSubmit}>
          <Flex
            type="submit"
            as={"button"}
            gap={4}
            mb={12}
            flexWrap="wrap"
            justifyContent="center"
          >
            {prompts.map((prompt, index) => (
              <PromptCard
                key={index}
                context={prompt.text}
                bgColor={prompt.bgColor}
                action={() => {
                  setCurrentInput(prompt.text);
                }}
              />
            ))}
          </Flex>
        </form>
      ) : (
        <div className="w-full space-y-6 mt-6">
          {interactions.map((interaction, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-end">
                <p className="mb-2 py-2 px-4 text-right text-[#014338] dark:bg-[#f4e8c9]">
                  User: {interaction.human_message}
                </p>
              </div>
              {interaction.ai_message && (
                <QueryResponse text={interaction.ai_message} attachments={[]} />
              )}

              {isFetching && !interaction.ai_message && (
                <Loader className="animate-spin" />
              )}
            </div>
          ))}
        </div>
      )}

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={currentInput}
        disabled={false}
      />
    </div>
  );
};

export default QueryInterface;

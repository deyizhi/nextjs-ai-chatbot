'use server';
import { type CoreUserMessage, generateText, Message } from 'ai';
import { cookies } from 'next/headers';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/models';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  // Extract the text content from the message
  const textContent = Array.isArray(message.content) 
    ? message.content.map(part => part.type === 'text' ? part.text : '').join('') 
    : message.content;

  const truncatedText = textContent.length > 50 ? textContent.substring(0, 50) : textContent;
  let truncatedMessage: CoreUserMessage = { role: 'user', content: truncatedText };
  //
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 30 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons
    - the output's language should match the input user prompt's language`,
    prompt: JSON.stringify(truncatedMessage),
  });

  return `${title} ${new Date().toISOString()} ${crypto.randomUUID()}`;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}

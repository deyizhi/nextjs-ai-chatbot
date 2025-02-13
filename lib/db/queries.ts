import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
} from './schema';
import { BlockKind } from '@/components/block';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
  throw new Error('POSTGRES_URL environment variable is not defined');
}

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(postgresUrl, {
  max: 50,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  const startTime = new Date();
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  const startTime = new Date();

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database', {
      error,
      email,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  const startTime = new Date();
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  const startTime = new Date();
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  const startTime = new Date();
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  const startTime = new Date();
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  const startTime = new Date();
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const startTime = new Date();
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  const startTime = new Date();
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  const startTime = new Date();
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: BlockKind;
  content: string;
  userId: string;
}) {
  const startTime = new Date();
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  const startTime = new Date();
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  const startTime = new Date();
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  const startTime = new Date();
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
      {
        error,
        timestamp: new Date().toISOString(),
        duration: new Date().getTime() - startTime.getTime() + 'ms'
      }
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  const startTime = new Date();
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database', {
      error,
      timestamp: new Date().toISOString(),
      duration: new Date().getTime() - startTime.getTime() + 'ms'
    });
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  const startTime = new Date();
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
      {
        error,
        timestamp: new Date().toISOString(),
        duration: new Date().getTime() - startTime.getTime() + 'ms'
      }
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

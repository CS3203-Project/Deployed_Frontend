import { openDB } from 'idb';

const DB_NAME = 'zia-messages';
const STORE_NAME = 'messages';

export interface Message {
  fromUserId: string;
  toUserId: string;
  fromName: string;
  message: string;
  pendingId?: string;
  delivered?: boolean;
}

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveMessages(messages: Message[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  for (const message of messages) {
    await store.put(message);
  }

  await tx.done;
}

export async function getMessagesBetween(userId1: string, userId2: string): Promise<Message[]> {
  const db = await getDB();
  const allMessages = await db.getAll(STORE_NAME);

  return allMessages.filter((message: Message) =>
    (message.fromUserId === userId1 && message.toUserId === userId2) ||
    (message.fromUserId === userId2 && message.toUserId === userId1)
  );
}

export async function clearMessages() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
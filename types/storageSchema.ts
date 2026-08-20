import type { Note } from "./note";

export interface StorageSchema {
  version: number;
  notes: Note[];
}

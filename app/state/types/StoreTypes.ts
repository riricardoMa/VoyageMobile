// Base store interface for consistency (LSP - Liskov Substitution Principle)
export interface IBaseStore<T> {
  state: T;
  actions: Record<string, (...args: unknown[]) => void>;
}

// Store creation helper type
export type StoreCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => T & Record<string, unknown>;

import { useSyncExternalStore } from "react";

type Listener = () => void;
type Selector<T, U> = (state: T) => U;

class Store<T> {
  private state: T;
  private listeners: Set<Listener> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => {
    return this.state;
  };

  setState = (newState: Partial<T> | ((prevState: T) => Partial<T>)): void => {
    this.state = {
      ...this.state,
      ...(typeof newState === "function" ? newState(this.state) : newState),
    };

    this.notify();
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };
}

export const createStore = <T>(initialState: T) => {
  const store = new Store<T>(initialState);

  const useStore = <U>(
    selector: Selector<T, U> = (state: T) => state as unknown as U
  ): U => {
    return useSyncExternalStore(store.subscribe, () =>
      selector(store.getState())
    );
  };

  return {
    useStore,
    getState: store.getState,
    setState: store.setState,
  };
};

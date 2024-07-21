type Selector<T, U> = (state: T) => U;
export declare const createStore: <T>(initialState: T) => {
    useStore: <U>(selector?: Selector<T, U>) => U;
    getState: () => T;
    setState: (newState: Partial<T> | ((prevState: T) => Partial<T>)) => void;
};
export {};

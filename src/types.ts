export type PrimitiveConstructor =
    | BooleanConstructor
    | NumberConstructor
    | StringConstructor;

type PrimitiveStorageEntry<
    T extends PrimitiveConstructor = PrimitiveConstructor
> = T extends BooleanConstructor
    ? boolean
    : T extends NumberConstructor
    ? number
    : string;

type StorageEntry<T> = T extends PrimitiveConstructor
    ? PrimitiveStorageEntry<T>
    : T extends unknown[]
    ? StorageEntry<T[0]>[]
    : T extends Record<string, unknown>
    ? { [K in keyof T]: StorageEntry<T[K]> }
    : never;

type Narrow<T, U> = T extends U ? T : never;

export type InferStorageTypeConstraints<T extends Record<string, unknown>> = {
    [K in keyof T]: StorageEntry<T[K]>;
};

export type KeyPathOf<T> = T extends Record<string, unknown>
    ? {
          [K in keyof T]:
              | K
              | `${Narrow<K, string>}${KeyPathOf<T[K]> extends ""
                    ? ""
                    : `.${KeyPathOf<T[K]>}`}`;
      }[keyof T]
    : "";

export type TypeAtPathFor<
    T,
    P extends string
> = P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? TypeAtPathFor<T[K], R>
        : never
    : P extends keyof T
    ? T[P]
    : unknown;

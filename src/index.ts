import { KeyPathOf, InferStorageTypeConstraints, TypeAtPathFor } from "./types";

export class SerdeStorage<
    S extends Storage,
    T extends Record<string, unknown>,
    _T = InferStorageTypeConstraints<T>
> {
    shape: _T;

    constructor(private storage: S, private schema: T) {
        this.shape = {} as _T;
    }

    private keyPath(keyPathStr: string): string[] {
        return keyPathStr.split(".");
    }

    private stringify(value: unknown): string {
        if (typeof value === "string") {
            return value;
        }

        return JSON.stringify(value);
    }

    private parse(value: string): unknown {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    private setPropByKeyPath(obj: any, keyPath: string[], value: any) {
        const [key, ...rest] = keyPath;

        if (rest.length === 0) {
            obj[key] = value;
            return;
        }

        if (obj[key] === undefined) {
            obj[key] = {};
        }

        this.setPropByKeyPath(obj[key], rest, value);
    }

    private getPropByKeyPath(obj: any, keyPath: string[]): any {
        const [key, ...rest] = keyPath;

        if (rest.length === 0) {
            return obj[key] ?? null;
        }

        if (obj[key] === undefined) {
            return null;
        }

        return this.getPropByKeyPath(obj[key], rest);
    }

    private deletePropByKeyPath(obj: any, keyPath: string[]) {
        const [key, ...rest] = keyPath;

        if (rest.length === 0) {
            delete obj[key];
            return;
        }

        if (obj[key] === undefined) {
            return;
        }

        this.deletePropByKeyPath(obj[key], rest);
    }

    setItem<K extends KeyPathOf<T> | (string & {})>(
        key: K,
        value: TypeAtPathFor<_T, K>
    ) {
        const path = this.keyPath(key);

        if (path.length === 1) {
            this.storage.setItem(key, this.stringify(value));
            return;
        }

        const curr = this.parse(this.storage.getItem(path[0]) ?? "{}");

        this.setPropByKeyPath(curr, path.slice(1), value);

        this.storage.setItem(path[0], this.stringify(curr));
    }

    getItem<K extends KeyPathOf<T> | (string & {})>(
        key: K
    ): TypeAtPathFor<_T, K> | null {
        const path = this.keyPath(key);

        if (path.length === 1) {
            return this.parse(this.storage.getItem(key) ?? "null") as any;
        }

        const curr = this.parse(this.storage.getItem(path[0]) ?? "{}");

        return this.getPropByKeyPath(curr, path.slice(1));
    }

    removeItem<K extends KeyPathOf<T> | (string & {})>(key: K) {
        const path = this.keyPath(key);

        if (path.length === 1) {
            this.storage.removeItem(key);
            return;
        }

        const curr = this.parse(this.storage.getItem(path[0]) ?? "{}");

        this.deletePropByKeyPath(curr, path.slice(1));
        this.storage.setItem(path[0], this.stringify(curr));
    }
}

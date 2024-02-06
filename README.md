# SerdeStorage

SerdeStorage is a TypeScript utility package designed to provide typed access to storage systems, such as `localStorage` in web browsers or any other custom storage system that follows the `Storage` interface. It allows for serialization and deserialization (hence "Serde") of structured data while maintaining type safety.

## Features

-   Type-safe storage operations: Get, set, and remove items from storage with full TypeScript type safety.
-   Nested property support: Access nested properties within your storage objects using key paths (e.g., "user.profile.name").
-   Custom storage systems: Works with any storage system that implements the `Storage` interface, making it flexible for various use cases.

## Limitations

### Array Support

While SerdeStorage provides robust support for nested objects, it has limited support for arrays. Specifically, SerdeStorage does not support accessing array elements directly through key paths (e.g., `foo.bar[0]`). Arrays can be stored and retrieved as whole entities, but manipulating individual elements within an array via key paths is not supported.

### Data Structure Validation

SerdeStorage does not perform validation on the structure of the data already present in `localStorage` or any other storage system used. This means that if the data in the storage does not match the expected schema or type map provided to SerdeStorage, type inconsistencies or unexpected behavior might occur. It is the consumer's responsibility to ensure that the stored data's structure aligns with the schema expected by the application.

## Installation

```bash
npm install serde-storage
```

Or if you prefer using yarn:

```bash
yarn add serde-storage
```

## Usage

To use SerdeStorage, first define the structure (schema) of your storage data. Then, create an instance of `SerdeStorage` with your storage system and the schema.

```typescript
import { SerdeStorage } from "serde-storage";

// Define your storage schema
const schema = {
    user: {
        name: String,
        age: Number,
    },
    settings: {
        darkMode: Boolean,
    },
};

// Initialize SerdeStorage with localStorage (or any Storage-compatible system)
const storage = new SerdeStorage(localStorage, schema);

// Set items in storage with type safety
storage.setItem("user", { name: "Jane Doe", age: 30 });
storage.setItem("settings.darkMode", true);

// Get items from storage with type safety
const user = storage.getItem("user"); // { name: 'Jane Doe', age: 30 }
const darkMode = storage.getItem("settings.darkMode"); // true

// Remove items from storage
storage.removeItem("user");
```

## API Reference

### `SerdeStorage<S, T>`

Generic class to create a typed storage instance.

-   `S`: The storage system implementing the `Storage` interface.
-   `T`: The schema type representing the structure of your storage data.

#### `constructor(storage: S, schema: T)`

-   `storage`: An instance of the storage system.
-   `schema`: A schema representing the structure and types of the data to be stored.

#### `setItem<K>(key: K, value: TypeAtPathFor<_T, K>): void`

Sets a value for the given key in the storage.

-   `key`: The key or key path where the value should be stored.
-   `value`: The value to store, which must match the type defined in the schema for the given key.

#### `getItem<K>(key: K): TypeAtPathFor<_T, K> | null`

Retrieves a value from the storage by key.

-   `key`: The key or key path of the value to retrieve.

Returns the value if found, or `null` if not found or the key is invalid.

#### `removeItem<K>(key: K): void`

Removes a value from the storage by key.

-   `key`: The key or key path of the value to remove.

## Contributing

Contributions are welcome! Please submit pull requests with any enhancements, bug fixes, or documentation improvements.

## License

SerdeStorage is released under the [MIT License](https://opensource.org/licenses/MIT).

## Tests

SerdeStorage includes a comprehensive test suite to ensure reliability and type safety. Refer to the `tests` directory in the repository for test implementations and usage examples.

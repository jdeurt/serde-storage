const test = require("ava");

const EphemeralStorage = require("./__utils__/ephemeral-storage");
const ts = require("../dist");

const createStorage = () => {
    const storage = new EphemeralStorage();
    const typedStorage = new ts.SerdeStorage(storage, {
        admin: {
            name: String,
            age: Number,
        },
        users: [
            {
                name: String,
                age: Number,
                isVerified: Boolean,
            },
        ],
        meta: {
            lastUpdated: Number,
            unverifiedUsers: [
                {
                    name: String,
                    age: Number,
                },
            ],
        },
    });

    return { storage, typedStorage };
};

test("TypedStorage", (t) => {
    const { storage, typedStorage } = createStorage();

    typedStorage.setItem("admin", {
        name: "John",
        age: 30,
    });

    t.is(storage.getItem("admin"), JSON.stringify({ name: "John", age: 30 }));
    t.deepEqual(typedStorage.getItem("admin"), { name: "John", age: 30 });
    t.is(typedStorage.getItem("admin.name"), "John");
    t.is(typedStorage.getItem("admin.age"), 30);

    typedStorage.setItem("users", [
        {
            name: "Alice",
            age: 25,
            isVerified: true,
        },
    ]);

    t.is(
        storage.getItem("users"),
        JSON.stringify([{ name: "Alice", age: 25, isVerified: true }])
    );
    t.deepEqual(typedStorage.getItem("users"), [
        { name: "Alice", age: 25, isVerified: true },
    ]);

    typedStorage.setItem("meta.lastUpdated", 1234567890);
    t.is(storage.getItem("meta"), JSON.stringify({ lastUpdated: 1234567890 }));
    t.is(typedStorage.getItem("meta.lastUpdated"), 1234567890);

    typedStorage.setItem("meta.unverifiedUsers", [
        {
            name: "Bob",
            age: 28,
        },
    ]);
    t.is(
        storage.getItem("meta"),
        JSON.stringify({
            lastUpdated: 1234567890,
            unverifiedUsers: [{ name: "Bob", age: 28 }],
        })
    );
    t.deepEqual(typedStorage.getItem("meta.unverifiedUsers"), [
        { name: "Bob", age: 28 },
    ]);

    typedStorage.removeItem("admin");
    t.is(storage.getItem("admin"), null);
    t.is(typedStorage.getItem("admin"), null);

    typedStorage.removeItem("meta.unverifiedUsers");
    t.is(
        storage.getItem("meta"),
        JSON.stringify({
            lastUpdated: 1234567890,
        })
    );
    t.is(typedStorage.getItem("meta.unverifiedUsers"), null);
});

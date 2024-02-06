class EphemeralStorage {
    constructor() {
        this.data = {};
    }

    get length() {
        return Object.keys(this.data).length;
    }

    clear() {
        this.data = {};
    }

    getItem(key) {
        return this.data[key] || null;
    }

    key(index) {
        return Object.keys(this.data)[index] || null;
    }

    removeItem(key) {
        delete this.data[key];
    }

    setItem(key, value) {
        this.data[key] = value;
    }
}

module.exports = EphemeralStorage;

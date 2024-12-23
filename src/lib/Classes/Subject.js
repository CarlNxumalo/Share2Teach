class Subject {
    constructor(subjectID, name, code, description, createdAt, updatedAt) {
        this._subjectID = subjectID;
        this._name = name;
        this._code = code;
        this._description = description;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    get subjectID() {
        return this._subjectID;
    }

    get name() {
        return this._name;
    }

    get code() {
        return this._code;
    }

    get description() {
        return this._description;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    // Setters
    set subjectID(value) {
        this._subjectID = value;
    }

    set name(value) {
        this._name = value;
    }

    set code(value) {
        this._code = value;
    }

    set description(value) {
        this._description = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}

export default Subject;


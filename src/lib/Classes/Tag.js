class Tag {
    constructor(tagID, name) {
        if (tagID !== null && tagID <= 0) {
            throw new Error('TagID must be a positive number');
        }
        this.tagID = tagID;  // Allow null or undefined for new tags
        this.name = name;
    }

    setTagID(tagID) {
        if (tagID <= 0) {
            throw new Error('TagID must be a positive number');
        }
        this.tagID = tagID;
    }

    setName(name) {
        this.name = name;
    }
}

export default Tag;
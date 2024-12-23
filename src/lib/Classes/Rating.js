class Rating {
    constructor(ratingID, rate, fileID) {
        this._ratingID = ratingID;
        this._rate = rate;
        this._fileID = fileID;
    }

    // Getters
    get ratingID() {
        return this._ratingID;
    }

    get rate() {
        return this._rate;
    }

    get fileID() {
        return this._fileID;
    }

    // Setters
    set ratingID(value) {
        this._ratingID = value;
    }

    set rate(value) {
        if (typeof value !== 'number') {
            throw new Error('Rate must be a number.');
        }
        if (value < 1 || value > 5) {
            throw new Error('Rate must be between 1 and 5.');
        }
        this._rate = value;
    }

    set fileID(value) {
        this._fileID = value;
    }
}
export default Rating;
class HttpError extends Error {
    constructor(message, errorCode) {
        super(message) //Adds a Message Property
        this.code = errorCode //Adds a Error Code Property
    }
}

module.exports = HttpError;
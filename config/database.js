if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI: "mongodb://krtolica:krtolica@ds131384.mlab.com:31384/courses-prod"
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/courses-dev"
    };
}
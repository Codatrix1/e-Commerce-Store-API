// We are not calling next() in the notFound Middleware:
// Reason: Once we hit this error, that's it !! We are DONE! The Route does not exist...

const notFound = (req, res) => res.status(404).send("Route does not exist");

module.exports = notFound;

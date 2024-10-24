const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next); // Pass errors to Express error-handling middleware
    };
};

export default asyncHandler;

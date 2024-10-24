const sendResponse = (res, msg, code, data = null) => {
    const response = {
        message: msg,
    };

    if (data) {
        response.data = data;
    }

    return res.status(code).json(response);
};

export default sendResponse;

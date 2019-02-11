class APIErrorClass {
  constructor(err = {}) {
    this.type = err.type ? err.type : 'general';
    this.title = err.title ? err.title : 'An unkown error have occured.';
    this.status = err.status ? err.status : 500;
  }
}

/**
 * @returns Error instance of Error with statusCode to return to client
 */
export const APIError = (message, code) => {
  const err = new Error(message);
  if (code) err.code = code;
  return err;
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = () => (err, req, res, next) => {
  if (err instanceof Error) {
    const status = err.code ? err.code : 500;
    const error = new APIErrorClass({
      type: 'general',
      title: err.message,
      status,
    });

    return res.status(status).json(error);
  }
  return res.status(500).json(new APIErrorClass());
};

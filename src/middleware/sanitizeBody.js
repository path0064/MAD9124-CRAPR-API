const xss = require("xss");

const sanitize = (str) =>
  xss(str, {
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });

const checkType = (value) => {
  if (Array.isArray(value)) {
    return value.map(checkType);
  }
  if (value instanceof Object) {
    return stripTags(value);
  }
  if (typeof value === "string") {
    return sanitize(value);
  }
  return value;
};

const stripTags = (body) => {
  const { ...attributes } = body;

  for (const key in attributes) {
    attributes[key] = checkType(attributes[key]);
  }
  return attributes;
};

const sanitizeBody = (req, res, next) => {
  try {
    const { id, _id, ...attributes } = req.body;
    req.sanitizedBody = stripTags(attributes);

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sanitizeBody;

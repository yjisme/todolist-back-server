const md5 = require("md5");
const { pick, omit } = require("lodash");
const Schema = require("async-validator").default;

/**
 * 仅保留指定的属性，返回一个新的对象
 * @param {*} obj
 * @param  {...any} args
 */
exports.pick = function (obj, ...args) {
  return pick(obj, ...args);
};

/**
 * 丢弃指定的属性，返回一个新的对象
 * @param {*} obj
 * @param  {...any} args
 */
exports.drop = function (obj, ...args) {
  return omit(obj, ...args);
};

/**
 * 将对象中指定的字段去掉首位空格
 * @param {*} obj
 * @param  {...any} fields
 */
exports.trim = function (obj, ...fields) {
  if (!obj) {
    obj = {};
  }
  const newEntries = Object.entries(obj).map(([k, v]) => {
    if (fields.includes(k) && typeof v === "string") {
      return [k, v.trim()];
    }
    return [k, v];
  });
  return Object.fromEntries(newEntries);
};

exports.md5 = function (value) {
  return md5(value);
};

class ValidateError extends Error {
  constructor(errors) {
    super(JSON.stringify(errors));
    this.errors = errors;
  }
}

exports.ValidateError = ValidateError;

exports.validate = async function (obj, rule) {
  if (!obj) {
    obj = {};
  }
  // 解构rule
  const rules = [];
  Object.entries(rule).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((temp) => {
        rules.push({
          [k]: temp,
        });
      });
    } else {
      rules.push({
        [k]: v,
      });
    }
  });
  try {
    for (const r of rules) {
      const validator = new Schema(r);
      await validator.validate(obj);
    }
  } catch (err) {
    if (!err.errors) {
      throw err;
    }
    throw new ValidateError(err.errors);
  }
};

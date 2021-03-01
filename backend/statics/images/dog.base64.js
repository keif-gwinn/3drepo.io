/* eslint-disable strict */
const dog = "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";

module.exports = dog;

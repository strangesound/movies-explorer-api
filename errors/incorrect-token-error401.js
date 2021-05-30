class incorrectTokenError401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = incorrectTokenError401;

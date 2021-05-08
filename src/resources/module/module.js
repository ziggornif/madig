function hello(name) {
  return `Hello ${name || 'world'}`;
}

module.exports = {
  hello,
};

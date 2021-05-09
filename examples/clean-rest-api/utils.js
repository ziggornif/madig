/**
 * Parse request body
 * @param {*} req
 * @returns
 */
function getPostBody(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(JSON.parse(body));
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getPostBody,
};

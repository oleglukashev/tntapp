/* eslint-disable import/prefer-default-export */

function buildURL(url, params = {}) {
  const query = [];

  Object.keys(params).forEach((k) => {
    const v = params[k];

    if (v !== null && v !== undefined) {
      query.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  });

  if (query.length > 0) {
    const delimiter = url.indexOf('?') === -1 ? '?' : '&';

    return `${url}${delimiter}${query.join('&')}`;
  }

  return url;
}

function splitArray(array, chunkSize) {
  const chunks = [];

  for (let i = 0, j = array.length; i < j; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export {
  buildURL,
  splitArray,
};

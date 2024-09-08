import https from 'https';

/**
 * Run a GET request on a URL and return all the data
 *
 * @param url URL to get data from
 * @return a promise containing data returned from the url
*/
export function getDataFromUrl(url)
{
  // Reddit requires a user-agent
  const agent = 'u/dusty-trash reddit-client/2.0.0 by Lionel Bergen';
  const headers = { "user-agent": agent};
  const options = { headers: headers };

  return new Promise(function(resolve, reject) {
    https.get(url, options, (resp) =>
    {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject('error getting data from url', err, ('url is: ' + url));
    });
  });
}

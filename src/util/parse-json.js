/**
 * Simple wrapper to try and parse JSON using 'JSON'. 
 * Will rethrow any exception along with logging the data we failed to parse
 */
export default function parseJSON(data) {
  try {
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch(e) {
    console.error('Failed to parse json data! Data we failed to parse:');
    console.error(data);
    throw e;
  }
}
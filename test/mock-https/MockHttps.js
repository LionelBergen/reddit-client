const https = require('https');
const sinon = require('sinon');
const assert = require('assert');

/**
 * A class for mocking responses from https calls
*/
class FakeClientRequestObject {
  on(nameOfEvent) {
  }
}

class FakeHttpResponse {
  constructor(response) {
    this.response = response;
  }
  
  on(nameOfEvent, data) {
    data(this.response);
  }
}

// TODO: rename and doc
class MockOptionsObject {
  constructor(information) {
    this.returnValue;
  }
  
  andReturn(returnValue) {
    this.returnValue = returnValue;
  }
}

class MockHttps {
  get(expectedUrl, response) {
    sinon.stub(https, 'get').callsFake(function(url, callbackFunction) {
      assert.equal(expectedUrl, url, 'URL did not match expected. Expected: ' + expectedUrl + ' but was: ' + url);
      
      const resp = new FakeHttpResponse(response);
      
      // invoke the response object given our fake data
      callbackFunction(resp);
      
      // We need to return an object that can have '.on(error ..)' invoked on
      return new FakeClientRequestObject();
    });
    
    return new MockOptionsObject();
  }
}

module.exports = new MockHttps();
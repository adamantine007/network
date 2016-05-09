'use strict';

describe('Interests E2E Tests:', function () {
  describe('Test Interests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/interests');
      expect(element.all(by.repeater('interest in interests')).count()).toEqual(0);
    });
  });
});

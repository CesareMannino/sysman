const chai = require('chai');
const expect = chai.expect;
const authController = require('../controllers/authController');

describe('authController', function() {
  describe('#login()', function() {
    it('should log in a valid user', async function() {
      // setup a mock request and response
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: function() { return this; },
        render: function() { return this; },
        redirect: function() { return this; },
      };
      
      await authController.login(req, res);
      
      // add more assertions here based on what you expect `authController.login()` to do
    });
  });
});

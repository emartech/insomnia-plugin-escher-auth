const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const sinon = require("sinon");
const plugin = require('../src/plugin');
const helpers = require('./helpers');

chai.use(sinonChai);

describe('insomnia-plugin-escher-auth', () => {
    it('provides a request hook', () => {
        expect(plugin.requestHooks.length).to.equal(1);
    });

    it('add escher auth headers when the request host has configuration in the escherKeypool env var', () => {
       const escherRequestHook = plugin.requestHooks[0];
       const contextMock = helpers.mockContext();

       escherRequestHook(contextMock);

       expect(contextMock.request.headers.map(header => header.name)).to.contain('x-ems-date');
       expect(contextMock.request.headers.map(header => header.name)).to.contain('x-ems-auth');
    });

    it('set the escher date header with the right format', () => {
       const escherRequestHook = plugin.requestHooks[0];
       const contextMock = helpers.mockContext();

       escherRequestHook(contextMock);
       const escherDateHeader = contextMock.request.headers.find(header => header.name === 'x-ems-date');

       expect(escherDateHeader.value).to.match(/\d{8}T\d{6}Z/);
    });

    it('set the escher auth header with the right format', () => {
        const escherRequestHook = plugin.requestHooks[0];
        const contextMock = helpers.mockContext();

        escherRequestHook(contextMock);
        const escherAuthHeader = contextMock.request.headers.find(header => header.name === 'x-ems-auth');

        let expectedAuthHeaderPattern = /EMS-HMAC-SHA256 Credential=first_service_v1\/\d{8}\/eu\/first-host\/ems_request, SignedHeaders=host;x-ems-date, Signature=.*/;
        expect(escherAuthHeader.value).to.match(expectedAuthHeaderPattern);
    });

    it('does not add escher related headers when the request host has no configuration in the escherKeypool env var', () => {
        const escherRequestHook = plugin.requestHooks[0];
        const contextMock = helpers.mockContext({ url: 'https://unknow-host.com/api/test'});

        escherRequestHook(contextMock);

        expect(contextMock.request.headers.map(header => header.name)).to.not.contain('x-ems-date');
        expect(contextMock.request.headers.map(header => header.name)).to.not.contain('x-ems-auth');
    });

    it('logs to console when configuration for the request host was not found in the escherKeypool', () => {
        const escherRequestHook = plugin.requestHooks[0];
        const contextMock = helpers.mockContext({ url: 'https://unknow-host.com/api/test'});
        sinon.spy(console, 'log');

        escherRequestHook(contextMock);

        expect(console.log).to.have.been.calledWith('Escher key was not found in the keypool for unknow-host.com');

        console.log.restore();
    });
});
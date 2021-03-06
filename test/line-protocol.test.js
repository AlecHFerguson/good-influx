'use strict';

const LineProtocol = require('../lib/line-protocol');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('log', () => {
    it('Event log is formatted as expected', (done) => {
        const testEvent = {
            event: 'log',
            host: 'mytesthost',
            timestamp: 1485996802647,
            tags: ['info', 'request'],
            data: 'Things are good',
            pid: 1234
        };
        const formattedLogEvent = LineProtocol.format(testEvent, {});
        const expectedLogEvent = 'log,host=mytesthost,pid=1234 data="Things are good",tags="info,request" 1485996802647000000';
        expect(formattedLogEvent).to.equal(expectedLogEvent);
        done();
    });
});

describe('request', () => {
    it('Event request is formatted as expected', (done) => {
        const testEvent = {
            event: 'request',
            host: 'mytesthost',
            timestamp: 1485996802647,
            data: 'userid=001',
            id: '4321',
            path: '/hello',
            method: 'POST',
            tags: ['request','blahblahblah'],
            pid: 1234
        };
        const formattedLogEvent = LineProtocol.format(testEvent, {});
        const expectedLogEvent = 'request,host=mytesthost,pid=1234 data="userid=001",id="4321",method="POST",path="/hello",tags="request,blahblahblah" 1485996802647000000';
        expect(formattedLogEvent).to.equal(expectedLogEvent);
        done();
    });
});


describe('response', () => {
    it('Event response is formatted as expected', (done) => {
        const testEvent = {
            event: 'response',
            host: 'mytesthost',
            timestamp: 1485996802647,
            httpVersion   : '1.1',
            id            : '1234',
            instance      : 'mytesthost',
            labels        : 'label001',
            method        : 'GET',
            path          : '/hello',
            source : {
                referer       : 'referer',
                remoteAddress : '127.0.0.1',
                userAgent     : 'Chrome'
            },
            query : {
                k1: 'v1', k2: 'v2'
            },
            responseTime  : 500,
            statusCode    : 200,
            pid           : 1234
        };
        const formattedLogEvent = LineProtocol.format(testEvent, {});
        const expectedLogEvent = 'response,host=mytesthost,pid=1234 httpVersion="1.1",id="1234",instance="mytesthost",labels="label001",method="GET",path="/hello",query="k1=v1&k2=v2",referer="referer",remoteAddress="127.0.0.1",responseTime=500i,statusCode=200i,userAgent="Chrome" 1485996802647000000';
        expect(formattedLogEvent).to.equal(expectedLogEvent);
        done();
    });
});

describe('error', () => {
    it('Event error is formatted as expected', (done) => {
        const testEvent = {
            event: 'error',
            host: 'mytesthost',
            timestamp: 1485996802647,
            error : {
                name   : 'error1',
                message : 'this is an error msg',
                stack  : 'stackoverflow'
            },
            id     : '1234',
            url    : '/hello',
            method : 'GET',
            tags   : ['error','crash'],
            pid    : 1234
        };
        const formattedLogEvent = LineProtocol.format(testEvent, {});
        const expectedLogEvent = 'error,host=mytesthost,pid=1234 error.name="error1",error.message="this is an error msg",error.stack="stackoverflow",id="1234",url="/hello",method="GET",tags="error,crash" 1485996802647000000';
        expect(formattedLogEvent).to.equal(expectedLogEvent);
        done();
    });
});

describe('Unrecognized event', () => {
    it('LineProtocol simply returns', (done) => {
        const testEvent = {
            event: 'hello',
            host: 'mytesthost',
            timestamp: 1485996802647
        };
        expect(LineProtocol.format(testEvent, {})).to.equal(undefined);
        done();
    });
});

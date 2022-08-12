module.exports = {
    mockContext(contextOverrides = {}) {
        const context = {
            request: {
                environment: contextOverrides.environment || {
                    escherKeypool: [
                        {
                            "host": "first-host.com",
                            "credentialScope": "eu/first-host/ems_request",
                            "key": "first_service_v1",
                            "secret": "first-secret",
                        },
                        {
                            "host": "second-host.com",
                            "credentialScope": "eu/second-host/ems_request",
                            "key": "second_service_v1",
                            "secret": "second-secret",
                        },
                    ],
                },
                headers: contextOverrides.headers ||  [
                    {
                        name: 'Content-Type',
                        value: 'application/json',
                    },
                ],
                url: contextOverrides.url || 'https://first-host.com/api/test',
                method: contextOverrides.method || 'GET',
                body: {
                    text: contextOverrides.body || null,
                },
                getEnvironmentVariable(name) {
                    return this.environment[name];
                },
                addHeader(name, value) {
                    this.headers.push({ name, value });
                },
                getUrl() {
                    return this.url;
                },
                getMethod() {
                    return this.method;
                },
                getBody() {
                    return this.body;
                },
            },
        };

        return context;
    },
};
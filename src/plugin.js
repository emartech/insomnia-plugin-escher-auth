/*
 * SPDX-FileCopyrightText: 2022 SAP Emarsys
 *
 * SPDX-License-Identifier: MIT
 */

const Escher = require('escher-auth')

module.exports.requestHooks = [
  context => {
    const host = getHost(context);
    const protocol = getProtocol(context);
    const path = getPath(context);
    const method = context.request.getMethod();
    const body = context.request.getBody().text ?? '';

    const escherConfig = findEscherConfigByHost(context, host);

    if (!escherConfig) {
      console.log(`Escher key was not found in the keypool for ${host}`);

      return;
    }

    const escherOptions = {
      host,
      port: protocol,
      method,
      url: path,
      headers: [
        ['x-ems-date', getTimestamp()],
        ['host', host],
      ],
    };
    const escherAuthHeaders = getEscherAuthHeaders(escherConfig, escherOptions, body);

    addHeaders(context, escherAuthHeaders);
  },
]

const getUrlParts = (context) => {
  return new URL(context.request.getUrl());
}

const getHost = (context) => {
  const urlParts = getUrlParts(context);

  return urlParts.hostname;
}

const getProtocol = (context) => {
  const urlParts = getUrlParts(context);

  return urlParts.protocol === 'https:' ? 443 : 80;
}

const getPath = (context) => {
  const urlParts = getUrlParts(context);
  if (urlParts.search) {
    return urlParts.pathname.concat(urlParts.search);
  }

  return urlParts.pathname;
}

function getTimestamp () {
  return (new Date()).toISOString()
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\..*Z/, 'Z');
}

const findEscherConfigByHost = (context, host) => {
  const keypool = context.request.getEnvironmentVariable('escherKeypool') || [];
  const escherConfig = keypool.find((keyConfig) => keyConfig.host === host);

  return escherConfig;
}

const getEscherAuthHeaders = (escherConfig, escherOptions, body) => {
  const escher = new Escher({
    algoPrefix: 'EMS',
    vendorKey: 'EMS',
    authHeaderName: 'X-Ems-Auth',
    dateHeaderName: 'X-Ems-Date',
    credentialScope: escherConfig.credentialScope,
    accessKeyId: escherConfig.key,
    apiSecret: escherConfig.secret,
  });

  const request = escher.signRequest(escherOptions, body);

  return request.headers;
}

const addHeaders = (context, headers) => {
  headers.forEach(header => {
    context.request.addHeader(...header);
  })
}

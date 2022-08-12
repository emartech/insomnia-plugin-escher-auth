# Escher authentication plugin for Insomnia
An Insomnia plugin to sign the requests with [Escher](http://escherauth.io/) authentication.

## Installation
1. Open Insomnia application
2. Go to Application > Preferences > Plugins 
3. Enter insomnia-plugin-escher-auth 
4. Click "Install Plugin"

## Usage
- First you need to configure your Escher keypool under the `Manage Environments` dialog (CMD + E)
```json
{
  "escherKeypool": [
      {
        "host": "your-host.com",
        "credentialScope": "eu/your-service/ems_request",
        "key": "some-key",
        "secret": "some-secret"
      },
      {
        "host": "your-other-host.com",
        "credentialScope": "eu/your-other-service/ems_request",
        "key": "other-key",
        "secret": "other-secret"
      }
  ]
}
```
- Then you'll be able to send requests to the configured hosts and the plugin will add the Escher signed headers to the request automatically

__Important__: The plugin find the right escher key fom keypool based on the request host, so you need to setup the keypool properly.

## Debugging
- To open the debugger press CMD+ALT+I
- There will be a message on the console when the plugin can't find the key in the keypool for the requested host
`Escher key was not found in the keypool for your-host.com`
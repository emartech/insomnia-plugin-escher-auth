# Escher authentication plugin for Insomnia
An Insomnia plugin to sign the requests with [Escher](http://escherauth.io/) authentication.

## Installation
1. Open Insomnia application
2. Go to Application > Preferences > Plugins 
3. Enter insomnia-plugin-escher-auth 
4. Click "Install Plugin"

## Upgrade to newer plugin version
1. Open Insomnia application
2. Go to Application > Preferences > Plugins
3. Enter insomnia-plugin-escher-auth
4. Click "Install Plugin"
5. Click "Reload Plugins"

## Configuration
To use this plugin you need to configure the Escher keypool as environment variable
1. Open the `Manage Environments` dialog (CMD + E)
2. Create a new environment with the `+` icon and name it like `with escher`
3. Set the keypool like this
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
4. Create another environment with the `+` icon and name it like `without escher` and keep it empty

## Usage
- First you need to configure your Escher keypool by following the above steps
- In the environment selector choose the `with escher` environment
- Then you'll be able to send requests to the configured hosts (presents in the keypool) and the plugin will add the Escher signed headers to the request automatically
- If you want to send request without escher authentication simply change the environment to the `witout escher` one

__Important__: The plugin finds the right escher key fom keypool based on the request's host, so you need to setup the keypool properly

## Debugging
- To open the debugger press CMD+ALT+I
- There will be a message on the console when the plugin can't find the key in the keypool for the requested host
`Escher key was not found in the keypool for your-host.com`

## Known issues
If you have `.npmrc` file in your home folder it can cause error during the plugin installation `An unexpected error occurred: "Failed to replace env in config: ${NPM_TOKEN}"`
In this case just delete your `.npmrc` file to fix the installation process
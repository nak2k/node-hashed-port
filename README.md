# hashed-port

Get a port number with a hash function.

## Installation

```
npm i hashed-port
```

## Usage

``` javascript
const { getPort } = require('hashed-port');

getPort((err, port) => {
  ...
});
```

## getPort([options, ]callback)

- `options`
  - If this arg is a string, it is assumed `options.key`.
- `options.key`
  - Any string to compute a port number.
  - If omitted, the environment variable `npm_package_name` is used.
    This is usefull for your CLI to has a default port number without conflicting with other applications.
- `callback(err, port)`
  - A function that is called to return a gotten port number.

## License

MIT

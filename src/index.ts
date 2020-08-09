import { createHash } from 'crypto';
import { readFile, writeFile } from 'fs';
import { homedir } from 'os';

interface getPortOptions {
  key?: string;
}

type getPortCallback = (err: Error | null, port?: number) => void;

export function getPort(options: getPortCallback): void;
export function getPort(options: getPortOptions | getPortCallback | string, callback?: getPortCallback): void {
  if (typeof options === 'function') {
    [options, callback] = [{}, options as getPortCallback];
  }

  if (typeof options === 'string') {
    options = { key: options };
  }

  const configPath = `${homedir()}/.hashed-port.json`;

  readJsonFile(configPath, (err, config) => {
    if (err) {
      return callback!(err);
    }

    const {
      range = {},
      ports = config.ports = {},
    } = config;

    const {
      key = process.env.npm_package_name,
    } = options as getPortOptions;

    if (key === undefined) {
      return callback!(new Error('Either `options.key` or the environment variable `npm_package_name` must be specified'));
    }

    if (ports[key]) {
      return callback!(null, ports[key]);
    }

    const {
      begin = 1024,
      end = 65536,
    } = range;

    const port = findPort(key, begin, end, Object.values(ports));

    ports[key] = port;

    writeFile(configPath, JSON.stringify(config, null, 2), err => {
      if (err) {
        return callback!(err);
      }

      callback!(null, port);
    });
  });
}

function findPort(key: string, begin: number, end: number, usedPorts: number[]) {
  const md5hash = createHash('md5');
  md5hash.update(key);
  const hash = md5hash.digest().readUInt32LE(0);
  let port = hash % (end - begin) + begin;

  for (let i = port; i < end; ++i) {
    if (!usedPorts.includes(i)) {
      return i;
    }
  }

  for (let i = begin; i < port; ++i) {
    if (!usedPorts.includes(i)) {
      return i;
    }
  }

  return 0;
}

function readJsonFile(path: string, callback: (err: Error | null, result?: any) => void) {
  readFile(path, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(null, {});
      }

      return callback(err);
    }

    try {
      callback(null, JSON.parse(data));
    } catch (err) {
      return callback(err);
    }
  });
}

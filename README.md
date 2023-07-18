Order CLI
=========

![nycrc config on GitHub](https://img.shields.io/nycrc/craigmcn/order-cli)

A small command line utility to shuffle a list of names for a meeting round-table speaking order.

Provided a list of names, the list will be shuffled in a random order and copied to the clipboard.

Requirements
------------

Node >= 14.18.1

Usage
-----

```console
> npx order [options] [--] <participants...>
```

Options
-------

| Option | Description | Type |
|---|---|---|
|`--debug`             | Output debug information    | [`boolean`] |
|`-p, --prefix `       | Output prefix               | [`string`] [_default:_ "Speaking order: "] |
|`-s, --separators`    | Output list separators (i.e., [separator, lastSeparator]) | [`array`] [_default:_ [",", "then"]] |
|`--oc, --oxford-comma`| Use the Oxford comma (e.g., "Alice, Bob, and Charlie"; applies the separator to the second-to-last item) | [`boolean`] |
| `--cc, --clipboard`  | Copy the output to the clipboard (to disable: `--no-cc`, `--no-clipboard`) | [`boolean`] [_default_: true] |
| `--clr, --colors`    | Colorize the output (to disable: `--no-clr`, `--no-colors`) | [`boolean`] [_default_: true] |
|`-h, --help`          | Show help                   | [`boolean`] |
|`-v, --version `      | Show version number         | [`boolean`] |

Examples
--------

```console
> npx order Alice Bob Charlie
Speaking order: Bob, Charlie then Alice

> npx order -p "Here's the order: " Alice Bob Charlie
Here's the order: Charlie, Bob then Alice

> npx order -s ";" "and" --oc -- Alice Bob Charlie
Speaking order: Alice; Charlie; and Bob
```

Limitations
-----------

There's a self-imposed maximum of 16 participants.

Future
------

For this MVP, I was hoping to implement the ability to read from a local file. The self-imposed maximum of 16
participants was to limit the amount of data that would be output from a file.

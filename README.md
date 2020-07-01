L E G E N D A R Y &nbsp; M A Z E S

[![npm version](https://badge.fury.io/js/legendary-mazes.svg)](https://badge.fury.io/js/legendary-mazes)

a tiny javascript library for creating legendary mazes :sparkles:

![a legendary maze](./legendary-maze-1.png)

I took the idea for the _recursive backtracker_ algorithm from this book: [Mazes for Programmers](https://pragprog.com/titles/jbmaze/)

### Demo or Die

Just look at this codepen: https://codepen.io/spearwolf/full/yLePxBw

In order to run the local demo app you need to start a local http server:

```sh
npx serve
```

Then simply call the following url with a browser of your choice: [http://localhost:5000/](http://localhost:5000/)


### Documentation

#### Getting Started

1. install the module in your project

```sh
npm i legendary-mazes
```

2. import what you need ..

```js
import {MazeGrid, RecursiveBacktracker, ...} from 'legendary-mazes';
```

#### API

Take a look into [./demo.js](./demo.js) for an example how to use this library.

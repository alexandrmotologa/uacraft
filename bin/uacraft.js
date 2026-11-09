#!/usr/bin/env node

const { createCli } = require("../dist/cli/index.js");

const program = createCli();
program.parse(process.argv);

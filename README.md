# goDog

## What do we have here?

goDog is a web interface for controlling a GoPro Hero 3+ via the [gdPi] API running on a Raspberry Pi. The GoPro's API is undocumented and obscure, so we opened it up, using the hard work of other open source APIs, as well as some original reverse engineering. goDog was built using Node.js, Backbone.js, and Express.

## What can it do?

+ Control multiple GoPros at the same time
+ View the status of those GoPros at a glance (incuding battery percent, memory left, and whether it's recording)
+ Turn a GoPro on or off
+ Record
+ Preview (Safari on OS X only)

# Setup

First, set up [gdPi]. Then, clone this repository onto a laptop or desktop computer, install the dependncies with NPM, and start the server by running `node server.js`.

[gdPi API]: https://github.com/FrontRush/gdPi

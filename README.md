<center>
<p align="center">
<h1>🌐 Schmarbles 🌐</h1>
<a href="https://github.com/iKasu2k/schmarbles"><img alt="GitHub license" src="https://img.shields.io/github/license/iKasu2k/schmarbles"></a> <a href="https://github.com/iKasu2k/schmarbles/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/iKasu2k/schmarbles"></a> <a href="https://github.com/iKasu2k/schmarbles/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/iKasu2k/schmarbles"></a></p>
</center>

<center>
    <h4>A small bot to join Marbles on Stream in specified Twitch Channels whenever other people write !play</h4>
</center>

## Why Schmarbles :question:
I really enjoy looking at a Marble with my name in the stream I'm watching, but to be honest, when interacting
with the community, I often get distracted and forget to write !play. To circumvent this issue, I've written
this small bot to join the channel I watch and write !play for me. 

:important: I'm not interested to add any additional functionality as the only purpose is to write 
play when I forget to do so. Feel free to do so by yourself, I'm not here to judge.

## Table of Contents :book:
- [Why Schmarbles :question:](#why-schmarbles-question)
- [Table of Contents :book:](#table-of-contents-book)
- [Install Instructions :wrench:](#install-instructions-wrench)
  - [Setup](#setup)
- [Usage :package:](#usage-package)
    - [Start Bot in CLI](#start-bot-in-cli)
- [License :zap:](#license-zap)

## Install Instructions :wrench:

### Setup
Fork `main` branch into your personal repository or clone it directly from the main repository. Install node modules.

```javascript
$ git clone https://github.com/iKasu2k/schmarbles.git
$ cd schmarbles
$ yarn install
```

## Usage :package:

#### Start Bot 
To start the Bot, simply run the following command:
```sh
$ yarn run electron:serve
```

#### Build Bot 
To build a portable version of the Bot, simply run the following command:
```sh
$ yarn electron:build --mlw
```

## License :zap:
This repository is for research purposes only, the use of this code is your responsibility.

I take NO responsibility and/or liability for how you choose to use any of the source code available here. By using any of the files available in this repository, you understand that you are AGREEING TO USE AT YOUR OWN RISK. Once again, ALL files available here are for EDUCATION and/or RESEARCH purposes ONLY.

# NodeGFS
Implementation of Google File System in NodeJS
<br />

## API

for more detail, please view `ClientLib/gfs.js`

`const gfs = require('./ClientLib/gfs.js');`

- `open ( filePath, flags, mode, masterHost, masterPort )`

  `open` file or directory to get a fd

  before run other API, must run `open`
  <br />
  
- `close ( filePath, fd, masterHost, masterPort )`
  
  `close` file or directory with fd. if fd=0, no need to `close`
  <br />

- `createDir ( filePath, masterHost, masterPort )`

  create a directory, in form of `/usr/data`
  <br />

- `deleteDir ( filePath, fd, masterHost, masterPort )`

  delete a directory, with fd
  <br />

- `createFile ( filePath, replicaCount, masterHost, masterPort )`

  create a file, in form of `/usr/data/001`
  <br />

- `deleteFile ( filePath, fd, masterHost, masterPort )`

  delete a file, with fd
  <br />

- `write ( filePath, fd, content, position, masterHost, masterPort )`

  write content to file
  <br />

- `append ( filePath, fd, content, masterHost, masterPort )`

  record append to file
  <br />

- `read ( filePath, fd, position, length, maxChunkSize, masterHost, masterPort )`

  read content from file
  <br />

## Simple Test

**Install NodeJS**

- Please make sure that all computers have NodeJS
- If has not, please visit <a href="https://nodejs.org/en/download/" target="_blank">https://nodejs.org/en/download/</a>, follow the instructions to install

**Get code**

- download code in your *`RootDir`* directory. If use many computer, 

  Master computer must has `base`, `Master` directory. For test, we recommend `tests` is in Master computer
  
  Chunkserver computer must has `base` and `Chunkserver` directory
  <br />

- install dependencies, all computer must to do

  enter *`RootDir`*

      cd base
      npm i

**If use one computer**

- start Master

  open a terminal, enter *`RootDir`*, then

      cd Master
      node main.js

- start Chunkserver

  open three terminal, separately enter *`RootDir`*, then run command in 3 terminal
  
  in 1st terminal

      cd Chunkserver
      node main.js -p 3001

  in 2nd terminal

      cd Chunkserver
      node main.js -p 3002

  in 3rd terminal

      cd Chunkserver
      node main.js -p 3003

**If use four computers**

- start Master

  select one computer as Master, open a terminal, enter *`RootDir`*, then

  edit Master/config.js

  set "process.env.NODE_ENV = 'product';"

  set MASTER_HOST with your IP

      cd Master
      node main.js

- start Chunkserver

  other 3 computers as Chunkserver, select one, open a terminal, enter *`RootDir`*, then

  edit Chunkserver/config.js 

  set "process.env.NODE_ENV = 'product';"

  set MASTER_HOST with your IP

      cd Chunkserver
      node main.js
  
  the rest do the same

  **NOTICE**: after start Master, please start all Chunkserver in 90s, otherwise Master would think some chunk is lost
  <br />

**Run tests**

if has 4 computers, `tests` is in Master computer

- enter *`RootDir`*, then

  `cd tests`

- create file `/usr/data/001`

  `node simple/create.js file /usr/data/001`

- write "hello" to `/usr/data/001`

  `node simple/write.js /usr/data/001 hello 0`

- append "world" to `/usr/data/001`

  `node simple/append.js /usr/data/001 world`

- read "helloworld" from `/usr/data/001`

  `node simple/read.js /usr/data/001 0 10`

- delete `/usr/data/001`

  `node simple/delete.js file /usr/data/001`
  <br />

**View Reuslt**

After run tests, result will be generated in *`RootDir`*/AppData/

`/master/operate.log` - operate log, store the most important metadata
`/master/log.log` - debug log

`/chunkserver/cache/` - cache push data
`/chunkserver/checksum/` - chunk checksum
`/chunkserver/chunk/` - chunk data
`/chunkserver/version/` - chunk version

<br/>


## Bench Test


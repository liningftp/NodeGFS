
# NodeGFS
## Implementation of Google File System in NodeJS


# run on one computer

## Master
enter Master directory, run
node main.js

enter Chunkserver directory, run
node main.js -p 3001
node main.js -p 3002
node main.js -p 3003


# run on multi computer

## all computer in the one LAN

## Master
modify Master/config.js
  set "process.env.NODE_ENV = 'product';"
  set MASTER_HOST with your IP
## enter Master directory, run
node main.js

## Chunkserver
## modify Chunkserver/config.js 
  set "process.env.NODE_ENV = 'product';"
  set MASTER_HOST with your IP
## enter Chunkserver directory, run
node main.js


# Practice

## enter TestApp directory, run

## create file /usr/data/001
cls && node api/create.js file /usr/data/001

## write "hello" to /usr/data/001
cls && node api/write.js /usr/data/001 hello 0

## append "xxx" to /usr/data/001
cls && node api/append.js /usr/data/001 xxx

## read "helloxxx" from /usr/data/001
cls && node api/read.js /usr/data/001 0 8

## delete /usr/data/001
cls && node api/delete.js file /usr/data/001



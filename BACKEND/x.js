const { getGFS, getGridFSBucket } = require("./config/db");

const x = getGFS() 
const y = getGridFSBucket()

console.log(x, y)
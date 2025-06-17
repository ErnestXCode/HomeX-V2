const webpush = require("web-push");

const times_backend = {
  create_house: "2.958s",
  refresh: "387.93ms",
};
const frontend_lightHouse = {
  profile: 93,
  home: 78,
  about: 96,
  contact: 95,
  create: 67,
  login: 100,
  signup: 100,
  personalInfo: 100,
  help: 96,
};

// Get-ChildItem -Recurse ".\FRONTEND" -Include *.js, *.jsx -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\(dist|node_modules)\\'} | Get-Content | Measure-Object -Line

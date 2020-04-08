# How to deploy

We can use http://meteor-up.com/ to deploy.

Install mup:
`npm install --global mup`

Adapt mup.js and settings.json:
Replace `<SERVER_URL>`, `<ADMIN_PASSWORD>` and `<MONGO_URL>` with the matching values.

Set path to local empirica core
export METEOR_PACKAGE_DIRS=/home/local/MPIB-BERLIN/brinkmann/repros

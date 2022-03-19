# Setting up

- (Follow these instructions for Google Cloud Compute Engine Setup](https://medium.com/google-cloud/node-to-google-cloud-compute-engine-in-25-minutes-7188830d884e)
- Install nvm, node, pm2. Make sure node is on v17.7.1 or above.
- To keep it running even after machine restarts, use pm2.

```
npm install pm2

curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install -g pm2


$ pm2 start bot.js
$ pm2 startup
$ pm2 save
```

# Discord API 
- https://discordjs.guide/
- https://discord.js.org/#/docs/main/stable/general/welcome
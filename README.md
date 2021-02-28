# Run locally

# Deploy to Digital Ocean

The database section is a bit incomplete :(

1. Create a Droplet on Digital Ocean
2. SSH into it in a terminal, then run the following commands:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
nvm install node


git clone https://github.com/Jack-Burnett/wam-game-website.git

cd wam-game-website

sudo apt install postgresql postgresql-contrib

sudo -i -u postgres
createdb wam
createuser root
ALTER USER root WITH PASSWORD 'password';
exit
psql wam < database/create_db.txt


npm run build
node server/app.js
```

Setup .env file with those database credentials

Maybe https://tableplus.com/blog/2018/04/postgresql-how-to-grant-access-to-users.html if roles are not correct

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04 helpful


# Restart on server

ps -ef | grep node

kill -9 PROCESS_ID
npm run build
node server/app.js
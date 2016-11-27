# databot [![CircleCI](https://circleci.com/gh/michaelloewenstein/databot.svg?style=svg)](https://circleci.com/gh/michaelloewenstein/databot)
`databot` is a slack bot which gives us the ability to use one client for all our databases, and to easily share our data with team mambers.  

![Alt text](/images/lion.png?raw=true "databot")
## How To Interact ?
![Alt text](/images/screen_shots/simple_usage.png?raw=true "screen_shot")
`databot` interaction is managed via a [slash command](https://api.slack.com/slash-commands): `/query`

Possible commands:
- `/query help` - returns general information about usage and interaction.
- `/query list` - returns list of the configured databases.  
- `/query [database name] [query]` - return a result of a query execution on a certein database.

## How To Install ?
`databot` is a self hosted web server, slash command based slack app, that should be installed and configured as following:

### Adding A Slack Bot To your Team ###
1. Go to https://my.slack.com/services/new/bot
2. Create A new bot  
3. Copy the following into the docker-compose file: CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN

### Adding A Slash Command To your Team ###
1. Follow instructions here: https://api.slack.com/slash-commands#attaching_your_custom_command_to_an_app
2. If you are running the server locally, consider using [localtunnel](https://localtunnel.github.io/www/) so you can maintain a stable ip\url.

For example:
```
lt --local-host 192.168.99.101 --port 8765 --subdomain myfreshdomain
``` 
In this case the ip specified is of the hosting docker-machine.

As mentioned in the instructions, login into the newly created command: [your ip or url]/login

### Running The Server ###
```
docker-compose up
```
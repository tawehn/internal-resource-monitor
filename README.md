# Internal Resource Monitor

This project came about because of an issue I had monitoring applications and servers on my local network without opening up access to those services from the internet. Because these applications are not accessible from the internet I can't use one of the many useful tools that actively ping those applications. I also needed this service to live outside my local network, because I still wanted to receive a notification if my entire network was down.

## How it works
The application is written in NodeJS, executed using lambda functions in AWS. Persistence is handled using DocumentDB. Notifications are sent using Pushover. Pushover is used because other services on my internal network already use pushover and it is nice to have everything centralized in one place.

This application consists of two lambda functions and a set of supporting library modules.

* **updateTimestamp**

  updateTimestamp is accessible through an `HTTP GET` request to the route `/{stage}/update/{name}`. The database is checked for a resource with the name specified in the url. If a resource with that name does not exist, one is created. If a resource already exists the record is retrieved. The `lastSeen` property is updated to the current time. If that resource was previously unavailable a notification is sent stating that the resource is now available.

* **checkAvailability**

  checkAvailability is executed every 15 minutes. Each execution it compiles a list of all resources where the `lastSeen` time was longer than 15 minutes ago. For each of these resources, if a notification hasn't already been sent a notificaiton is sent and the `notified` flag is changed to `true`.  

## Installing / Getting started

This is a standard serverless framework, so there aren't going to be too many surprises with gettings this up and running.

1. Install the serverless framework using `npm`
    ```bash
    npm install -g serverless
    ```

2. Clone this repository
    ```bash
    git clone https://github.com/tawehn/internal-resource-monitor.git
    ```

3. Install the project dependencies
    ```bash
    npm install
    ```

4. Setup pushover environment variables

    For right now, the pushover API configuration uses environment variables (One of those "temporary" solutions). I plan on updating this to use a more maintainable method in the future, but here is how you configure it right now.
    ```bash
    export PUSHOVER_IRM_APP_KEY=YOUR_APP_KEY_HERE
    export PUSHOVER_USER_KEY=YOUR_USER_KEY_HERE
    ```
    Either execute the above lines directly in your shell or place them in your `.bashrc` or `.zshrc`.

5. Deploy to AWS
    ```shell
    sls deploy -s dev
    ```

For more information please refer to the serverless framework documentation.


## Contributing

If you see something that would improve this project please feel free to submit a pull request.

## Licensing
The code in this project is licensed under MIT license.

# Guidescan 2.0 Front-end

![Guidescan 2.0 Front-end](https://imgur.com/a/9RR6puN)

This is the front-end for the Guidescan 2.0 project. It relies on the
REST API back-end to be running. That project is located here:
[guidescan-web](https://github.com/schmidt73/guidescan-web).

# Installation and Deployment

## Dependencies

The complete list of dependencies is here:
- [nodejs](https://nodejs.org/) 
- [guidescan-web](https://github.com/schmidt73/guidescan-web) 

## Deployment

Configuration is done through environmental variables. Currently, the
only required environemnt variable is `REACT_APP_REST_URL`, which
should point to the URL exposed by the
[guidescan-web](https://github.com/schmidt73/guidescan-web) REST API.

Note that the environmental variables are set up at *build* time.
Here is a complete list of environmental variables:
``` shell
REACT_APP_REST_URL          # The REST API base URL
```

Once the REST API back-end is up and running,
execute the following sequence of commands to set up the front-end:
``` shell
$ export REACT_APP_REST_URL=https://www.guidescan.com:8000
$ npm build
$ serve build
```



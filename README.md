# Introduction
This application makes it possible to manage application with the `php-oauth` 
authorization server through its API.

# Screenshot
![html-manage-applications](https://github.com/fkooman/html-manage-applications/raw/master/docs/html-manage-applications.png)

# Installation
You can use [Bower](http://bower.io) to install the dependencies.

    $ bower install

# Configuration
You need to configure the application to point to your OAuth server. This can
be done by copying `config/config.js.default` to `config/config.js` and 
modifying the `config.js` file to suit your situation.

This is the default configuration:

    var apiClientId           = 'html-manage-applications';
    var authorizeEndpoint     = 'https://www.example.org/php-oauth-as/authorize.php';
    var introspectionEndpoint = 'https://www.example.org/php-oauth-as/introspect.php';
    var apiEndpoint           = 'https://www.example.org/php-oauth-as/api.php';

# Client Registration
Also, make sure that this client is registered in your OAuth server. The 
following information could be relevant:

* **Identifier**: html-manage-applications
* **Name**: Manage OAuth Application Registrations
* **Description**: Application for administrators to manage OAuth application 
  registrations.
* **Profile**: User-agent-based Application
* **Secret**: _NONE_
* **Redirect URI**: https://www.example.org/html-manage-applications/index.html

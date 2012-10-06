# OAuth Applications

## Introduction

This application makes it possible to manage applications with the `php-oauth` 
service through its API.

## Screenshots

![html-manage-applications](https://github.com/fkooman/html-manage-applications/raw/master/docs/html-manage-applications-screenshot.png)

![html-manage-applications-new-app-1](https://github.com/fkooman/html-manage-applications/raw/master/docs/html-manage-applications-new-app-screenshot-1.png)

![html-manage-applications-new-app-2](https://github.com/fkooman/html-manage-applications/raw/master/docs/html-manage-applications-new-app-screenshot-2.png)

## Installation

This application depends on the following components:

* jQuery
* JSrender (JavaScript Template Rendering for jQuery)
* JSO (JavaScript OAuth 2 client)
* Bootstrap CSS

It can easily be installed by running the following script:

    $ sh docs/install_dependencies.sh

This will download the latest version of those components and everything will
immediately work.

## Configuration

You may need to modify both `authorizeEndpoint` and `apiEndpoint` in 
`js/manage.js` when your OAuth server is not configured at 
`http://localhost/php-oauth`. So you need to change the following lines:

    var authorizeEndpoint = 'http://localhost/php-oauth/authorize.php';
    var apiEndpoint = 'http://localhost/php-oauth/api.php';

To for example:

    var authorizeEndpoint = 'https://www.example.org/php-oauth/authorize.php';
    var apiEndpoint = 'https://www.example.org/php-oauth/api.php';

## Client Registration
Also, make sure that this client is registered in your OAuth server. The following
information will be relevant:

<table>
  <tr>
    <th>Identifier</th><td>html-manage-applications</td>
  </tr>
  <tr>
    <th>Name</th><td>Manage OAuth Application Registrations</td>
  </tr>
  <tr>
    <th>Description</th><td>Application for administrators to manage OAuth application registrations.</td>
  </tr>
  <tr>
    <th>Profile</th><td>User-agent-based Application</td>
  </tr>
  <tr>
    <th>Secret</th><td><em>NONE</em></td>
  </tr>
  <tr>
    <th>Redirect URI</th><td>https://www.example.org/html-manage-applications/index.html</td>
  </tr>
</table>

That should be all!

# Configuring OAuth Clients

If you want to use the JS management interface you need to modify the API
endpoint in `manage/manage.js`:

    var apiRoot = 'http://localhost/php-oauth';

To (in this example):

    var apiRoot = 'https://www.example.org/php-oauth';

Once this is done you can manage the OAuth client registrations by going to the
URL configured above at `https://www.example.org/html-manage-oauth/index.html`.

Make sure the user identifiers you want to allow `admin` permissions are listed
in the `adminResourceOwnerId[]` list in `config/oauth.ini` in the OAuth server
 and you ran the `docs/initOAuthDatabase.php` script with the base installation 
URI of the management client.

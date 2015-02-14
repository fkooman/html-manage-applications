$(document).ready(function () {
    var apiScope = ["http://php-oauth.net/scope/manage"];

    jso_configure({
        "http://php-oauth.net/app/manage": {
            client_id: clientId,
            authorization: baseUrl + 'authorize.php'
        }
    });
    jso_ensureTokens({
        "http://php-oauth.net/app/manage": apiScope
    });

    function renderApplicationList() {
        $.oajax({
            url: baseUrl + 'api.php' + "/applications/",
            jso_provider: "http://php-oauth.net/app/manage",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#applicationList").html($("#applicationListTemplate").render(data));
                addApplicationListHandlers();
            },
            error: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                alert("ERROR: " + data.error + "\nDESCRIPTION" + data.error_description);
            }
        });
    }

    function addApplicationListHandlers() {
        $("a.editApplication").click(function () {
            editApplication($(this).data('clientId'));
        });
        $("button.deleteApplication").click(function () {
            if (confirm("Are you sure you want to delete the application '" + $(this).data('clientName') + "'?")) {
                deleteApplication($(this).data('clientId'));
            }
        });
    }

    function deleteApplication(clientId) {
        $.oajax({
            url: baseUrl + 'api.php' + "/applications/" + clientId,
            jso_provider: "http://php-oauth.net/app/manage",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "DELETE",
            success: function () {
                renderApplicationList();
            },
            error: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                alert("ERROR: " + data.error_description);
            }
        });
    }

    function editApplication(clientId) {
        if (clientId) {
            // application specified, we edit
            $.oajax({
                url: baseUrl + 'api.php' + "/applications/" + clientId,
                jso_provider: "http://php-oauth.net/app/manage",
                jso_scopes: apiScope,
                jso_allowia: true,
                success: function (data) {
                    $("#editApplication").html($("#applicationEditTemplate").render(data));
                    addEditApplicationHandlers();
                },
                error: function (xhr) {
                    var data = JSON.parse(xhr.responseText);
                    alert("ERROR: " + data.error_description);
                }
            });
        } else {
            // no application specified, we add
            var data = {};
            $("#editApplication").html($("#applicationEditTemplate").render(data));
            addEditApplicationHandlers();
        }
        $("#editApplication").modal();
    }

    function parseForm(formData) {
        var params = {};
        $.each(formData.serializeArray(), function (k, v) {
            params[v.name] = (v.value === '') ? null : v.value;
        });
        return JSON.stringify(params);
    }

    function addEditApplicationHandlers() {
        $("#editApplication a.editClose").click(function () {
            $("#editApplication").modal('hide');
        });
        $("#editApplication a.editSave").click(function () {
            // FIXME: not really a nice way to fetch form data...
            var clientData = parseForm($('form.editApplication'));
            if ($(this).data('clientId')) {
                // if clientId was available, we update
                updateApplication($(this).data('clientId'), clientData);
            } else {
                // or add...
                addApplication(clientData);
            }
        });
    }

    function updateApplication(clientId, clientData) {
        $.oajax({
            url: baseUrl + 'api.php' + "/applications/" + clientId,
            jso_provider: "http://php-oauth.net/app/manage",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "PUT",
            contentType: 'application/json',
            data: clientData,
            success: function () {
                $("#editApplication").modal('hide');
                renderApplicationList();
            },
            error: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                alert("ERROR: " + data.error_description);
            }
        });
    }

    function addApplication(clientData) {
        $.oajax({
            url: baseUrl + 'api.php' + "/applications/",
            jso_provider: "http://php-oauth.net/app/manage",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "POST",
            contentType: 'application/json',
            data: clientData,
            success: function () {
                $("#editApplication").modal('hide');
                renderApplicationList();
            },
            error: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                alert("ERROR: " + data.error_description);
            }
        });
    }

    $("button#addApplication").click(function () {
        editApplication();
    });

    function initPage() {
        renderApplicationList();
    }
    initPage();
});

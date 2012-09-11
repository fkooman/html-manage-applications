$(document).ready(function () {
    var apiClientId = 'application_manager';
    var apiScope = ["applications"];

    var authorizeEndpoint = 'http://localhost/php-oauth/authorize.php';
    var apiEndpoint = 'http://localhost/php-oauth/api.php';

    jso_configure({
        "application_manager": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "application_manager": apiScope
    });

    function renderApplicationList() {
        $.oajax({
            url: apiEndpoint + "/applications/",
            jso_provider: "application_manager",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#applicationList").html($("#applicationListTemplate").render(data));
                addApplicationListHandlers();
            },
            error: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                alert("ERROR: " + data.error_description);
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
            url: apiEndpoint + "/applications/" + clientId,
            jso_provider: "application_manager",
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
                url: apiEndpoint + "/applications/" + clientId,
                jso_provider: "application_manager",
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
            url: apiEndpoint + "/applications/" + clientId,
            jso_provider: "application_manager",
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
            url: apiEndpoint + "/applications/",
            jso_provider: "application_manager",
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

    function checkEntitlement() {
        $.oajax({
            url: apiEndpoint + "/resource_owner/entitlement",
            jso_provider: "application_manager",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "GET",
            dataType: 'json',
            async: false,
            success: function (data) {
                if(-1 === data.entitlement.indexOf("applications")) {
                    alert("WARNING: you are not entitled to use this application, not all functionality will be available!");
                }
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
        checkEntitlement();
        renderApplicationList();
    }
    initPage();
});

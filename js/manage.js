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
            }
        });
    }

    function addApplicationListHandlers() {
        $("button.editApplication").click(function () {
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
            success: function (data) {
                renderApplicationList();
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
                }
            });
        } else {
            // no application specified, we add
            var data = {};
            $("#editApplication").html($("#applicationEditTemplate").render(data));
            addEditApplicationHandlers();
        }
        $("#editApplication").show();
    }

    function parseForm(formData) {
        var params = {};
        $.each(formData.serializeArray(), function (k, v) {
            params[v.name] = (v.value === '') ? null : v.value;
        });
        return JSON.stringify(params);
    }

    function addEditApplicationHandlers() {
        $("#editApplication button.editClose").click(function () {
            $("#editApplication").hide();
        });
        $("#editApplication button.editSave").click(function () {
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
            dataType: 'json',
            data: clientData,
            success: function (data) {
                $("#editApplication").hide();
                renderApplicationList();
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
            dataType: 'json',
            data: clientData,
            success: function (data) {
                $("#editApplication").hide();
                renderApplicationList();
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

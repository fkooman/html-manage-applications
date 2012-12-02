$(document).ready(function () {
    var apiScope = ["applications"];

    jso_configure({
        "html-manage-applications": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "html-manage-applications": apiScope
    });

    function renderApplicationList() {
        $.oajax({
            url: apiEndpoint + "/applications/",
            jso_provider: "html-manage-applications",
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
            jso_provider: "html-manage-applications",
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
                jso_provider: "html-manage-applications",
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
            jso_provider: "html-manage-applications",
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
            jso_provider: "html-manage-applications",
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
        var accessToken = jso_getToken("html-manage-applications");
        if(accessToken) {
            $.ajax({
                url: tokenInfoEndpoint + "?access_token=" + accessToken,
                dataType: 'json',
                type: "GET",
                async: false,
                success: function (data) {
                    if(!data.attributes || !data.attributes.eduPersonEntitlement || -1 === data.attributes.eduPersonEntitlement.indexOf("urn:x-oauth:entitlement:applications")) {
                        alert("WARNING: you are not entitled to use this application, not all functionality will be available!");
                    }
                },
                error: function (xhr) {
                    var data = JSON.parse(xhr.responseText);
                    alert("ERROR: " + data.error_description);
                }
            });
        }

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

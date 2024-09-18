$.extend(window.Parsley.options, {
    focus: "first",
    excluded:
        "input[type=button], input[type=submit], input[type=reset], .search, .ignore",
    triggerAfterFailure: "change blur",
    errorsContainer: function (element) {},
    trigger: "change",
    successClass: "is-valid",
    errorClass: "is-invalid",
    classHandler: function (el) {
        return el.$element.closest(".form-group");
    },
    errorsContainer: function (el) {
        return el.$element.closest(".form-group");
    },
    errorsWrapper: '<div class="parsley-error"></div>',
    errorTemplate: "<span></span>",
});

Parsley.on("field:validated", function (el) {
    var elNode = $(el)[0];
    if (elNode && !elNode.isValid()) {
        var rqeuiredValResult = elNode.validationResult.filter(function (vr) {
            return vr.assert.name === "required";
        });
        if (rqeuiredValResult.length > 0) {
            var fieldNode = $(elNode.element);
            var formGroupNode = fieldNode.closest(".form-group");
            var lblNode = formGroupNode.find(".form-label:first");
            if (lblNode.length > 0) {
                // change default error message to include field label
                var errorNode = formGroupNode.find(
                    "div.parsley-error span[class*=parsley-]"
                );
                if (errorNode.length > 0) {
                    var lblText = lblNode.text();
                    if (lblText) {
                        errorNode.html(lblText + " is required.");
                    }
                }
            }
        }
    }
});

$(document).ready(() => {
    $.ajax({
        url: "/config",
        type: "GET",
        success: function (data) {
            // data = JSON.parse(data);
            let tiktok = data.Tiktok;
            document.getElementById("enable-tiktok").value = tiktok.TiktokEnable
                ? "true"
                : "false";
            document.getElementById("enable-tikfinity").value =
                tiktok.TikfinityEnable ? "true" : "false";
            document.getElementById("enable-tikfinity-http").value =
                tiktok.TikfinityHTTPServer ? "true" : "false";
            document.getElementById("enable-build-in-chaos").value =
                tiktok.TiktokUseBuiltInChaos ? "true" : "false";
            document.getElementById("username").value = tiktok.TiktokUsername;
            document.getElementById("session").value = tiktok.TiktokSessionId;
            document.getElementById("enable-vote").value =
                tiktok.TiktokVoteEnable ? "true" : "false";
            document.getElementById("vote-cooldown").value =
                tiktok.TiktokVoteCooldown;
            document.getElementById("enable-force-effect").value =
                tiktok.TiktokForceEffect ? "true" : "false";
            document.getElementById("enable-indofinity").value =
                tiktok.TiktokUseIndofinity ? "true" : "false";


            checkInput();
        },
    });
});

$("#tiktok-config").on("submit", function (e) {
    e.preventDefault();
});

let checkInput = () => {
    let enableTiktok = document.getElementById("enable-tiktok").value;
    console.log(enableTiktok);
    if (enableTiktok == "true") {
        $("#enable-tikfinity").prop("disabled", false);
        if (document.getElementById("enable-tikfinity").value == "false") {
            $("#username").prop("disabled", false);
            $("#session").prop("disabled", false);
            $("#enable-tikfinity-http").prop("disabled", true);
            $("#enable-build-in-chaos").prop("disabled", true);
            $("#enable-vote").prop("disabled", true);
            $("#vote-cooldown").prop("disabled", true);
            $("#enable-force-effect").prop("disabled", true);
            $("#enable-indofinity").prop("disabled", true);
        } else {
            $("#username").prop("disabled", true);
            $("#session").prop("disabled", true);
            $("#enable-tikfinity").prop("disabled", false);
            $("#enable-tikfinity-http").prop("disabled", false);
            $("#enable-build-in-chaos").prop("disabled", false);
            $("#enable-vote").prop("disabled", false);
            $("#vote-cooldown").prop("disabled", false);
            $("#enable-force-effect").prop("disabled", false);
            $("#enable-indofinity").prop("disabled", false);
        }
    } else {
        $("#enable-tikfinity").prop("disabled", true);
        $("#username").prop("disabled", true);
        $("#session").prop("disabled", true);
        $("#enable-tikfinity-http").prop("disabled", true);
        $("#enable-build-in-chaos").prop("disabled", true);
        $("#enable-vote").prop("disabled", true);
        $("#vote-cooldown").prop("disabled", true);
        $("#enable-force-effect").prop("disabled", true);
        $("#enable-indofinity").prop("disabled", true);
    }
};

$("select").on("change", function (e) {
    checkInput();
});

Parsley.on("form:success", function (e) {
    $.ajax({
        url: "/handle-tiktok-config",
        type: "POST",
        data: $("#tiktok-config").serialize(),
        success: function (data) {
            if (data.status === "success") {
                Swal.fire({
                    title: "Success",
                    text: "Config Has Been Saved",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Config Failed To Save",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },
    });
});

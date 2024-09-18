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
            let general = data.General;
            $("#port").val(general.GUIWebsocketPort);
            $("#cooldown").val(general.Cooldown);
            $("#duration").val(general.EffectDuration);
            $("#seed").val(general.Seed);
        },
    });
})

$(".form").on("submit", function (e) {
    e.preventDefault();
})

Parsley.on("form:success", function (e) {
    $.ajax({
        url: "/handle-general-config",
        type: "POST",
        data: $(".form").serialize(),
        success: function (data) {
            if(data.status == "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'General configuration updated successfully',
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'General configuration was not updated',
                    confirmButtonText: 'OK'
                })
            }
        },
    });
})
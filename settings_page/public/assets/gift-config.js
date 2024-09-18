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

$("#gift-form").on("submit", function (e) {
    e.preventDefault();
})

Parsley.on("form:success", function (e) {
    console.log($("#gift-form").serialize());
    $.ajax({
        url: "/handle-gift-config",
        type: "POST",
        data: $("#gift-form").serialize(),
        success: function (data) {
            if(data.status == "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Gift configuration updated successfully',
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gift configuration was not updated',
                    confirmButtonText: 'OK'
                })
            }
        },
    });
})

let gifts = [], effects = [];
$(function () {
    $.ajax({
        url: "/gifts",
        type: "GET",
        success: function (data) {
            gifts = data;
            gifts.forEach((item) => {
                if (item.images == undefined) {
                    item.images = "";
                    item.name = item.name + " (Unavailable)";
                }
            });
            $("#gift").select2({
                data: gifts.map((item) => {
                    return {
                        id: item.id,
                        image: item.images.image,
                        text: item.name,
                        coin: item.diamond_count
                    };
                }),
                className: "form-select",
                placeholder: "Select a gift",
                templateResult: function (state) {
                    if (!state.image) return state.text; // optgroup
                    let img = state.image ? state.image : "";
                    return $(
                        `<span><img src="${img}" style="width:25px; height:25px; margin-right: 5px; vertical-align: middle;" /> ${state.text} <span style="color:#FFD700"> ${state.coin} coin</span></span>`
                    );
                },
                templateOption: function (state) {
                    if (!state.id) return state.text; // optgroup
                    let img = state.image ? state.image : "";
                    return $(
                        `<span><img src="${img}" style="width:25px; height:25px; margin-right: 5px; vertical-align: middle;" /> ${state.text} <span style="color:#FFD700"> ${state.coin} coin</span></span>`
                    );
                }
            });
        },
    });

    $.ajax({
        url: "/effects",
        type: "GET",
        success: function (data) {
            effects = data;
            $("#run-effect").select2({
                data: effects["Function"].map((item) => {
                    return {
                        id: item.id,
                        description: item.description,
                        text: item.name,
                    };
                }),
                placeholder: "Select an effect",
            });
        },
    });
});


$('#gift').on('select2:select', function (e) {
    let data = e.params.data;
    let theGift = gifts.find((item) => item.id == data.id);
    if(theGift.run_effect != undefined && theGift.run_effect != "") {
        let effect = effects["Function"].find((item) => item.description == theGift.run_effect);
        $("#run-effect").val(effect.id).trigger("change");
    } else {
        $("#run-effect").val("").trigger("change");
    }
});
let effects = [], spinwheelEffects = [];
$(function () {
    $.ajax({
        url: "/effects",
        type: "GET",
        success: function (data) {
            effects = data;
            console.log(effects);
            $("#run-effect").select2({
                data: effects["Function"].map((item) => {
                    return {
                        id: item.id,
                        text: item.name
                    };
                }),
                className: "form-select",
                placeholder: "Select an effect"
            });
        }
    });

    RefreshEffect();
})

function RefreshEffect() {
    $.ajax({
        url: "/spinnwheel-effects",
        type: "GET",
        success: function (data) {
            console.log(data);
            if(data.status != "error") {
                spinwheelEffects = data;
                if(data.status != "error") {
                    let effects = data.effects;
                    spinwheelEffects = effects;
                    $("#effect-list").empty();
                    effects.forEach((item, i) => {
                        $("#effect-list").append(`<li>${item.name} (${i + 1})</li>`);
                    });
                } 
            }
        }
    })
}

function PostEffect() {
    $.ajax({
        url: "/handle-spinwheel-config",
        type: "POST",
        data: {
            effects: JSON.stringify(spinwheelEffects)
        },
        success: function (data) {
            
        }
    });
}

$("#add").on("click", function (e) {
    e.preventDefault();
    if(spinwheelEffects.find((item) => item.id === $("#run-effect").select2("data")[0].id)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Effect already added',
            confirmButtonText: 'OK'
        })
        return;
    }
    if(spinwheelEffects.length >= 20) {
        // Remove The First Element
        spinwheelEffects.shift();
        $("#effect-list li:first").remove();
    }
    let effect = $("#run-effect").select2("data")[0];
    spinwheelEffects.push({id: effect.id, name: effect.text});
    PostEffect();
    RefreshEffect();
})

$("#clear").on("click", function (e) {
    e.preventDefault();
    spinwheelEffects = [];
    PostEffect();
    RefreshEffect();
})

$("#remove").on("click", function (e) {
    e.preventDefault();
    let effect = $("#run-effect").select2("data")[0];
    let index = spinwheelEffects.findIndex((item) => item.id === effect.id);
    if(index !== -1) {
        spinwheelEffects.splice(index, 1);
        $("#effect-list").empty();
    }
    PostEffect();
    RefreshEffect();
})
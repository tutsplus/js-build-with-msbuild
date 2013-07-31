$(function () {
    var viewModel;
    function select(event, ui) {
        var url = "/json/" + ui.item.data("url");
        $.getJSON(url, function (data) {
            viewModel.header(data.header);
            viewModel.text(data.text);
        })
        .error(function (errorData) {
            viewModel.header("Error");
            if (errorData.status === 404) {
                viewModel.text("Could not find " + ui.item.text() + " at " + url);
            } else {
                viewModel.text("There has been an error, probably a JSON syntax error. Check the JSON syntax in the file <code>" + url + "</code>");
                console.log(errorData);
            }
        });
    }
    ko.bindingHandlers.addData = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $.data(element, "url", value);
            }
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $.data(element, "url", value);
            }
        }

    };
    $.getJSON('/json/menubar-data.json', function (data) {
        viewModel = {
            header: ko.observable(),
            text: ko.observable(),
            masters: ko.observableArray([
            {
                name: "Master1",
                root: data
            }
            ]),
            renderMenu: function () {
                $("#menu").menubar({
                    autoExpand: true,
                    menuIcon: true,
                    buttons: true,
                    select: select
                });
            }
        };
        ko.applyBindings(viewModel);
        viewModel.header("Welcome");
        viewModel.text("The English Resource Page");

    })
    .error(function (errorData) {
        console.log({ "errorData": errorData });
        console.log(errorData.error());
    });
});
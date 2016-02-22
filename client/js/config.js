_.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape: /\{\{-(.+?)\}\}/g
};

$.fn.getObject = function() {
    var o = {},
        a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.fromObject = function(data) {
    var self = this;
    $.each(data, function(key, value) {
        var $ctrl = self.find('[name=' + key + ']');
        switch ($ctrl.attr('type')) {
            case 'text':
            case 'hidden':
                $ctrl.val(value);
                break;
            case 'radio':
            case 'checkbox':
                $ctrl.each(function() {
                    console.log($(this).attr('value'), value);
                    if ($(this).attr('value') === value.toString()) {
                        $(this).prop('checked', true);
                    }
                });
                break;
            default:
                $ctrl.val(value);
        }
    });
};

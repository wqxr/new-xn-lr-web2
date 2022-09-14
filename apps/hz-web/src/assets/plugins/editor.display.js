// 把字段内容显示为label，而不是input
(function ($, DataTable) {

    if (!DataTable.ext.editorFields) {
        DataTable.ext.editorFields = {} as any;
    }

    var Editor = DataTable.Editor;
    var _fieldTypes = DataTable.ext.editorFields;

    _fieldTypes.display = {
        create: function (conf) {
            var that = this;


            // Create the elements to use for the input
            conf._input = $(
                '<div id="' + Editor.safeId(conf.id) + '"><label class="display-label"></label></div>');

            return conf._input;
        },

        get: function (conf) {
            console.log('display field get: ' + conf._value);
            return conf._value || '';
        },

        set: function (conf, val) {
            console.log('display field set');
            console.log(conf);
            console.log(val);
            conf._value = val;
            $('label', conf._input).html(val);
        },

        enable: function (conf) {
        },

        disable: function (conf) {
        }
    };

})(jQuery, jQuery.fn.dataTable);

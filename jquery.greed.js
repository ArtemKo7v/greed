(function($){
    'use strict';

    /**
     * Greed object
     */
    var Greed = {
        /**
         * Container object
         */
        container: null,

        /**
         * Data
         */
        data: [],

        /**
         * Greed parameters
         * @var {object}
         */
        params: {
            maxRows: 1000,
            debug: false
        },

        /**
         * Columns count
         */
        cols: 0,

        /**
         * Rows count
         */
        rows: 0
    };

    /**
     * Greed object
     * @param <object> object
     * @param <object> data
     * @param <object> parameters
     */
    Greed.table = function(object, data, parameters){

        Greed.container = object;
        Greed.data = data;

        /**
         * Table object
         */
        this.table = null;

        /**
         * Initialization.
         */
        this.init = function(){
            Greed.container.addClass('Greed');
            this.calcSize();
            this.createTable();
        };

        /**
         * Creates table element.
         */
        this.createTable = function(){
            this.table = $('<TABLE>');
            this.table.addClass('datagrid');
            Greed.container.append(this.table);
            for(var row=0; row<Greed.rows; row++){
                this.addRow(Greed.data[row]);
            }
        }

        /**
         * Calculate table dimensions.
         */
        this.calcSize = function(){
            console.log(Greed.params);
            Greed.rows = typeof(Greed.params.rows) != 'undefined' ? Greed.params.rows : Greed.data.length;
            if(typeof(Greed.params.cols) == 'undefined'){
                Greed.cols = 0;
                for(var i=0; i<Greed.rows; i++){
                    if(Greed.data[i].length > Greed.cols){
                        Greed.cols = Greed.data[i].length;
                    }
                }
            }else{
                Greed.cols = Greed.params.cols;
            }
        }

        /**
         * Adds new row, filled with data.
         */
        this.addRow = function(rowData){
            var row = $('<TR>');
            for(var i=0; i<Greed.cols; i++){
                var cell = $('<TD>');
                if(typeof(rowData) == 'undefined'){
                    rowData = [];
                }
                cell.text(typeof(rowData[i]) != 'undefined' ? rowData[i] : '');
                row.append(cell);
            }
            this.table.append(row);
        }

        $.extend(Greed.params, parameters)
        this.init();
    };

    $.fn.greed = function(data, parameters){
        this.greed = new Greed.table(this, data, parameters);

        if(this[0].nodeName == 'TABLE'){
            // table mode
        }
        return this;
    };
})(jQuery);
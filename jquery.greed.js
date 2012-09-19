(function($){
    'use strict';

    /**
     * Greed namespace
     */
    var Greed = {};

    /**
     * Greed options
     *
     * @param <object> greed
     * @param <object> options
     */
    Greed.options = function(greed, options){

        /**
         * Greed object
         */
        var greed = greed;

        /**
         * Default greed options
         */
        var defaultOptions = {
            maxRows: 1000,
            debug: false
        };

        /**
         * Options
         */
        var options = $.extend(defaultOptions, options);

        /**
         * Get option or options array
         */
        this.get = function(name){
            if(name != undefined){
                return options[name];
            }
            return options;
        }

        /**
         * Set option or options array
         */
        this.set = function(name, value){
            if(typeof(name) == 'object'){
                options = $.extend(options, name);
            }
            if(typeof(name) == 'string'){
                options.name = value;
            }
        }
    };

    /**
     * Greed table object
     *
     * @param <object> greed
     * @param <object> data
     */
    Greed.table = function(greed, data){
        /**
         * Greed object
         */
        var greed = greed;

        /**
         * Data
         */
        var data = data;

        /**
         * Number of columns
         */
        var cols = 0;

        /**
         * Number of rows
         */
        var rows = 0;

        /**
         * Table object
         */
        var table = null;

        /**
         * Initialization.
         */
        this.init = function(){
            this.calcSize();
            this.createTable();
        };

        /**
         * Creates table element.
         */
        this.createTable = function(){
            table = $('<TABLE>');
            table.addClass('datagrid');
            greed.container.append(table);
            for(var row=0; row < rows; row++){
                this.addRow(data[row]);
            }
        }

        /**
         * Calculate table dimensions.
         */
        this.calcSize = function(){
            var options = greed.options.get();
            rows = typeof(options.rows) != 'undefined' ? options.rows : data.length;
            if(typeof(options.cols) == 'undefined'){
                cols = 0;
                for(var i=0; i<rows; i++){
                    if(data[i].length > cols){
                        cols = data[i].length;
                    }
                }
            }else{
                cols = options.cols;
            }
        }

        /**
         * Adds new row, filled with data.
         */
        this.addRow = function(rowData){
            var row = $('<TR>');
            for(var i=0; i < cols; i++){
                var cell = $('<TD>');
                if(typeof(rowData) == 'undefined'){
                    rowData = [];
                }
                cell.text(typeof(rowData[i]) != 'undefined' ? rowData[i] : '');
                row.append(cell);
            }
            table.append(row);
        }
    };

    $.fn.greed = function(data, options){
        if(!this[0].greed){

            this.addClass('Greed');

            var greed = {};

            greed.container = this;

            // + greed.data
            // + greed.history

            greed.options = new Greed.options(greed, options);
            greed.table = new Greed.table(greed, data);

            // + greed.cursor
            // + greed.selection
            // + greed.clipboard
            // + greed.events
            // + greed.headers

            // Initialize table
            greed.table.init();
            this[0].greed = greed;

            /*
            if(this[0].nodeName == 'TABLE'){
                // table mode
            }
            */
        }else{
            return this[0].greed;
        }
        return this;
    };
})(jQuery);
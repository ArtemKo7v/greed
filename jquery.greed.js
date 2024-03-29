(function($){
    'use strict';

    /**
     * Greed namespace
     */
    var Greed = {};

    Greed.instances = [];

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
                if(typeof(options[name]) != 'undefined'){
                    return options[name];
                }
                return null;
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
     * Table columns
     */
    Greed.columns = function(greed){
        /**
         * Greed object
         */
        var greed = greed;

        /**
         * Column names
         */
        var names = [];

        /**
         * Column types
         */
        var types = [];

        /**
         * Column captions
         */
        var captions = [];

        /**
         * Fill columns data
         */
        var columnsData = greed.options.get('columns');
        if(columnsData != null){
            for(var columnName in columnsData){
                if(typeof(columnsData[columnName]) == 'object'){
                    names.push(columnName);
                    types.push(typeof(columnsData[columnName].type) != 'undefined' ? columnsData[columnName].type : 'string');
                    captions.push(typeof(columnsData[columnName].caption) != 'undefined' ? columnsData[columnName].caption : '');
                }
            }
        }

        /**
         * Get column caption
         */
        this.getCaption = function(idx){
            return typeof(captions[idx]) != 'undefined' ? captions[idx] : '';
        }
    };

    /**
     * Cursor handler.
     */
    Greed.cursor = function(greed){
        /**
         * Greed object
         */
        var greed = greed;

        /**
         * Cursor DIV object
         */
        var div = null;

        /**
         * Is cursor active
         */
        var active = false;

        /**
         * Cursor position
         */
        var position = {
            col: 0,
            row: 0
        };

        /**
         * Initialize object
         */
        this.init = function(){
            div = $('<DIV>');
            div.addClass('cursor');
            greed.container.append(div);
        }

        /**
         * Place cursor
         */
        this.place = function(col, row){
            position.col = col;
            position.row = row;
            active = true;
            this.redraw();
            greed.input.focus();
        }

        /**
         * Move to the left
         */
        this.moveLeft = function(){
            if(position.col > 0){
                position.col--;
            }
            this.redraw();
        }

        /**
         * Move to the right
         */
        this.moveRight = function(){
            if(position.col < greed.options.get('cols') - 1){
                position.col++;
            }
            this.redraw();
        }

        /**
         * Move cursor up
         */
        this.moveUp = function(){
            if(position.row > 0){
                position.row--;
            }
            this.redraw();
        }

        /**
         * Move cursor down
         */
        this.moveDown = function(){
            if(position.row < greed.options.get('rows') - 1){
                position.row++;
            }
            this.redraw();
        }

        /**
         * Redraw cursor
         */
        this.redraw = function(){
            var curCell = greed.table.getCell(position.col, position.row);
            var pos = curCell.offset();
            var tpos = greed.container.offset();
            div.css('top', pos.top - tpos.top);
            div.css('left', pos.left - tpos.left);
            div.width(curCell.outerWidth() - 4);
            div.height(curCell.outerHeight() - 4);
            div.show();
            greed.input.focus();
        }

        /**
         * Hide cursor
         */
        this.hide = function(){
            active = false;
            div.hide();
        }
    }

    /**
     * Keyboard input.
     */
    Greed.input = function(greed){

        /**
         * Greed object
         */
        var greed = greed;

        /**
         * Hidden textarea object
         */
        var textarea = null;

        /**
         * Initialize keyboard input element
         */
        this.init = function(){
            var div = $('<DIV>');
            div.addClass('input');
            textarea = $('<TEXTAREA>');
            div.append(textarea);
            greed.container.append(div);
            textarea.keydown(onKeyDown);
            textarea.bind('blur', function(_greed){
                return function(e){
                    _greed.cursor.hide();
                }
            }(greed));
        }

        /**
         * Set focus, catch keypresses
         */
        this.focus = function(){
            textarea.val('');
            textarea.focus();
        }

        /**
         * Remove focus, stop catch keypresses
         */
        this.blur = function(){
            textarea.blur();
        }

        /**
         * Keyboard handler
         */
        var onKeyDown = function(e){

            // Key codes map
            var keyCodes = {
                arrowLeft   : 37,
                arrowUp     : 38,
                arrowRight  : 39,
                arrowDown   : 40
            };

            switch(e.which){
                case keyCodes.arrowUp:
                    greed.cursor.moveUp();
                    break;
                case keyCodes.arrowDown:
                    greed.cursor.moveDown();
                    break;
                case keyCodes.arrowLeft:
                    greed.cursor.moveLeft();
                    break;
                case keyCodes.arrowRight:
                    greed.cursor.moveRight();
                    break;
                default:
                    console.log(e.which);
            }
            e.preventDefault();
        }
    }


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
            table.attr('cellpadding', 0);
            table.attr('cellspacing', 0);
            table.addClass('datagrid');
            greed.container.append(table);

            table.bind('selectstart', function(e){
                e.preventDefault();
            });
            if(greed.options.get('showColumnCaptions')){
                addColumnCaptionsRow();
            }
            for(var row=0; row < rows; row++){
                this.addRow(data[row]);
            }
            table.click(function(_greed){
                return function(e){
                    if(typeof(e.target) != 'undefined' && e.target && e.target.nodeName == 'TD'){
                        for(var i=0; i<Greed.instances.length; i++){
                            Greed.instances[i].cursor.hide();
                        }

                        var col = e.target.cellIndex;
                        var row = e.target.parentNode.rowIndex;
                        if(_greed.options.get('showRowNumbers')){
                            col--;
                        }
                        if(_greed.options.get('showColumnCaptions')){
                            row--;
                        }
                        _greed.cursor.place(col, row);
                        e.preventDefault();
                    }
                }
            }(greed));
        }

        /**
         * Redraws the table
         */
        this.redraw = function(){
            table.remove();
            this.createTable();
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
            greed.options.set({
                cols: cols,
                rows: rows
            });
        }

        /**
         * Adds new row, filled with data.
         */
        this.addRow = function(rowData){
            var row = $('<TR>');
            if(greed.options.get('showRowNumbers')){
                var headerCell = $('<TH>');
                var rowNumber = table.find('TR').length;
                if(!greed.options.get('showColumnCaptions')){
                    rowNumber += 1;
                }
                headerCell.text(rowNumber);
                row.append(headerCell);
            }
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

        /**
         * Gets cell by coordinates
         */
        this.getCell = function(col, row){
            if(greed.options.get('showColumnCaptions')){
                row++;
            }
            return table.find('TR:eq(' + row +') TD:eq(' + col + ')');
        }

        /**
         * Columns caption row
         */
        var addColumnCaptionsRow = function(){
            var row = $('<TR>');
            if(greed.options.get('showRowNumbers')){
                var headerCell = $('<TH>');
                row.append(headerCell);
            }
            for(var i=0; i < cols; i++){
                var cell = $('<TH>');
                cell.text(greed.columns.getCaption(i));
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

            greed.options   = new Greed.options(greed, options);
            greed.columns   = new Greed.columns(greed);
            greed.input     = new Greed.input(greed);
            greed.table     = new Greed.table(greed, data);
            greed.cursor    = new Greed.cursor(greed);

            // + greed.selection
            // + greed.clipboard
            // + greed.events

            // Initialize table
            greed.table.init();
            this[0].greed = greed;

            greed.cursor.init();
            greed.input.init();

            Greed.instances.push(greed);

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
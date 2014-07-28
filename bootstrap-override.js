/* 
 * bootstrap-override.js v1.0
 * File contains methods to convert tables into dropdown menus to help blind
 * users navigate information in tables more intuitively.
 */

//$(document).ready(function() {
    //moves the dropdown to the right to avoid overlap with button
    var moveRightDropdown = function() {
        var shiftRight = $("#speciallist").siblings(".dropdown-toggle").outerWidth(true);
        $("#speciallist").css("left", shiftRight + "px");
    };
    
    var getDropdown = function(className) { 
        /* 
         * retrieves empty dropdown from the template with class className
         * @param class of template to be accessed
         * @return jQuery object of a <div> with class '.dropdown'  
         */
        
        if ('content' in document.createElement('template')) {

            // Remove the content of the template and convert it to a jQuery object
            var t = document.querySelector(className);
            var dropdownTemplate = t.content.querySelector('.dropdown');
            var $newDropdown = $(dropdownTemplate.cloneNode(true));
            return $newDropdown;

        } else {
            alert('Broswer does not support templates. Dropdown loaded unsuccessfully.');
        }
    };
    var getDropdownRow = function(className) { 
        /* 
         * retrieves empty list element from the template with class className
         * @param class of template to be accessed
         * @return jQuery object of a <li> that goes into dropdown 
         */
        
        if ('content' in document.createElement('template')) {

            // Remove the content of the template and convert it to a jQuery object
            var t = document.querySelector(className);
            var dropdownRowTemplate = t.content.querySelector('.dropdown li');
            var $newDropdownRow = $(dropdownRowTemplate.cloneNode(true));
            return $newDropdownRow;

        } else {
            alert('Broswer does not support templates. Dropdown row loaded unsuccessfully.');
        }
    };
    console.log(getDropdown('.submenu'));
    var getDataTable = function(className, includeFooter) {
        /* 
         * retrieves information from a table already present in the html body
         * @param class of table in HTML body; assumed that table contains 
         *        only numbers and strings, no other objects;
         *        boolean to indicate whether to include table footer in table
         * @return collection of data in table, organized as 
         *         a 2D array: an array of row arrays
         */
        
        var data = [];
        //get values for table title and columns
        var headings = []
        $(className + ' thead tr th').each(function() {
            headings.push($(this).text());
        });
        data.push(headings);
        //collect data entries into data collection
        $(className + ' tbody tr').each(function(rowIndex) {
            var newRow = []
            $(this).children('td').each(function(columnIndex) {
                newRow.push($(this).text());
            });
            data.push(newRow);
        });
        //if includeFooter is true, include footer information
        if (includeFooter) {
            $(className + ' tfoot tr').each(function(rowIndex) {
                var newRowFooter = []
                $(this).children('td').each(function(columnIndex) {
                    newRowFooter.push($(this).text());
                });
                data.push(newRowFooter);
            });
        }
        return data;
    };
    
    var listToDropdown = function(infoArray, dropdownClass) {
        /*
         * creates a dropdown with a title and collection of data
         * @param infoArray contains the header of dropdown at index 0
         *        and other data at index >= 1
         *        dropDownClass is the template of dropdown to be used
         * @return a dropdown with given title and collection of data
         *         to be inserted into dropdown created in tableToDropdown
         */
        var $newDropdown = getDropdown(dropdownClass);
        $newDropdown.children('button').html(infoArray[0]+'<span class="caret"></span>');
        $newDropdown.children('ul').children('li').children('a').html(infoArray[1]);
        for (var i = 2; i < infoArray.length; i++) {
            getDropdownRow(dropdownClass).html(infoArray[i]).insertAfter($('ul').children('li').last());     
        }
        return $newDropdown;
    };
    
    var tableToDropdown = function(tableClass, dropdownClass, includeFooter, rowsFirst) {
        /*
         * creates a nested dropdown out of the table provided
         * @param tableClass is the class name of table to be converted
         *        dropdownClass is the name of the dropdown template used
         *        includeFooter is a boolean to indicate if table footer should 
         *          be used
         *        rowsFirst is a boolean to indicate if rows should the first
         *          layer of dropdown
         * @return a nested dropdown, ready to be inserted into the DOM
         */
        var tableData = getDataTable(tableClass, includeFooter);
        var $masterDropdown;
        var dropdownChoices = [];
        if (rowsFirst) {
            var rowChoices = [];
            var rowDropdownData = [];
            for (var i = 0; i < tableData.length; i++) {
                for (var j = 0; j < tableData[0].length; j++) {
                    if (j === 0) {
                        rowChoices.push(tableData[i][j]);
                        if (i > 0) {
                            rowDropdownData.push([tableData[i][j]]);
                        }
                    }
                    else if (i === 0) {
                        break;
                    }
                    else {
                        rowDropdownData[i-1].push(tableData[0][j]+' - ' +tableData[i][j]);
                    }
                }
            }
            $masterDropdown = listToDropdown(rowChoices, dropdownClass);
            for (var i = 0; i < rowDropdownData.length; i++) {
                dropdownChoices[i] = listToDropdown(rowDropdownData[i], dropdownClass);
            }
        }
        else {
            var colChoices = tableData[0];
            var colDropdownData = [];
            for (var i = 1; i < tableData.length; i++) {
                for (var j = 0; j < tableData[0].length; j++) {
                    if (j === 0) {
                        colDropdownData.push([tableData[i][j]]);
                    }
                    else {
                        colDropdownData[i-1].push(tableData[0][j]+' - '+tableData[i][j]);
                    }
                }
            }
            $masterDropdown = listToDropdown(colChoices, dropdownClass);
            for (var i = 0; i < colDropdownData.length; i++) {
                dropdownChoices[i] = listToDropdown(colDropdownData[i], dropdownClass);
            }
        }
        
        
    };
    console.log(getDataTable('.iAmTarget', true));  
        
        
        
    
    //moveRightDropdown();
    
//});

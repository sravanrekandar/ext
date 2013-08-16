/*
* CustomDatePicker (Extended from DatePicker)
* Provides to set the buttons 'Account Open date' and 'Group Open Date' along with 'Today' button
* Example: 
		Ext.create('Ext.panel.Panel', {
			title: 'Choose a future date:',
			requires:['Ext.picker.CustomDate'],
			//width: 200,
			bodyPadding: 10,
			renderTo: Ext.getBody(),
			items: [{
				xtype: 'customdatepicker',
				dayButtons: [
					{	text: 'Account Open Day',
						targetDate: '11/11/11'
					},{	text: 'Group Open Day',
						targetDate: '12/13/13'
					},{	text: 'Birth Day',
						targetDate: '07/04/90'
					}
				],
				handler: function(picker, date) {
					// do something with the selected date
				}
			}]
		});
*/
Ext.define('Ext.picker.CustomDate', {
    extend: 'Ext.picker.Date',
    alias: 'widget.customdatepicker',
    alternateClassName: 'Ext.CustomDatePicker',
    renderTpl: [
        '<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<a id="{id}-prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" ></a>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<a id="{id}-nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" ></a>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="row">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            // the href attribute is required for the :hover selector to work in IE6/7/quirks
                            '<a role="presentation" hidefocus="on" class="{parent.baseCls}-date" href="#"></a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl>',
                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer custom-date-picker-footer">',
					'<tpl if="showToday">',
						'{%this.renderTodayBtn(values, out)%}',
					'</tpl>',
					'<tpl for="dayButtons">',
						'{%this.renderNewDayButton(values, out)%}',
					'</tpl>',
				'</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },renderNewDayButton: function(values, out) {
                Ext.DomHelper.generateMarkup(values.btn.getRenderTree(), out);
            },renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
	dayButtons: [],
   // private, inherit docs
    initComponent : function() {
        var me = this;
        me.todayCls = me.baseCls + '-today';
        me.callParent();
    },
    beforeRender: function () {

        var me = this,
			targetDate,
			day;
			
		// Creating the User Specified Day Buttons List
		for(var i = 0, len = me.dayButtons.length; i < len; i++) {
			day = me.dayButtons[i];
			
			targetDate = new Date(day.targetDate);
			if(targetDate == 'Invalid Date') {
				console.error("Invalid Date, Setting to Today");
				targetDate = new Date();
			}
			targetDate = Ext.Date.format(targetDate, me.format);

			day.btn = new Ext.button.Button({
                ownerCt: me,
                ownerLayout: me.getComponentLayout(),
                text: Ext.String.format(day.text),
                tooltip: Ext.String.format(targetDate),
                tooltipType: 'title',
				targetDate: targetDate,
                handler: me.selectThisDay,
                scope: me
            });			
		}

        me.callParent();

        Ext.applyIf(me, {
            renderData: {}
        });

        Ext.apply(me.renderData, {
			dayButtons: me.dayButtons,
			selectThisDay: me.selectThisDay
        });
    },
    finishRenderChildren: function () {
        var me = this;
        
        me.callParent();
		
		for(var i = 0, len = me.dayButtons.length; i < len; i++) {
			me.dayButtons[i].btn.finishRender();
		}
    },
	selectThisDay : function(el){
        var me = this,
            btn = el,
            handler = me.handler,
			targetDate = new Date(el.targetDate);
        if(btn && !btn.disabled){
            me.setValue(Ext.Date.clearTime(targetDate));
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }		
        return me;
    }
});

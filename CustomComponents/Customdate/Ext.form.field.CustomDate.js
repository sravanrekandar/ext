/*
*	Custom Date Fields Extends DateField,
*	Provides the Custom Date Picker
*
*	Example:	
	Ext.create('Ext.form.Panel', {
		renderTo: Ext.getBody(),
		width: 300,
		bodyPadding: 10,
		title: 'Dates',
		items: [{
			xtype: 'customdatefield',
			anchor: '100%',
			fieldLabel: 'From',
			name: 'from_date',
			maxValue: new Date()  // limited to the current date or prior
		}, {
			xtype: 'customdatefield',
			anchor: '100%',
			fieldLabel: 'To',
			name: 'to_date',
			value: new Date(),  // defaults to today
			dayButtons: [
				{	text: 'Account Open Day',
					targetDate: '11/11/11'
				},{	text: 'Group Open Day',
					targetDate: '12/13/13'
				},{	text: 'Birth Day',
					targetDate: '05/25/84'
				}
			]
		}]
	});

 */
Ext.define('Ext.form.field.CustomDate', {
    extend:'Ext.form.field.Date',
    alias: 'widget.customdatefield',
    requires: ['Ext.picker.CustomDate'],
    alternateClassName: ['Ext.form.CustomDateField', 'Ext.form.CustomDate'],


    createPicker: function() {
        var me = this,
            format = Ext.String.format;
		// custom
		me.dayButtons = me.dayButtons || [];
        return new Ext.picker.CustomDate({
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
			dayButtons: me.dayButtons,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    }
});

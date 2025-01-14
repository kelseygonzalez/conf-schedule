document.addEventListener('DOMContentLoaded', function() {
  var timeZoneSelectorEl = document.getElementById('time-zone-selector');
  timeZone = document.getElementById('time-zone-selector').value;
  var loadingEl = document.getElementById('loading');
  var calendarEl = document.getElementById('calendar');
  evnt = {
    url: "workshops.json", //your url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      //based on the dropdown changetimezone of each event
      //console.log(moment.tz('2021-07-06 07:00', 'America/Los_Angeles').format());

      let updatedTime = [];
      $.each(data, function(k, v) {
        v.start = moment.tz(v.start, timeZone).format();
        v.end = moment.tz(v.end, timeZone).format();
        updatedTime[k] = v;
      });
      //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
      return updatedTime;
    }
  };
  var calendar = new FullCalendar.Calendar(calendarEl, {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    views: {
      timeGridWeek: {
        type: 'timeGridWeek',
        nowIndicator: true,
        businessHours: true,
        firstHour: '8:00',
        //slotMinTime: '8:00',
        //slotMaxTime: '18:00',
        weekends: false,
        visibleRange: {
          start: '2021-05-17',
          end: '2021-05-21'
        },
        buttonText: 'Week'
      }
    },
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,listWeek,timeGridDay'
    },
    initialDate: '2021-05-17',
    titleFormat: { // will produce something like "Tuesday, September 18, 2018"
      month: 'long',
      year: 'numeric',
      day: 'numeric'
    },
    initialView: 'timeGridWeek',
    businessHours: true,
    height: "auto",
    slotDuration: "00:30:00",
    defaultTimedEventDuration: "00:30:00",
    navLinks: true, // can click day/week names to navigate views
    editable: false,
    selectable: true,
    dayMaxEvents: true, // allow "more" link when too many events


    eventDidMount: function(info) {
      var tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.description,
        placement: 'right',
        trigger: 'hover click',
        animation: true,
        html: true,
        container: 'body'
      });
    },
    //dayHeaderContent: (args) => {
    //    return moment(args.date).format('dddd Do')
    //},

    events: evnt,
    timeZone: timeZone,
    // events: 'user2021.json',
    loading: function(bool) {
      if (bool) {
        loadingEl.style.display = 'inline'; // show
      } else {
        loadingEl.style.display = 'none'; // hide
      }
    },

    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }
  });

  calendar.render();

  // load the list of available timezones, build the <select> options
  // it's highly encouraged to use your own AJAX lib instead of using FullCalendar's internal util


  // when the timezone selector changes, dynamically change the calendar option
  timeZoneSelectorEl.addEventListener('change', function() {
    timeZone = document.getElementById('time-zone-selector').value;

    var eventSource = [];
    eventSource = calendar.getEventSources();
    $.each(eventSource, function(key, value) {
      value.remove();
    });
    calendar.addEventSource(evnt);
    //console.log(eventSource);
    calendar.refetchEvents(); //calendar.setOption('events', evnt);
  });

});

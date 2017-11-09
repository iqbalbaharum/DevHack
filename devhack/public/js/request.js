$(function () {

  // var serverUrl = 'http://35.194.187.247:8080/';
  var serverUrl = "http://localhost:3002/";

  // Load all tab
  loadAllHappening();
  loadHappeningByType('meetup');
  loadHappeningByType('hackathon');


  /************************************************/
  // Loads non-expiry happening record
  /************************************************/
  function loadHappeningByType(happeningType) {

    console.log('loadMeetupHappening');

    $.ajax({
      method: 'GET',
      url: serverUrl + 'happening/type/' + happeningType,
      contentType: 'application/json',
      crossOrigin: true,
      dataType: "json",
      cache: false,
      success: function(response) {

        var source = $("#templateHappening").html();
        var template = Handlebars.compile(source);

        var happenings = [];

        $.each(response, function(i, happening) {
            happenings.push(formatHappening(happening));
        });

        console.log(happenings);

        $('#' + happeningType + ' ul').html(template(happenings));
      }
    });
  }

  /************************************************/
  // Loads all happening record
  /************************************************/
  function loadAllHappening() {

    console.log('loadAllHappening()');

    $.ajax({
      method:'GET',
      url: serverUrl + 'happening',
      contentType: 'application/json; charset=utf-8',
      crossOrigin: true,
      dataType: "json",
      cache: false,
      success: function(response) {

        var source = $("#templateHappening").html();
        var template = Handlebars.compile(source);

        var happenings = [];

        $.each(response, function(i, happening) {
            happenings.push(formatHappening(happening));
        });

        $('#all ul').html(template(happenings));
      }
    });
  }

  /************************************************/
  // Loads a happening
  /************************************************/
  function loadAHappening(id) {

    $.ajax({
      method: 'GET',
      url: serverUrl + 'happening/' + id,
      contentType: 'application/json',
      success: function(response) {
          $(".header").html(response.title);

          var dateTime = response.date + " | " + response.start_time + " - " + response.end_time;
          $('.info').html(dateTime);

          $('.description').html(response.description);
          var participant = data.registration_no + "/" + data.total_registration + " participants";
          $('.participant').html(participant);
      }
    });

  }

  /************************************************/
  // Reformat Happening JSON
  /************************************************/
  function formatHappening(happening) {

    var startDate = new Date(happening.event_start_date);
    var endDate = new Date(happening.event_end_date);

    var json = {
      id: happening._id,
      image: happening.image,
      title: happening.title,
      start_date: $.format.date(startDate, 'mmm d, yyyy'),
      end_date: $.format.date(startDate, 'HH:MM'),
      current: happening.attendees.length,
      max: happening.max
    }

    return json;
  }
});

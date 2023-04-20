import moment from "moment";

function formattedDate(dateStr) {
  const date = moment(dateStr);
  return date.format("MMM, DD, YYYY ");
}

function formattedTime(dateStr) {
  const date = moment(dateStr);
  return date.format("h:mm A");
}

function formatCountryHolidays(holidays) {
  return holidays.map((holiday) => {
    let startDate = moment(holiday.date.iso, "YYYYMMDDTHHmmss");
    let startMonth = startDate.get("month") + 1;
    let startArray = [
      startDate.get("year"),
      startMonth,
      startDate.get("date"),
      startDate.get("hour"),
      startDate.get("minute"),
    ];
    // console.log("startArray=", startArray, holiday.name);

    let endArray;

    let endDate = moment(startDate).add(1, "day");

    if (endDate.get("month") + 1 !== startMonth) {
      // end date is in a different month than start date
      endArray = [
        endDate.get("year"),
        endDate.get("month") + 1,
        1, // set date to 1 for first day of the next month
        endDate.get("hour"),
        endDate.get("minute"),
      ];
    } else {
      // end date is in the same month as start date

      endArray = [
        endDate.get("year"),
        endDate.get("month") + 1,
        endDate.get("date"),
        endDate.get("hour"),
        endDate.get("minute"),
      ];
    }
    // console.log(
    //   "Date formats:",

    //   holiday.name,
    //   startArray,
    //   endArray
    // );

    return {
      title: holiday.name,
      start: startArray,
      end: endArray,
      description: holiday.primary_type + "-" + holiday.description,
    };
  });
}

function formattedEvents(events) {
  return events.map((event) => {
    let startDate = moment(event.start, "YYYYMMDDTHHmmss");
    let startMonth = startDate.get("month") + 1;
    let startArray = [
      startDate.get("year"),
      startMonth,
      startDate.get("date"),
      startDate.get("hour"),
      startDate.get("minute"),
    ];

    let endDate = moment(event.end, "YYYYMMDDTHHmmss");
    let endMonth = endDate.get("month") + 1;
    let endArray = [
      endDate.get("year"),
      endMonth,
      endDate.get("date"),
      endDate.get("hour"),
      endDate.get("minute"),
    ];
    // console.log("Formatting events:", events);
    // console.log(event.reminder);
    const reminder = event.reminder;

    return {
      title: event.title,
      start: startArray,
      end: endArray,

      description: event.description,
      location: event.location,
      ...(event.url && { url: event.url }),

      ...(event.recurrence && {
        recurrenceRule:
          "FREQ=" + event.recurrence + ";INTERVAL=1;COUNT=" + event.repeat,
      }),

      ...(event.reminder && {
        alarms: [
          {
            action: "audio",
            description: "Reminder",
            trigger: { hours: reminder, minutes: 0, before: true },
          },
        ],
      }),
    };
  });
}

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "_") // collapse whitespace and replace by -
    .replace(/-+/g, "_"); // collapse dashes

  return str;
}

export {
  formattedEvents,
  formattedDate,
  formattedTime,
  formatCountryHolidays,
  string_to_slug,
};

//   const time = "19740108T054400";
//   const formattedTime = moment(timeString, "YYYYMMDDTHHmmss")
//     .toArray()
//     .slice(0, 3)

//   console.log(formattedTime);

//   const timeString = "19740108T054400";
//   const date = moment(timeString, "YYYYMMDDTHHmmss");
//   const month = date.get("month") + 1;
//   const formattedTime = [date.get("year"), month, date.get("date")];

//   console.log(formattedTime);
//   start: moment(String(start), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
//   end: moment(String(end), "YYYYMMDDTHHmmss").toArray().slice(0, 3),

// const date = new Date(1991, 4, 27, 7, 50); // Note: month is zero-indexed
// const formattedDate = date.toLocaleString('en-CA', { timeZone: 'UTC' }).replace(', ', 'T');
// Output: "1991-05-27T07:50"

// function formatDate(date) {
//   const options = { year: "numeric", month: "short", day: "numeric" };
//   const formattedDate = new Date(
//     date[0],
//     date[1] - 1,
//     date[2],
//     date[3],
//     date[4]
//   );
//   return new Intl.DateTimeFormat("en-US", options).format(formattedDate);
// }

// function formatTime(date) {
//   const formattedTime = new Date(
//     date[0],
//     date[1] - 1,
//     date[2],
//     date[3],
//     date[4]
//   );
//   const options = { hour: "numeric", minute: "numeric", hour12: true };
//   return new Intl.DateTimeFormat("en-US", options).format(formattedTime);
// }

// function formatDateBack(date) {
//   const formattedDate = new Date(
//     date[0],
//     date[1] - 1,
//     date[2],
//     date[3],
//     date[4]
//   );

//   const year = formattedDate.getFullYear().toString();
//   const month = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
//   const day = ("0" + formattedDate.getDate()).slice(-2);
//   const hours = ("0" + formattedDate.getHours()).slice(-2);
//   const minutes = ("0" + formattedDate.getMinutes()).slice(-2);
//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// }

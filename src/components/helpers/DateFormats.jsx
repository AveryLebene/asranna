import moment from "moment";

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

function formattedDate(dateStr) {
  const date = moment(dateStr);
  return date.format("MMM, DD, YYYY ");
}

function formattedTime(dateStr) {
  const date = moment(dateStr);
  return date.format("h:mm A");
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

    return {
      title: event.title,
      start: startArray,
      end: endArray,
      description: event.description,
      location: event.location,
    };
  });
}

export { formattedEvents, formattedDate, formattedTime };

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

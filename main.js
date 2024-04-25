const fs = require("fs");
const xml2js = require("xml2js");

async function searchMeetings(xmlFilePath, searchDate) {
  try {
    const data = await fs.promises.readFile(xmlFilePath, "utf-8");
    const result = await xml2js.parseStringPromise(data);
    const meetings = result.Meetings.Meeting;
    const meetingsOnDate = meetings.filter(
      (meeting) => meeting.Date[0] === searchDate
    );
    return meetingsOnDate;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

async function main(xmlFilePath, searchDate) {
  try {
    const meetings = await searchMeetings(xmlFilePath, searchDate);
    const template = await fs.promises.readFile("data/styles.html", "utf-8");
    const htmlContent = template.replace(
      "<!-- Replace this part with your filtered data -->",
      meetings
        .map(
          (meeting) => `
          <tr>
            <td>${meeting.Date[0]}</td>
            <td>${meeting.Time[0]}</td>
            <td>${meeting.With[0]}</td>
            <td>${meeting.Place[0]}</td>
          </tr>
        `
        )
        .join("")
    );
    await fs.promises.writeFile("data/output.html", htmlContent, "utf-8");
    console.log("Transformation complete. Result saved to output.html");
  } catch (err) {
    console.error("Error:", err);
  }
}

main("data/file1.xml", "2024-04-17");

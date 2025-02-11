import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Get today's date
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // January is 0, February is 1, etc.
  const currentYear = today.getFullYear();

  // Create the calendar for the month
  const getCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    const daysInMonth = [...Array(lastDateOfMonth)].map(
      (_, index) => index + 1
    );
    const calendarRows = [];
    let daysRow = Array(7).fill(null);

    // Fill first row with the correct start day (e.g. if the 1st is a Tuesday, add empty cells until Tuesday)
    let dayIndex = 0;
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysRow[i] = null;
    }

    // Fill the rest of the days
    daysRow[firstDayOfMonth] = daysInMonth[dayIndex++];
    calendarRows.push([...daysRow]);

    // Continue filling the rest of the month
    while (dayIndex < lastDateOfMonth) {
      daysRow = Array(7).fill(null);
      for (let i = 0; i < 7 && dayIndex < lastDateOfMonth; i++) {
        daysRow[i] = daysInMonth[dayIndex++];
      }
      calendarRows.push([...daysRow]);
    }

    return calendarRows;
  };

  const calendarRows = getCalendar();

  return (
    <footer className="bg-green-600 py-6 px-4">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <div className="flex lg:block">
              <div className="flex justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-16 lg:w-24 w-16"
                />
              </div>
              <span className="ml-2 lg:text-lg font-bold text-black my-auto">
                চট্টগ্রাম মহানগর বিএনপি
              </span>
            </div>
          </Link>
        </div>

        <div className="text-white space-y-2">
          <h2 className="font-bold text-lg">ঠিকানা</h2>
          <p className="text-sm">নসিমন ভবন, কাজীর দেউড়ী, চট্টগ্রাম 4000</p>
          <h2 className="font-bold text-lg mt-4">ইমেইল</h2>
          <p className="text-sm">bnpchittagongcity@gmail.com</p>
          <h2 className="font-bold text-lg mt-4">যোগাযোগ</h2>
          <p className="text-sm">+৮৯০১৬</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center font-bold text-green-700 mb-2">
            {currentMonth + 1} - {currentYear}
          </div>
          <table className="w-full text-center">
            <thead>
              <tr className="text-red-600">
                <th>রবি</th>
                <th>সোম</th>
                <th>মঙ্গল</th>
                <th>বুধ</th>
                <th>বৃহস্পতি</th>
                <th>শুক্র</th>
                <th>শনি</th>
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`p-2 ${
                        day === currentDay
                          ? "bg-blue-500 text-white font-bold"
                          : ""
                      } ${!day ? "text-gray-400" : ""}`}
                    >
                      {day}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

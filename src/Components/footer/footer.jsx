import { Link } from "react-router-dom";

const Footer = () => {
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
            মার্চ ২০২৪
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
              {[...Array(5)].map((_, weekIndex) => (
                <tr key={weekIndex}>
                  {[...Array(7)].map((_, dayIndex) => {
                    const day = weekIndex * 7 + dayIndex - 4;
                    return (
                      <td
                        key={dayIndex}
                        className={`p-2 ${
                          day === 0 || day > 31 ? "text-gray-400" : ""
                        } ${dayIndex === 0 ? "text-red-600" : ""}`}
                      >
                        {day > 0 && day <= 31 ? day : ""}
                      </td>
                    );
                  })}
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

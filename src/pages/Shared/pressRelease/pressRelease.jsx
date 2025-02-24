import React, { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";

const PressRelease = () => {
  const [pressReleases, setPressReleases] = useState([]);

  useEffect(() => {
    fetch("https://bnp-api-9oht.onrender.com/content/PRESS_RELEASE")
      .then((response) => response.json())
      .then((data) => setPressReleases(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pressReleases.map((release) => (
        <div key={release.id} className="card p-4 border rounded-lg shadow-lg">
          <img src={release.image} alt="" />
          <h3 className="text-xl font-semibold">{release.title}</h3>
          <p>{release.message}</p>
          <Link
            to={`/pressRelease/${release.id}`}
            className="text-blue-500 hover:underline mt-2 block"
          >
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PressRelease;

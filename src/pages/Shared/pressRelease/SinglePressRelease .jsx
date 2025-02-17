import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePressRelease = () => {
  const { id } = useParams();
  const [pressRelease, setPressRelease] = useState(null);

  useEffect(() => {
    fetch(`https://bnp-api-9oht.onrender.com/content/PRESS_RELEASE/${id}`)
      .then((response) => response.json())
      .then((data) => setPressRelease(data));
  }, [id]);

  if (!pressRelease) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{pressRelease.title}</h1>
      <p>{pressRelease.message}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default SinglePressRelease;

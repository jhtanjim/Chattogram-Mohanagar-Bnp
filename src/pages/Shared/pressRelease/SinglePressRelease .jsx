import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePressRelease = () => {
  const { id } = useParams();
  const [pressRelease, setPressRelease] = useState(null);

  useEffect(() => {
    fetch(`https://bnp-api-9oht.onrender.com/content/item/${id}`)
      .then((response) => response.json())
      .then((data) => setPressRelease(data));
  }, [id]);

  if (!pressRelease) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <img
        src={pressRelease.image}
        alt={pressRelease.title}
        className="w-full h-72 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {pressRelease.title}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{pressRelease.message}</p>
        <div className="text-gray-500 text-sm">
          <span>
            Published on:{" "}
            {new Date(pressRelease.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SinglePressRelease;

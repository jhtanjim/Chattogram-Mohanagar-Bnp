import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UniversalLoading from "../../../Components/UniversalLoading";

const SingleDofa = () => {
  const { id } = useParams();
  const [dofa, setDofa] = useState(null);

  useEffect(() => {
    fetch(`https://bnp-api-9oht.onrender.com/content/item/${id}`)
      .then((response) => response.json())
      .then((data) => setDofa(data));
  }, [id]);

  if (!dofa) {
    return <UniversalLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8">
      <img
        src={dofa.image}
        alt={dofa.title}
        className="w-full h-80 object-cover"
      />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{dofa.title}</h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{dofa.message}</p>
        <div className="text-gray-500 text-sm">
          Published on: {new Date(dofa.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default SingleDofa;
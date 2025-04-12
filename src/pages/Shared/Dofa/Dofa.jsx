import { div } from "framer-motion/client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dofa = () => {
  const [Dofas, setDofas] = useState([]);

  useEffect(() => {
    fetch("https://bnp-api-9oht.onrender.com/content/DOFA")
      .then((response) => response.json())
      .then((data) => setDofas(data));
  }, []);

  return (
<div>
<h3 className="text-2xl text-center font-bold">দফা</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">



      {Dofas.map((release) => (
        <div key={release.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={release.image} alt={release.title} className="w-full h-56 object-cover" />
          <div className="p-5">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{release.title}</h3>
            <p className="text-gray-600 line-clamp-3">{release.message}</p>
            <Link
              to={`/dofa/${release.id}`}
              className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-800"
            >
              Read more →
            </Link>
          </div>
        </div>
      ))}
    </div>
</div>
  );
};

export default Dofa;

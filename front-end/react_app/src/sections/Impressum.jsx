import React from "react";

function Impressum() {
  return (
    <div className="lg:w-1/2  flex justify-center mt-20">
      <div>
        <p className="navbarLink">Impressum:</p>
        <ul className="space-y-1">
          <li>
            <p>Name: {import.meta.env.IMPRESSUM_NAME}</p>
          </li>
          <li>
            <p>Mail: {import.meta.env.IMPRESSUM_ADRESS}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Impressum;

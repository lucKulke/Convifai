import React from "react";

function Impressum() {
  return (
    <div className="lg:w-1/2  flex justify-center mt-20">
      <div>
        <p className="navbarLink">Impressum:</p>
        <ul className="space-y-1">
          <li>
            <p className="">Name: Lucas Kulke</p>
          </li>
          <li>
            <p>Adress: Brehmestr. 25 13187 Berlin</p>
          </li>
          <li>
            <p>Phone: +49 151 23128982</p>
          </li>
          <li>
            <p>Mail: lucaskulke98@gmail.com</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Impressum;

import React, { useState } from "react";

function CategoryDropdown(props) {
  const [selectedOption, setSelectedOption] = useState("");
  const categories = [
    { name: "Cake" },
    { name: "Cupcakes" },
    { name: "Bread" },
    { name: "CNY" },
    { name: "Pies" },
    { name: "Tarts" },
    { name: "Christmas" },
    { name: "Birthday" },
    { name: "Wedding" },
    { name: "Graduation" },
    { name: "Cookies" },
    { name: "Halal" },
    { name: "Fried" },
    { name: "Fruits" },
    { name: "Unique" },
    { name: "Christmas" },
    { name: "Birthday" },
    { name: "Wedding" },
    { name: "Graduation" },
  ];

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    props.onCategoryChange(selectedValue);
  };

  return (
    <select
      style={{ fontFamily: "Montserrat" }}
      value={selectedOption}
      onChange={handleDropdownChange}
    >
      {categories.map((option) => (
        <option value={option.name} key={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
//key={option.id}

export default CategoryDropdown;

import { useEffect, useState } from "react";
import { formatCountryHolidays, string_to_slug } from "./helpers/Formats";
import { createEvents } from "ics";
import FileSaver from "file-saver";

import { BsDownload } from "react-icons/bs";

import year from "./helpers/date";
import countryFlagEmoji from "country-flag-emoji";

const api_key = import.meta.env.VITE_API_KEY;
const base_url = import.meta.env.VITE_BASE_URL;

const CountryHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("GH");

  let countries = countryFlagEmoji.list;

  const defaultCountry = countries.filter(
    (country) => country.name === "Ghana"
  );

  const selectedCountry = countries.find(
    (country) => country.code === inputValue
  );
  const selectCountryName = selectedCountry.name;
  const name_slug = string_to_slug(selectCountryName);
  //   console.log("country_name=", countryName);
  //   console.log("selectedCountry=", selectedCountry);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  useEffect(() => {
    const getHolidays = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${base_url}/holidays?&api_key=${api_key}&country=${inputValue}&year=${year}`
        );
        const data = await response.json();

        const allHolidays = data.response.holidays;
        const filteredHolidays = allHolidays.filter(
          (holiday) => holiday.locations === "All"
        );
        setHolidays(filteredHolidays);
        // console.log("holidays=", holidays, holidays[0].country.name);
      } catch (error) {
        console.log(error);
        alert("No holidays found for " + selectCountryName);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getHolidays();
  }, [inputValue]);

  const handleDownloadCountryHolidays = async () => {
    const formatted = formatCountryHolidays(holidays);
    // console.log("formatted=", formatted);
    const { error, value } = createEvents(formatted);
    if (error) {
      console.log(error);
    } else {
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      FileSaver.saveAs(blob, "asranna_" + name_slug + "_holidays.ics");
    }
    // console.log("value=", value);
  };

  return (
    <div className="countries-input">
      <label htmlFor="countries">Download {year} holidays for</label>

      <select
        name="countries"
        id="countries"
        onChange={handleInputChange}
        value={inputValue}
      >
        <option value={defaultCountry[0].code}>
          {defaultCountry[0].name} {defaultCountry[0].emoji}
        </option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} {country.emoji}
          </option>
        ))}
      </select>
      {/*
      {holidays.length === 0 && (
        <p className="mr-2">No holidays found for {selectCountryName} </p>
      )} */}

      {loading ? (
        <button>🌀</button>
      ) : (
        <button onClick={handleDownloadCountryHolidays}>
          here <BsDownload />{" "}
        </button>
      )}
    </div>
  );
};

export default CountryHolidays;

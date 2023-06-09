import { useEffect, useState } from "react";
import { createEvents } from "ics";
import FileSaver from "file-saver";
import countryFlagEmoji from "country-flag-emoji";

import { BsDownload } from "react-icons/bs";

import year from "./helpers/date";
import { formatCountryHolidays, string_to_slug } from "./helpers/Formats";

const api_key = import.meta.env.VITE_API_KEY;
const base_url = import.meta.env.VITE_BASE_URL;

const CountryHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("GH");

  const countries = countryFlagEmoji.list;

  const defaultCountry = countries.find((country) => country.name === "Ghana");

  let selectedCountry = countries.find(
    (country) => country.code === inputValue
  );
  let selectCountryName = selectedCountry.name;
  let name_slug = string_to_slug(selectCountryName);

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
        setLoading(false);
      } catch (error) {
        console.log(error);

        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getHolidays();
  }, [inputValue]);

  const handleDownloadCountryHolidays = async () => {
    const formatted = formatCountryHolidays(holidays);
    if (formatted.length > 0) {
      const { error, value } = createEvents(formatted);
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
        FileSaver.saveAs(blob, "asranna_" + name_slug + "_holidays.ics");
      }
    } else {
      alert("No holidays found for " + selectCountryName);
    }
  };

  return (
    <div className="countries-input">
      <label htmlFor="countries">Download {year} holidays for</label>

      <select
        name="countries"
        id="countries"
        onChange={handleInputChange}
        value={inputValue || defaultCountry.code}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} {country.emoji}
          </option>
        ))}
      </select>

      {loading ? (
        <button className="loader">🌀</button>
      ) : (
        <button onClick={handleDownloadCountryHolidays}>
          here <BsDownload />{" "}
        </button>
      )}
    </div>
  );
};

export default CountryHolidays;

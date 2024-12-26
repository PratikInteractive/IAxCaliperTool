"use client";

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from 'sweetalert2';

const Page = () => {


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const formRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subIndustryOptions, setSubIndustryOptions] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [adPhoneNumber, setAdPhoneNumber] = useState("");
  const [adPhoneError, setAdPhoneError] = useState("");
  const [industryData, setIndustryData] = useState({});

  const [selectedState, setSelectedState] = useState(null);

  const [stateOptions, setStateOptions] = useState([]);
  const [stateData, setStateData] = useState({});

  const [subCityOptions, setSubCityOptions] = useState([]);
  const [selectedSubCity, setSselectedSubCity] = useState(null);

  
  const platformOptions = [
    { value: "Search", label: "Search" },
    // { value: "P-Max", label: "P-Max" },
  ];
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);

  const [radOptions] = useState([
    { label: "KILOMETERS", value: "KILOMETERS" },
    { label: "MILES", value: "MILES" },
  ]);
  const [selectedRadOption, setSelectedRadOption] = useState(radOptions[0]);
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No user_id found. Please log in.");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    const errorPin = validatePincode(pincode);
    if (errorPin) {
      setPincodeError(errorPin);
      return;
    }

    // Ad Phone
    const adPhoneValidationError = validatePhoneNumber(adPhoneNumber);
    if (adPhoneValidationError) {
      setAdPhoneError(adPhoneValidationError);
      return;
    }

    const formData = new FormData(formRef.current);
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    jsonObject.industry = selectedIndustry?.value || null;
    jsonObject.subIndustry = selectedSubIndustry?.value || null;
    jsonObject.state = selectedState?.value || null;
    jsonObject.city = selectedSubCity?.value || null;
    jsonObject.loggedInUser = userId;
    jsonObject.adPhoneNumber = adPhoneNumber;
    jsonObject.radiusUnit = jsonObject.radiusUnit =
      selectedRadOption?.value || null;

    console.log("Submitting JSON object:", jsonObject);

    try {
      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=createClientDataSetup`,
        jsonObject
      );
      console.log("Response received:", response.data);
      // alert("Form submitted successfully!");
      // window.location.href = "/admin/client-user-creation";
      Swal.fire({
        title: 'Success!',
        text: 'Client Data Entered Successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/admin/client-user-creation";
        }
      });
    } catch (error) {
      if (error.response) {
        console.error(
          `Failed to submit form. Status: ${error.response.status}, Text: ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error submitting form:", error.message);
      }
    }
  };

  // Fetch industry data
  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewIndustryDetails`
        );

        const data = response.data.industryVsSubindustryMap;
        setIndustryData(data); 

        const industries = Object.keys(data).map((industry) => ({
          label: industry,
          value: industry,
        }));

        setIndustryOptions(industries);
      } catch (error) {
        console.error("Error fetching industry data:", error.message);
      }
    };

    fetchIndustryData();
  }, []);

  const handleIndustryChange = (selectedOption) => {
    setSelectedIndustry(selectedOption);
    console.log("Selected Industry:", selectedOption); // Log selected industry

    // Get the sub-industry options for the selected industry
    const subIndustries = industryData[selectedOption.value] || [];
    console.log("Sub-industries for", selectedOption.value, ":", subIndustries); // Log corresponding sub-industries

    // Convert sub-industries to the format required by react-select
    const subIndustryOptionsFormatted = subIndustries.map((subIndustry) => ({
      label: subIndustry,
      value: subIndustry,
    }));

    // Update sub-industry options
    setSubIndustryOptions(subIndustryOptionsFormatted);
    setSelectedSubIndustry(null); // Reset sub-industry selection
  };

  // Phone number validation
  const validatePhoneNumber = (value) => {
    if (!value) {
      return "Phone number is required";
    }
    if (value.length < 10) {
      return "Phone number must be 10 digits";
    }
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must contain only digits";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setPhoneError(error);
  };

  // Validate ad Phone number
  const handleAdPhoneChange = (e) => {
    const value = e.target.value;
    setAdPhoneNumber(value);
    const error = validatePhoneNumber(value); // Reuse the existing phone validation logic
    setAdPhoneError(error);
  };

  const validatePincode = (value) => {
    if (!value) {
      return "Pincode is required.";
    }
    if (!/^\d{6}$/.test(value)) {
      return "Pincode must be exactly 6 numeric digits.";
    }
    return "";
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;

    // Allow only numeric input and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);

      // Validate pincode whenever it changes
      const errorMessage = validatePincode(value);
      setPincodeError(errorMessage);
    }
  };

  // Fetch city and state data
  useEffect(() => {
    const fetchCityStateData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewGoogleLocations`
        );
  
        const data = response.data.completeMap.India;
  
        // Store state and city mapping
        setStateData(data);
  
        // Format state options for dropdown
        const states = Object.keys(data).map((state) => ({
          label: state,
          value: state,
        }));
  
        setStateOptions(states);
      } catch (error) {
        console.error("Error fetching city/state data:", error.message);
      }
    };
  
    fetchCityStateData();
  }, []);
  


  
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  
    if (selectedOption) {
      const cities = stateData[selectedOption.value] || [];
  
      // Format cities for dropdown
      const cityOptionsFormatted = cities.map((city) => ({
        label: city,
        value: city,
      }));
  
      setSubCityOptions(cityOptionsFormatted);
      setSselectedSubCity(null); // Reset city selection
    }
  };
  
  


  return (
    <div className="container mt-2">
      <h3 className="mb-2">Create New Client</h3>
      <div className="form_block">
        <form ref={formRef} onSubmit={handleSubmit} className="form_elements">
          <div className="form_element">
            <label>Client Business Name</label>
            <input type="text" name="clientName" placeholder="Business name (required)" required />
          </div>
          <div className="form_element select_form_element">
            <label>Select Industry</label>
            <Select
              options={industryOptions}
              value={selectedIndustry}
              onChange={handleIndustryChange}
              placeholder="Select Industry"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
              required
            />
          </div>

          <div className="form_element select_form_element">
            <label>Select Sub Industry</label>
            <Select
              options={subIndustryOptions}
              value={selectedSubIndustry}
              onChange={setSelectedSubIndustry}
              placeholder="Please Select"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
            />
          </div>
          <div className="form_element">
            <label>Client Email</label>
            <input type="email" name="clientEmail" placeholder="Email id (required)" required />
          </div>
          <div className="form_element">
            <label>Client Phone No.</label>
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={phoneError ? "error" : ""}
              maxLength={10}
              placeholder="Phone no. (required)"
            />

            {phoneError && <span className="error-message">{phoneError}</span>}
          </div>
          <div className="form_element select_form_element">
            <label>Select State</label>
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              placeholder="Select State"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
              required
            />
          </div>
          <div className="form_element select_form_element">
            <label>Select City</label>
            <Select
              options={subCityOptions}
              value={selectedSubCity}
              onChange={setSselectedSubCity}
              placeholder="Please Select a City"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
              required
            />
          </div>
          <div className="form_element">
            <label>Street Address 1</label>
            <input type="text" name="streetAddress1" placeholder="Address (optional)" />
          </div>
          <div className="form_element">
            <label>Street Address 2</label>
            <input type="text" name="streetAddress2" placeholder="Address (optional)" />
          </div>
          <div className="form_element">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode (required)"
              value={pincode}
              onChange={handlePincodeChange}
              className={pincodeError ? "error" : ""}
              min={6}
              max={6}
            />
            {pincodeError && (
              <span className="error-message">{pincodeError}</span>
            )}
          </div>
          <div className="form_element fw-100 mb-0">
            <h6>Client Data Setup</h6>
          </div>
          <div className="form_element">
            <label>Client Location Exclusion (optional)</label>
            <input
              type="text"
              name="locationExclusion"
              placeholder="Location Exclusion"
            />
          </div>
          <div className="form_element">
            <label>Call Ads Phone Number</label>
            <input
              type="tel"
              name="adPhoneNumber"
              placeholder="Phone no. (required)"
              value={adPhoneNumber}
              onChange={handleAdPhoneChange}
              className={adPhoneError ? "error" : ""}
              maxLength={10}
            />
            {adPhoneError && (
              <span className="error-message">{adPhoneError}</span>
            )}
          </div>
          <div className="form_element">
            <label>Landing Page URL</label>
            <input type="text" name="landingPageUrl" placeholder="Landing Page URL (required format https://)" pattern="https://.*" required />
          </div>
          {/* <div className="form_element">
            <label>YouTube URL</label>
            <input type="text" name="youtubeUrl" placeholder="Youtube URL (optional)" />
          </div> */}
          <div className="form_element">
            <label>Latitude</label>
            <input type="number" step="any" name="latitude" placeholder="Latitude in decimal (required)" min="0" required />
          </div>
          <div className="form_element">
            <label>Longitude</label>
            <input type="number" step="any" name="longitude" placeholder="Longitude in decimal (required)" min="0"  required />
          </div>
          <div className="form_element">
            <label>Radius</label>
            <input type="number" name="radius" placeholder="Please add (required)" required min="0" />
          </div>
          <div className="form_element select_form_element">
            <label>Select Radius</label>
            <Select
              options={radOptions}
              value={selectedRadOption}
              onChange={(selectedOption) =>
                setSelectedRadOption(selectedOption)
              }
              placeholder="Select Radius"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
              required
            />
          </div>
          <div className="form_element">
            <label>Objective</label>
            <input type="text" name="objective" placeholder="Enter your objective (required)" required />
          </div>
          <div className="form_element select_form_element">
            <label>Platform</label>
            <Select
              options={platformOptions}
              value={selectedPlatform}
              onChange={setSelectedPlatform}
              isClearable
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
              placeholder="Platform"
              required
            />
          </div>
          <div className="form_element submit_btn_element">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

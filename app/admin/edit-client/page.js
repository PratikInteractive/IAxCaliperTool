"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";  // Importing the Select component

export default function EditClientPage() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subIndustryOptions, setSubIndustryOptions] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(null);
  const [industryData, setIndustryData] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

    const [selectedState, setSelectedState] = useState(null);
  
    const [stateOptions, setStateOptions] = useState([]);
    const [stateData, setStateData] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);
    const [subCityOptions, setSubCityOptions] = useState([]);
    const [selectedSubCity, setSelectedSubCity] = useState(null);
  

      const [radOptions] = useState([
        { label: "KILOMETERS", value: "KILOMETERS" },
        { label: "MILES", value: "MILES" },
      ]);
      const [selectedRadOption, setSelectedRadOption] = useState(radOptions[0]);
    


  const clientName = searchParams.get("clientName");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const loggedInUser = sessionStorage.getItem("user_id");
        if (!clientName) {
          console.error("Client name is missing in the query parameter.");
          return;
        }

        // Payload for the API request
        const payload = { loggedInUser: loggedInUser };

        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewCaliperClients`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data && response.data.viewCaliperClientResponseList) {
          // Filter the data by clientName
          const matchedClient = response.data.viewCaliperClientResponseList.find(
            (client) => client.clientName === clientName
          );

          if (matchedClient) {
            setClientData(matchedClient);
            console.log("Matched Client Data:", matchedClient);
            
            // Set the default selected industry and sub-industry
            const defaultIndustry = matchedClient.caliperClientDataSetup.industry;
            const defaultSubIndustry = matchedClient.caliperClientDataSetup.subIndustry;
            const defaultClientType = matchedClient.clientType;
            const defaultEmail = matchedClient.clientEmail;
            const defaultLandingPageUrl = matchedClient.caliperClientDataSetup.landingPageUrl;
            const defaultYoutubeVideoUrl = matchedClient.caliperClientDataSetup.youtubeVideoUrl;
            const defaultPhoneNumber = matchedClient.caliperClientDataSetup.phoneNumber;

            setSelectedIndustry({ label: defaultIndustry, value: defaultIndustry });
            setSelectedSubIndustry({ label: defaultSubIndustry, value: defaultSubIndustry });


            const defaultState = matchedClient.caliperClientDataSetup?.state;
            const defaultCity = matchedClient.caliperClientDataSetup?.city;
            const defailtRadUnits = matchedClient.caliperClientDataSetup?.radiusUnit;


            console.log("Default State", defaultState);

            console.log("Default City", defaultCity);

            setSelectedState({ label: defaultState, value: defaultState });
            setSelectedCity({ label: defaultCity, value: defaultCity });

          } else {
            console.warn(`No client found with name: ${clientName}`);
          }
        } else {
          console.error(
            "API response is invalid or missing required data:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Error fetching client data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientName, apiUrl]);

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

        // If a default industry is set, populate sub-industry options for it
        if (selectedIndustry) {
          const subIndustries = data[selectedIndustry.value] || [];
          const subIndustryOptionsFormatted = subIndustries.map((subIndustry) => ({
            label: subIndustry,
            value: subIndustry,
          }));
          setSubIndustryOptions(subIndustryOptionsFormatted);
        }
      } catch (error) {
        console.error("Error fetching industry data:", error.message);
      }
    };

    fetchIndustryData();
  }, [apiUrl, selectedIndustry]);

  // Handle industry change
  const handleIndustryChange = (selectedOption) => {
    setSelectedIndustry(selectedOption);
    console.log("Selected Industry:", selectedOption);

    const subIndustries = industryData[selectedOption.value] || [];
    console.log("Sub-industries for", selectedOption.value, ":", subIndustries);

    const subIndustryOptionsFormatted = subIndustries.map((subIndustry) => ({
      label: subIndustry,
      value: subIndustry,
    }));

    setSubIndustryOptions(subIndustryOptionsFormatted);
    setSelectedSubIndustry(null); // Reset sub-industry selection
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
        const cities = stateData[selectedOption.value] || [];  // Ensure cities are available
        const cityOptionsFormatted = cities.map((city) => ({
          label: city,
          value: city,
        }));
        setSubCityOptions(cityOptionsFormatted);
      } else {
        setSubCityOptions([]);  // Clear city options if no state is selected
      }
    
      setSelectedSubCity(null);  // Reset city selection
    };
    
    
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = sessionStorage.getItem("user_id");
      const payload = {
        loggedInUser,
        ...clientData,
        industry: selectedIndustry ? selectedIndustry.value : clientData.industry,
        subIndustry: selectedSubIndustry ? selectedSubIndustry.value : clientData.subIndustry,
      };

      const response = await axios.post(
        "http://15.207.141.243:8080/web/pages/caliper/digitalEntrant/caliperSelfServeApi.jsp?action=editClientDataSetup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.success) {
        alert("Client data updated successfully!");
        router.push("/client-list");
      } else {
        console.error("Failed to update client data:", response.data);
      }
    } catch (error) {
      console.error("Error submitting client data:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!clientData) {
    return <p>No client data found for "{clientName}".</p>;
  }

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Editing Client</h3>
      <div className="form_block">
        <form className="form_elements" onSubmit={handleFormSubmit}>
          <div className="form_element">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Business name (required)"
              value={clientData.clientName || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Industry Start */}
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
          {/* Industry End */}

          <div className="form_element">
            <label>Client Type</label>
            <input
              type="text"
              name="clientType"
              placeholder="Client Type (required)"
              value={clientData.clientType || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form_element">
            <label>Client Email</label>
            <input
              type="email"
              name="clientEmail"
              placeholder="Client Email (required)"
              value={clientData.clientEmail || ""}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="form_element">
            <label>Client Phone No.</label>
            <input
              type="tel"
              name="phoneNumber"
              value={clientData.caliperClientDataSetup.phoneNumber || ""}
              maxLength={10}
              placeholder="Phone no. (required)"
            />
          </div>

          <div className="form_element">
            <label>Google Account ID (unique):</label>
            <input
              type="text"
              name="googleAccountId"
              value={clientData.caliperClientDataSetup.googleAccountId || ""}
              required
              placeholder="Please Enter (required)"
            />
          </div>

          <div className="form_element">
            <label>Platform</label>
            <input
              type="text"
              name="platform"
              value={clientData.caliperClientDataSetup.platform}
              required
              placeholder="Please Enter (required)"
            />
          </div>
          <div className="form_element">
            <label>Street Address 1</label>
            <input type="text" value={clientData.caliperClientDataSetup.streetAddress1} name="streetAddress1" placeholder="Address (optional)" />
          </div>
          <div className="form_element">
            <label>Street Address 2</label>
            <input type="text" value={clientData.caliperClientDataSetup.streetAddress2} name="streetAddress2" placeholder="Address (optional)" />
          </div>

          <div className="form_element">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode (required)"
              value={clientData.caliperClientDataSetup.pincode}
              min={6}
              max={6}
            />
          </div>

          <div className="form_element">
            <label>Call Ads Phone Number</label>
            <input
              type="tel"
              name="adPhoneNumber"
              placeholder="Phone no. (required)"
              value={clientData.caliperClientDataSetup.adPhoneNumber}
              maxLength={10}
            />
          </div>

      {/* State City Start */}
      <div className="form_element select_form_element">
            <label>Select State</label>
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              placeholder="Select Select"
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
              onChange={setSelectedSubCity}
              placeholder="Please Select"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  display: "block",
                }),
              }}
            />
          </div>
          {/* State City Start */}

          <div className="form_element">
            <label>Latitude</label>
            <input type="number" step="any" value={clientData.caliperClientDataSetup.latitude || "" } name="latitude" placeholder="Latitude in decimal (required)" min="0" required />
          </div>
          <div className="form_element">
            <label>Longitude</label>
            <input type="number" step="any" value={clientData.caliperClientDataSetup.longitude || "" } name="longitude" placeholder="Longitude in decimal (required)" min="0"  required />
          </div>
          <div className="form_element">
            <label>Radius</label>
            <input type="number" name="radius" value={clientData.caliperClientDataSetup.radius || "" } placeholder="Please add (required)" required min="0" />
          </div>
          {/* <div className="form_element select_form_element">
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
          </div> */}
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
          <div className="form_element submit_btn_element">
            <button type="submit" className="btn p-button p-component">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

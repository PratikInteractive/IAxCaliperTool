// Validations Pending
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import Swal from "sweetalert2";

export default function EditClientPage() {

  const role = localStorage.getItem('role');
  console.log("Client Dashboard Role", role);
  if(role !== "admin") {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    localStorage.removeItem("role");
    window.location.href = "/unauthorized";
  }


  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateData, setStateData] = useState({});
  const [subCityOptions, setSubCityOptions] = useState([]);
  const [selectedSubCity, setSselectedSubCity] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subIndustryOptions, setSubIndustryOptions] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(null);
  const [industryData, setIndustryData] = useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const radiusUnitOptions = [
    { value: "KILOMETERS", label: "Kilometers" },
    { value: "MILES", label: "Miles" },
  ];

  const platformOptions = [
    { value: "Search", label: "Search" },
    // { value: "P-Max", label: "P-Max" },
  ];
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);


  const [clientName, setClientName] = useState("");
  console.log("Client Name", clientName);

  // Safely fetch client name from sessionStorage in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("clientName");
      setClientName(name || "");
    }
  }, []);
  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const loggedInUser = sessionStorage.getItem("user_id");
        if (!loggedInUser) {
          console.error("Please Log in");
          return;
        }

        const payload = { loggedInUser };
        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewCaliperClients`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.viewCaliperClientResponseList) {
          const matchedClient =
            response.data.viewCaliperClientResponseList.find(
              (client) => client.clientName === clientName
            );

          if (matchedClient) {
            setClientData(matchedClient);
            setFormValues({
              ...matchedClient.caliperClientDataSetup,
              clientEmail: matchedClient.clientEmail,
            });
            console.log("Matched Client Data:", matchedClient);
          } else {
            console.warn(`No client found with name: ${clientName}`);
          }
        } else {
          console.error("API response is invalid:", response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching client data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientName, apiUrl]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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

  // Fetching State and City
  useEffect(() => {
    const fetchCityStateData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewGoogleLocations`
        );

        const data = response.data.completeMap.India;
        console.log("State City Data", data);
        setStateData(data);

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
      const cityOptionsFormatted = cities.map((city) => ({
        label: city,
        value: city,
      }));

      setSubCityOptions(cityOptionsFormatted);
      setSselectedSubCity(null); // Reset city selection
    }
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=editClientDataSetup`,
        {
          loggedInUser: sessionStorage.getItem("user_id"),
          ...formValues,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Form Values", formValues);

      if (response.data?.result == "success") {
        console.log("Client updated successfully:", response.data);
        // window.location.href = "/admin/dashboard"; // Redirect to client list or another page
        Swal.fire({
          title: "Success!",
          text: "Client Edited Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/dashboard";
          }
        });
      } else {
        console.error("Failed to update client:", response.data?.message);
        Swal.fire({
          title: "Something went wrong!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/edit-client";
          }
        });
      }
    } catch (error) {
      console.error(
        "Error updating client:",
        error.response?.data || error.message
      );
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
      <h2 className="mb-2">Editing Client</h2>
      <div className="form_block">
        <form className="form_elements" onSubmit={handleSubmit}>
          <div className="form_element">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Business name (required)"
              value={formValues.clientName || ""}
              onChange={handleChange}
              required
              readOnly
            />
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
            <label>Landing Page URL</label>
            <input
              type="url"
              name="landingPageUrl"
              placeholder="Landing Page URL"
              value={formValues.landingPageUrl || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element">
            <label>Client Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formValues.phoneNumber || ""}
              onChange={handleChange}
            />
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
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formValues.pincode || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Enter Street Address 1</label>
            <input
              type="text"
              name="streetAddress1"
              placeholder="Please Enter "
              value={formValues.streetAddress1 || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element">
            <label>Enter Street Address 2</label>
            <input
              type="text"
              name="streetAddress2"
              placeholder="Please Enter "
              value={formValues.streetAddress2 || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Location Exclusion</label>
            <input
              type="text"
              name="locationExclusion"
              placeholder="Please Enter "
              value={formValues.locationExclusion || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Ad Phone Number</label>
            <input
              type="tel"
              name="adPhoneNumber"
              placeholder="Phone Number"
              value={formValues.adPhoneNumber || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Google Account ID (unique):</label>
            <input
              type="text"
              name="googleAccountId"
              value={formValues.googleAccountId || ""}
              onChange={handleChange}
              required
              placeholder="Please Enter (required)"
            />
          </div>

          <div className="form_element">
            <label>Latitude</label>
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formValues.latitude || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Longitude</label>
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formValues.longitude || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element">
            <label>Radius</label>
            <input
              type="number"
              name="radius"
              placeholder="Radius"
              value={formValues.radius || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element select_form_element">
            <label>Radius Unit</label>
            <Select
              name="radiusUnit"
              options={radiusUnitOptions}
              value={radiusUnitOptions.find(
                (option) => option.value === formValues.radiusUnit
              )}
              onChange={(selectedOption) => {
                setFormValues({
                  ...formValues,
                  radiusUnit: selectedOption.value,
                });
              }}
              placeholder="Select Radius Unit"
            />
          </div>

          <div className="form_element">
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
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

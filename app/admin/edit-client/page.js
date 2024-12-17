// Validations Pending
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import Swal from "sweetalert2";

export default function EditClientPage() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientName = searchParams.get("clientName");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const radiusUnitOptions = [
    { value: "KILOMETERS", label: "Kilometers" },
    { value: "MILES", label: "Miles" },
  ];

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const loggedInUser = sessionStorage.getItem("user_id");
        if (!clientName) {
          console.error("Client name is missing in the query parameter.");
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

  // Fetching State and City
    // Fetch city and state data
    useEffect(() => {
      const fetchCityStateData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewGoogleLocations`
          );
    
          const data = response.data.completeMap.India;
          console.log("State City Data",data);
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
          <div className="form_element">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formValues.industry || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element">
            <label>Sub-Industry</label>
            <input
              type="text"
              name="subIndustry"
              placeholder="Sub-Industry"
              value={formValues.subIndustry || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form_element">
            <label>Client Email</label>
            <input
              type="email"
              name="clientEmail"
              placeholder="Email id (required)"
              value={formValues.clientEmail || ""}
              onChange={handleChange}
              required
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

          <div className="form_element">
            <label>Select State</label>
            <input
              type="text"
              name="state"
              placeholder="Please Enter State"
              value={formValues.state || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form_element">
            <label>Select City</label>
            <input
              type="text"
              name="city"
              placeholder="Please Enter City"
              value={formValues.city || ""}
              onChange={handleChange}
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
              value={formValues.googleAccountId}
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
            <input
              type="number"
              name="platform"
              placeholder="Platform"
              value={formValues.platform || ""}
              onChange={handleChange}
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

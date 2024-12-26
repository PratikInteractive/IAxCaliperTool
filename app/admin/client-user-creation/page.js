"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

const Page = () => {

  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    clientBusinessName: "",
    userId: "",
    password: "",
    keywords: [],
    clientType: "",
    googleAccountId: "",
    clientCode: "",
    loginCustomerId: "",
  });

  const [clientOptions, setClientOptions] = useState([]);
  const [userId, setUserId] = useState(null);

  const [keywordOptions, setKeywordOptions] = useState([]);

  const handleClientBusinessNameChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    const selectedClient = clientOptions.find(
      (option) => option.value === selectedValue
    );
    const clientEmail = selectedClient ? selectedClient.email : "";

    setFormData((prevState) => ({
      ...prevState,
      clientBusinessName: selectedValue,
      clientEmail: clientEmail,
    }));
  };

  const handleSelectChange = (field, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: field === "keywords" ? selectedOption : selectedOption?.value || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No user_id found. Please log in.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("userId", userId);
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const transformedKeywords = formData.keywords.map((keywordObj) => ({
      keyword: keywordObj.value,
      searchVolume: keywordObj.searchVolume,
    }));

    const dataToSubmit = {
      loggedInUser: userId,
      newUserId: formData.userId,
      newUserRole: "caliper_client",
      action: "createCaliperUser",
      password: formData.password,
      clientType: formData.clientType,
      clientName: formData.clientBusinessName,
      keywords: transformedKeywords,
      clientEmail: formData.clientEmail,
      googleAccountId: formData.googleAccountId,
      loginCustomerId: formData.loginCustomerId,
    };

    console.log("Form Data Submitted:", JSON.stringify(dataToSubmit, null, 2));

    try {
      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=createCaliperUser`,
        dataToSubmit
      );
      console.log("Response:", response.data);
      //   window.location.href = "/admin/dashboard";
      if (response.data.result == "success") {
        Swal.fire({
          title: "Success!",
          text: "Client Created Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/dashboard";
          }
        });
      } else {
        Swal.fire({
          title: "Something went wrong!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/client-user-creation";
          }
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        console.log("storedUserId", userId);

        try {
          const response = await axios.post(
            `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewClientDataSetup`,
            {
              loggedInUser: userId,
            }
          );
          console.log("response 1", response);
          const clients = response.data.viewClientDataSetupResponseList || [];
          const newClientOptions = clients.map((client) => ({
            value: client.clientName,
            label: client.clientName,
            email: client.clientEmail,
          }));
          setClientOptions(newClientOptions);
        } catch (err) {
          console.error("err", err);
        }
      };

      fetchData();
    }
  }, [userId]);

  // Fetch Keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const storedUserId = sessionStorage.getItem("user_id"); 
        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewKeywords`,
          {
            loggedInUser: storedUserId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.result === "success") {
          console.log("Fetched Keywords details:", response.data);
        const fetchedKeywords = response.data.caliperBaseKeywords?.null?.map(
          (item) => ({
            value: item.keyword,
            label: `${item.keyword}`,
            searchVolume: item.searchVolume, 
          })
        );

        setKeywordOptions(fetchedKeywords || []); 
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching URL details:", error.message);
      } finally {
      }
    };

    fetchKeywords();
  }, []);

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Create User Creation</h3>
      <div className="form_block">
        <form onSubmit={handleSubmit} className="form_elements">
          <div className="form_element select_form_element">
            <label>Client Business Name</label>
            <Select
              options={clientOptions}
              onChange={handleClientBusinessNameChange}
              isClearable
              placeholder="Please Select"
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
            <label>Client Email:</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              readOnly
              placeholder=""
            />
          </div>

          <div className="form_element">
            <label>User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              placeholder="Please Enter User Id (required)"
            />
          </div>

          <div className="form_element">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Please Enter password (required)"
            />
          </div>

          <div className="form_element">
            <label>Client Type:</label>
            <input
              type="text"
              name="clientType"
              value={formData.clientType}
              onChange={handleChange}
              required
              placeholder="Please Enter (required)"
            />
          </div>

          
          <div className="form_element">
            <label>Client Code:</label>
            <input
              type="text"
              name="clientCode"
              value={formData.clientCode}
              onChange={handleChange}
              required
              placeholder="Please Enter (required)"
            />
          </div>
        


          <div className="form_element">
            <label>Google Account ID (unique):</label>
            <input
              type="text"
              name="googleAccountId"
              value={formData.googleAccountId}
              onChange={handleChange}
              required
              placeholder="Please Enter (required)"
            />
          </div>
          <div className="form_element">
            <label>Login Customer Id: </label>
            <input
              type="text"
              name="loginCustomerId"
              value={formData.loginCustomerId}
              onChange={handleChange}
              required
              placeholder="Please Enter (required)"
            />
          </div>
          <div className="form_element select_form_element">
            <label>Select Keywords</label>
            <Select
              isMulti
              options={keywordOptions}
              onChange={(selectedOptions) =>
                handleSelectChange("keywords", selectedOptions)
              }
              placeholder="Select from list"
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
            <button type="submit" className="btn outline">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

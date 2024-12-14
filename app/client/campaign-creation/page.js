"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

const Page = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter(); 
  const formRef = useRef(null);
  const [headlines, setHeadlines] = useState([""]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [formData, setFormData] = useState({
    landingUrl: "",
    youtubeUrl: "",
  }); 
    const [userId, setUserId] = useState(null);
  

  const platformOptions = [
    { value: "Search", label: "Search" },
    { value: "P-Max", label: "P-Max" },
  ];

  const handleAddHeadline = () => {
    setHeadlines([...headlines, ""]);
  };
  
  const handleHeadlineChange = (index, value) => {
    const updatedHeadlines = [...headlines];
    updatedHeadlines[index] = value;
    setHeadlines(updatedHeadlines);
  };

  const storedUserId = sessionStorage.getItem("user_id");
  useEffect(() => {

    const fetchUrlDetails = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewUrlDetails`,
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
          setFormData({
            landingUrl: response.data.landingPageUrl || "",
            youtubeUrl: response.data.youtubeVideoUrl || "",
          });
          console.log("Fetched URL details:", response.data);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching URL details:", error.message);
      } finally {
      }
    };

    fetchUrlDetails();
  }, []); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);

    const payload = {
      loggedInUser: storedUserId, 
      userRole: "caliper_client",
      action: "createClientCampaign", 
      clientName: formData.get("clientName"), 
      campaignName: formData.get("CampaignName"), 
      startDate: formData.get("startDate"), 
      endDate: formData.get("endDate"), 
      campaignBudget: formData.get("CampaignBudget"), 
      landingPageUrl: formData.get("landingUrl"), 
      youtubeUrl: formData.get("youtubeUrl"), 
      headlines, 
      descriptions: formData.get("uploadDescriptions")?.split("|"), 
      platform: selectedPlatform?.value, 
      clientComment: formData.get("clientComment"), 
    };

    try {
      const response = await fetch(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=createClientCampaign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Response received:", data);
        // alert("Form submitted successfully!");
        // router.push("/client/dashboard");

        Swal.fire({
          title: 'Success!',
          text: 'Campaign Created Successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/client/dashboard";
          }
        });


      } else {
        console.error("Failed to submit form:", response.statusText);
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Create New Campaign</h3>
      <div className="form_block">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="form_elements"
      >
        <div className="form_element">
          <label>Client Name</label>
          <input type="text" name="clientName" placeholder="Enter Client Name (required)" required />
        </div>
        <div className="form_element">
          <label>Campaign Name</label>
          <input type="text" name="CampaignName" placeholder="Enter Campaign Name (required)" required />
        </div>
        <div className="form_element">
          <label>Start Date</label>
          <input type="date" name="startDate" required />
        </div>
        <div className="form_element">
          <label>End Date</label>
          <input type="date" name="endDate" required />
        </div>
        <div className="form_element">
          <label>Campaign Budget</label>
          <input type="number" name="CampaignBudget" placeholder="Specify Budget" required />
        </div>
        <div className="form_element">
        <label>Landing Page URL</label>
          <input
            type="url"
            name="landingUrl"
            value={formData.landingUrl}
            onChange={handleInputChange}
            placeholder="Enter URL (required)"
            required
          />
          
        </div>
        <div className="form_element">
        <label>YouTube Video URL</label>
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
            placeholder="Enter URL (required)"
          />
          
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
            placeholder="Please Select"
          />
        </div>

        <div className="form_element">
          <label>Client Comment</label>
          <input type="text" name="clientComment" placeholder="Enter Comment" />
        </div>
        <div className="form_element headline_input">
          <label>Upload Headlines</label>
          {headlines.map((headline, index) => (
            <div key={index} className="dynamicInput">
              <input
                type="text"
                value={headline}
                onChange={(e) => handleHeadlineChange(index, e.target.value)}
                placeholder=""
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddHeadline}
            className="btn add-btn"
          >
            Add Headline
          </button>
        </div>
        <div className="form_element">
        <label>Upload Descriptions</label>
          <input
            type="text"
            name="uploadDescriptions"
            placeholder="Enter Details (required)"
            required
          />
          
        </div>
        <div className="form_element submit_btn_element">
        <button type="submit" className="btn p-button p-component">
          Proceed to pay
        </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Page;

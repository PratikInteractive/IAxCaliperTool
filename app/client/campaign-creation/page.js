"use client";

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const formRef = useRef(null);
  const [headlines, setHeadlines] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);
  const [formData, setFormData] = useState({
    clientName: "",
    landingUrl: "",
    youtubeUrl: "",
  });
  const [userId, setUserId] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  
  const platformOptions = [
    { value: "Search", label: "Search" },
    // { value: "P-Max", label: "P-Max" },
  ];
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);

  const handleAddHeadline = () => {
    setHeadlines([...headlines, ""]);
  };

  const handleHeadlineChange = (index, value) => {
    const updatedHeadlines = [...headlines];
    updatedHeadlines[index] = value;
    setHeadlines(updatedHeadlines);
  };

  const handleDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const handleDescriptionsChange = (index, value) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };

 
  useEffect(() => {
    // Get the current date in the format YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // e.g., "2024-12-15"
    setCurrentDate(formattedDate);
  }, []);


  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const storedUserId = sessionStorage.getItem("user_id"); 
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
            clientName: response.data.clientName || "",
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

    
    const storedUserId = sessionStorage.getItem("user_id");
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
      youtubeUrl: "",
      headlines,
      descriptions,
      platform: selectedPlatform?.value,
      clientComment: formData.get("clientComment"),
    };


    if (headlines.length < 3 || headlines.length > 15) {
      Swal.fire({
        title: "Validation Error",
        text: "Please add between 3 and 15 headlines.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (descriptions.length < 2 || descriptions.length > 4) {
      Swal.fire({
        title: "Validation Error",
        text: "Please add between 2 and 4 descriptions.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    console.log("Payload Entry", payload);

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

        if (data.result == "success") {
          console.log("Report", data.result);
          // Start
          Swal.fire({
            title: "Success!",
            text: "Campaign Created Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/client/dashboard";
            }
          });
          // End
        } else {
          Swal.fire({
            title: "Error!",
            text: response.data.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/client/campaign-creation";
            }
          });
        }
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
        <form ref={formRef} onSubmit={handleSubmit} className="form_elements">
          <div className="form_element">
            <label>Client Name</label>
            <input
              name="clientName"
              value={formData.clientName}
              type="text"
              placeholder="Enter Client Name (required)"
              required
              readOnly
            />
          </div>
          <div className="form_element">
            <label>Campaign Name</label>
            <input
              type="text"
              name="CampaignName"
              placeholder="Enter Campaign Name (required)"
              required
            />
          </div>
          <div className="form_element">
            <label>Start Date</label>
            <input type="date" name="startDate" min={currentDate} required />
          </div>
          <div className="form_element">
            <label>End Date</label>
            <input type="date" name="endDate"  min={currentDate} required />
          </div>
          <div className="form_element">
            <label>Campaign Budget</label>
            <input
              type="number"
              name="CampaignBudget"
              placeholder="Specify Budget"
              required
              min={0}
            />
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
          {/* <div className="form_element">
            <label>YouTube Video URL</label>
            <input
              type="url"
              name="youtubeUrl"
              // value={formData.youtubeUrl}
              value=""
              onChange={handleInputChange}
              placeholder="Enter URL (required)"
            />
          </div> */}

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
            <input
              type="text"
              name="clientComment"
              placeholder="Enter Comment"
            />
          </div>
          <div className="form_element form_element_headline">
            <label>Upload Headlines*</label>
            <div className="multiple_inputs">
              <div className="input_blocks">
                {headlines.map((headline, index) => (
                  <div key={index} className="dynamic_input">
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) =>
                        handleHeadlineChange(index, e.target.value)
                      }
                      placeholder="Enter headline (max 30 chars)"
                      maxLength={30} 
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddHeadline}
                className="btn add-btn"
                disabled={headlines.length >= 15}
              >
                +
              </button>
            </div>
          </div>
          <div className="form_element form_element_descp">
            <label>Upload Descriptions</label>
            <div className="multiple_inputs">
              <div className="input_blocks">
                {descriptions.map((description, index) => (
                  <div key={index} className="dynamic_input">
                    <input
                      type="text"
                      value={description}
                      onChange={(e) =>
                        handleDescriptionsChange(index, e.target.value)
                      }
                      placeholder="Enter description (max 90 chars)"
                      maxLength={90}
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleDescription}
                className="btn add-btn"
                disabled={descriptions.length >= 4}
              >
                +
              </button>
            </div>
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

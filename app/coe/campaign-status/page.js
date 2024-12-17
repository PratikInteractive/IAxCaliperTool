"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const Page = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    campaignName: "",
    startDate: "",
    endDate: "",
    platform: "",
    phoneNumber: "",
    landingUrl: "",
    biddingStrategy: "",
    network: "",
    industry: "",
    subIndustry: "",
    adsLocation: "",
    keywords: "",
    adName: "",
    finalUrl: "",
    headlines: [],
    descriptions: [],
    clientComment: "",
    totalBudget: "",
    dailyBudget: "",
    manualCpcTrueFalse: false,
    maximizeClicksNumber: "",
    targetImpressionShareNumber: "",
    isTargetGoogleSearch: "false",
    isTargetSearchNetwork: "false",
    isTargetContentNetwork: "false",
    isTargetPartnerSearchNetwork: "false",
  });

  const [locationOptions, setLocationOptions] = useState([]);


  const biddingStrategyOptions = [
    { value: "Manual CPC", label: "Manual CPC" },
    { value: "Maximize Clicks", label: "Maximize Clicks" },
    { value: "Maximize Conversions", label: "Maximize Conversions" },
    { value: "Maximize Conversion Value", label: "Maximize Conversion Value" },
    { value: "Target Impression Share", label: "Target Impression Share" },
  ];

  const manualCpcOptions = [
    { value: "false", label: "False" },
    { value: "true", label: "True" },
  ];

  const networkOptions = [
    { value: "isTargetGoogleSearch", label: "Target Google Search" },
    { value: "isTargetSearchNetwork", label: "Target Search Network" },
    { value: "isTargetContentNetwork", label: "Target Content Network" },
    {
      value: "isTargetPartnerSearchNetwork",
      label: "Target Partner Search Network",
    },
  ];

  const handleNetworkChange = (selectedOptions) => {
    const updatedNetworkState = {
      isTargetGoogleSearch: "false",
      isTargetSearchNetwork: "false",
      isTargetContentNetwork: "false",
      isTargetPartnerSearchNetwork: "false",
    };

    if (selectedOptions) {
      selectedOptions.forEach((option) => {
        updatedNetworkState[option.value] = "true";
      });
    }

    setFormData({
      ...formData,
      ...updatedNetworkState,
    });
  };

  const selectedNetworkOptions = networkOptions.filter(
    (option) => formData[option.value] === "true"
  );

  useEffect(() => {
    const savedCampaign = sessionStorage.getItem("selectedCampaign");
    const userId = sessionStorage.getItem("user_id");

    if (savedCampaign && userId) {
      const parsedCampaign = JSON.parse(savedCampaign);

      const requestBody = {
        loggedInUser: userId,
        campaignName: parsedCampaign.campaignName,
        campaignId: parsedCampaign.campaignId,
        clientName: parsedCampaign.clientName,
      };

      axios
        .post(
          "http://15.207.141.243:8080/web/pages/caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewCampaignSetupDetails",
          requestBody
        )
        .then((response) => {
          console.log("API Response:", response.data);
          const campaignData = response.data;
          setFormData({
            clientName: campaignData.clientName || "",
            campaignName: campaignData.campaignName || "",
            startDate: campaignData.startDate || "",
            endDate: campaignData.endDate || "",
            platform: campaignData.platform || "Default Platform",
            phoneNumber: campaignData.phoneNumber || "",
            landingUrl:
              campaignData.caliperClientDataSetup?.landingPageUrl || "",
            biddingStrategy: campaignData.biddingStrategy || "",
            network: campaignData.network || "Search Network",
            industry: campaignData.caliperClientDataSetup?.industry || "",
            subIndustry: campaignData.caliperClientDataSetup?.subIndustry || "",
            adsLocation: campaignData.adsLocation || "",
            keywords:
              campaignData.keywords.map((k) => k.keyword).join(", ") || "",
            adName: campaignData.adName || "",
            finalUrl: campaignData.finalUrl || "",
            headlines: campaignData.headlines || [],
            descriptions: campaignData.descriptions || [],
            clientComment: campaignData.clientComment || "",
            totalBudget: campaignData.totalBudget || "",
            dailyBudget: campaignData.totalBudget || "",
            adPhoneNumber:
              campaignData.caliperClientDataSetup?.adPhoneNumber || "",
          });


          const locationData = campaignData.caliperClientDataSetup;
          setLocationOptions([
            { value: locationData.city, label: `City - ${locationData.city}` },
            {
              value: locationData.state,
              label: `State - ${locationData.state}`,
            },
            {
              value: `${locationData.latitude}/${locationData.longitude}`,
              label: `Latitude/Longitude - ${locationData.latitude}/${locationData.longitude}`,
            },
            {
              value: `${locationData.radius} ${locationData.radiusUnit}`,
              label: `Radius - ${locationData.radius} ${locationData.radiusUnit}`,
            },
            {
              value: locationData.pincode,
              label: `Pincode - ${locationData.pincode}`,
            },
          ]);
        })
        .catch((error) => {
          console.error("API Error:", error);
          alert("Error fetching campaign details.");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (selectedOption) => {
    setFormData({ ...formData, adsLocation: selectedOption.value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      biddingStrategy: selectedOption.value,
    });
  };

  const handleManualCpcChange = (selectedOption) => {
    setFormData({
      ...formData,
      manualCpcTrueFalse: selectedOption.value === "true",
    });
  };

  const handleNumberChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const preparePayload = () => {
    let finalBiddingStrategy = formData.biddingStrategy;

    if (formData.biddingStrategy === "Manual CPC") {
      finalBiddingStrategy = `Manual CPC (${
        formData.manualCpcTrueFalse ? "True" : "False"
      })`;
    }
    if (formData.biddingStrategy === "Maximize Clicks") {
      finalBiddingStrategy = `Maximize Clicks (${formData.maximizeClicksNumber})`;
    }
    if (formData.biddingStrategy === "Target Impression Share") {
      finalBiddingStrategy = `Target Impression Share (${formData.targetImpressionShareNumber})`;
    }

    return {
      ...formData,
      biddingStrategy: finalBiddingStrategy,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = preparePayload();
    console.log("Form Data Submitted:", payload);
  };

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Campaign Setup</h3>
      <div className="form_block">
        <form className="form_elements" onSubmit={handleSubmit}>
          <div className="form_element">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter Client Name (required + display field)"
            />
          </div>
          <div className="form_element">
            <label>Campaign Name</label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              placeholder="Enter Campaign Name (required + display field)"
            />
          </div>
          <div className="form_element">
            <label>Start date</label>
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Enter Start Date"
            />
          </div>
          <div className="form_element">
            <label>End date</label>
            <input
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="Enter End Date"
            />
          </div>
          <div className="form_element">
            <label>Platform</label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="Enter Platform"
            />
          </div>
          <div className="form_element">
            <label>Call Ads Phone number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter Call Ads Phone number"
            />
          </div>

          <div className="form_element">
            <label>Landing page URL</label>
            <input
              type="text"
              name="landingUrl"
              value={formData.landingUrl}
              onChange={handleChange}
              placeholder="Enter Landing Page URL"
            />
          </div>

          <div className="form_element">
            <label>Bidding Strategy</label>
            <Select
              options={biddingStrategyOptions}
              value={biddingStrategyOptions.find(
                (option) => option.value === formData.biddingStrategy
              )}
              onChange={handleSelectChange}
              placeholder="Select Bidding Strategy"
              isSearchable={false}
            />
          </div>

          {formData.biddingStrategy === "Manual CPC" && (
            <div className="form_element">
              <label>True/False (Manual CPC)</label>
              <Select
                options={manualCpcOptions}
                value={manualCpcOptions.find(
                  (option) =>
                    option.value ===
                    (formData.manualCpcTrueFalse ? "true" : "false")
                )}
                onChange={handleManualCpcChange}
                placeholder="Select True or False"
              />
            </div>
          )}

          {(formData.biddingStrategy === "Maximize Clicks" ||
            formData.biddingStrategy === "Target Impression Share") && (
            <div className="form_element">
              <label>Number (Maximize Clicks / Target Impression Share)</label>
              <input
                type="number"
                value={
                  formData.biddingStrategy === "Maximize Clicks"
                    ? formData.maximizeClicksNumber
                    : formData.targetImpressionShareNumber
                }
                onChange={(e) =>
                  handleNumberChange(
                    e,
                    formData.biddingStrategy === "Maximize Clicks"
                      ? "maximizeClicksNumber"
                      : "targetImpressionShareNumber"
                  )
                }
                placeholder="Enter Number"
              />
            </div>
          )}

          {["Maximize Conversions", "Maximize Conversion Value"].includes(
            formData.biddingStrategy
          ) && (
            <div className="form_element">
              <p>{formData.biddingStrategy} selected. No additional fields.</p>
            </div>
          )}

          <div className="form_element">
            <label>Network</label>
            <Select
              options={networkOptions}
              isMulti
              value={selectedNetworkOptions}
              onChange={handleNetworkChange}
              placeholder="Select Network"
              closeMenuOnSelect={false}
            />
          </div>

          <div className="form_element">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Enter Industry"
            />
          </div>
          <div className="form_element">
            <label>Sub-Industry</label>
            <input
              type="text"
              name="subIndustry"
              value={formData.subIndustry}
              onChange={handleChange}
              placeholder="Enter Sub-Industry"
            />
          </div>

          <div className="form_element">
            <label>Ads Location</label>
            <Select
              options={locationOptions}
              value={locationOptions.find(
                (opt) => opt.value === formData.adsLocation
              )}
              onChange={handleLocationChange}
              placeholder="Select Ads Location"
              isSearchable={false}
            />
          </div>

          <div className="form_element">
            <label>Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter Keywords"
            />
          </div>

          <div className="form_element">
            <label>Ad Name</label>
            <input
              type="text"
              name="adName"
              value={formData.adName}
              onChange={handleChange}
              placeholder="Enter Ad Name"
            />
          </div>
          <div className="form_element">
            <label>Final URL</label>
            <input
              type="text"
              name="finalUrl"
              value={formData.finalUrl}
              onChange={handleChange}
              placeholder="Enter Final URL"
            />
          </div>

          <div className="form_element">
  <label>Headlines</label>
  <Select
    options={formData.headlines}
    isMulti
    placeholder="Select Headlines"
  />
</div>

<div className="form_element">
  <label>Descriptions</label>
  <Select
    options={formData.descriptions}
    isMulti
    placeholder="Select Descriptions"
  />
</div>



          <div className="form_element">
            <label>Client Comment</label>
            <input
              type="text"
              name="clientComment"
              value={formData.clientComment}
              onChange={handleChange}
              placeholder="Enter Client Comment"
            />
          </div>

          <div className="form_element">
            <label>Total Campaign Budget</label>
            <input
              type="text"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="Enter Total Budget"
            />
          </div>

          <div className="form_element">
            <label>Daily Campaign Budget</label>
            <input
              type="text"
              name="dailyBudget"
              value={formData.dailyBudget}
              onChange={handleChange}
              placeholder="Enter Daily Budget"
            />
          </div>

          <div className="form_element submit_btn_element">
            <button type="submit" className="btn outline p-button p-component">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

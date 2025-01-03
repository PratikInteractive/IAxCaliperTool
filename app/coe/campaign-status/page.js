"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import CustomMultiSelect from "@/app/utils/CustomMultiSelect";

const Page = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    clientName: "",
    campaignName: "",
    campaignStartDate: "",
    campaignEndDate: "",
    platform: "",
    phoneNumber: "",
    landingUrl: "",
    biddingStrategy: "",
    industry: "",
    subIndustry: "",
    keywords: [],
    adName: "",
    landingPageUrl: "",
    headlines: [],
    descriptions: [],
    clientComment: "",
    totalBudget: "",
    biddingValue: "",
    isTargetGoogleSearch: "false",
    isTargetSearchNetwork: "false",
    isTargetContentNetwork: "false",
    isTargetPartnerSearchNetwork: "false",
    adPhoneNumber: "",
    matchType: "",
    objective: "sales",
    dailyBudget: "",
  });

  const [locationOptions, setLocationOptions] = useState([]);
  const [dailyBudgetState, setDailyBudget] = useState("");


  const platformOptions = [
    { value: "Search", label: "Search" },
    // { value: "P-Max", label: "P-Max" },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);

  const biddingStrategyOptions = [
    { value: "manual_cpc", label: "Manual CPC" },
    { value: "maximize_clicks", label: "Maximize Clicks" },
    { value: "maximize_conversions", label: "Maximize Conversions" },
    { value: "maximize_conversion_value", label: "Maximize Conversion Value" },
    { value: "target_impression_share", label: "Target Impression Share" },
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

  const matchTypeOptions = [
    { value: "EXACT", label: "Exact" },
    { value: "PHRASE", label: "Phrase" },
    { value: "BROAD", label: "Broad" },
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
    const fetchCampaignDetails = async () => {
      try {
        const savedCampaign = sessionStorage.getItem("selectedCampaign");
        console.log("savedCampaign", savedCampaign);
        const userId = sessionStorage.getItem("user_id");

        if (savedCampaign && userId) {
          const parsedCampaign = JSON.parse(savedCampaign);

          const requestBody = {
            loggedInUser: userId,
            campaignName: parsedCampaign.campaignName,
            campaignId: parsedCampaign.campaignId,
            clientName: parsedCampaign.clientName,
          };

          const response = await axios.post(
            `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewCampaignSetupDetails`,
            requestBody
          );

          if (response.data?.result === "success") {
            console.log("API Response:", response.data);
            const campaignData = response.data;
            const formattedStartDate = formatDate(campaignData.startDate);
            const formattedEndDate = formatDate(campaignData.endDate);

            console.log("totalBudget", campaignData.totalBudget);

            setFormData({
              clientName: campaignData.clientName || "",
              campaignName: campaignData.campaignName || "",
              campaignStartDate: formattedStartDate || "",
              campaignEndDate: formattedEndDate || "",
              platform: campaignData.platform || "Search",
              phoneNumber: campaignData.caliperClientDataSetup?.phoneNumber || "",
              landingUrl:
                campaignData.caliperClientDataSetup?.landingPageUrl || "",
              biddingStrategy: campaignData.biddingStrategy || "",
              industry: campaignData.caliperClientDataSetup?.industry || "",
              subIndustry: campaignData.caliperClientDataSetup?.subIndustry || "",
              keywordsOptions: campaignData.keywords.map((k) => ({
                value: k.keyword,
                label: k.keyword,
              })),
              adName: campaignData.adName || "",
              landingPageUrl: campaignData.finalUrl || "",
              headlinesOptions:
                campaignData.headlines?.map((headline) => ({
                  value: headline,
                  label: headline,
                })) || [],
              descriptionsOptions:
                campaignData.descriptions?.map((description) => ({
                  value: description,
                  label: description,
                })) || [],
              clientComment: campaignData.clientComment || "",
              totalBudget: campaignData.totalBudget || "",
              // dailyBudget: campaignData.dailyBudget || "",
              adPhoneNumber:
                campaignData.caliperClientDataSetup?.adPhoneNumber || "",
              isTargetGoogleSearch: "false",
              isTargetSearchNetwork: "false",
              isTargetContentNetwork: "false",
              isTargetPartnerSearchNetwork: "false",
              objective: "sales",
              biddingValue: "",
            });

            const locationData = campaignData.caliperClientDataSetup;
            setLocationOptions([
              { value: locationData.city, label: `City - ${locationData.city}` },
              {
                value: locationData.state,
                label: `State - ${locationData.state}`,
              },
              {
                value: `${locationData.latitude}/${locationData.longitude}/${locationData.radius}`,
                label: `Lat/Long+Radius - ${locationData.latitude}/${locationData.longitude}(${locationData.radius} ${locationData.radiusUnit})`,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                radius: locationData.radius,
                radiusUnit: locationData.radiusUnit,
              },
              {
                value: locationData.pincode,
                label: `Pincode - ${locationData.pincode}`,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Error fetching campaign details.");
      }
    };

    fetchCampaignDetails();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (selectedOption) => {
    const updatedLocation = {
      latitude: "",
      longitude: "",
      radius: "",
      radiusUnit: "",
      state: "",
      city: "",
      pincode: "",
    };

    if (selectedOption.value.includes("/")) {
      const parts = selectedOption.value.split("/");
      if (parts.length === 3) {
        const [latitude, longitude, radius] = parts;
        updatedLocation.latitude = latitude;
        updatedLocation.longitude = longitude;

        const match = selectedOption.label.match(/\(([\d.]+)\s(\w+)\)/);
        if (match) {
          updatedLocation.radius = radius || match[1];
          updatedLocation.radiusUnit = match[2];
        }
      } else {
        const [latitude, longitude] = parts;
        updatedLocation.latitude = latitude;
        updatedLocation.longitude = longitude;
      }
    } else if (selectedOption.value.includes(" ")) {
      const [radius, radiusUnit] = selectedOption.value.split(" ");
      updatedLocation.radius = radius;
      updatedLocation.radiusUnit = radiusUnit;
    } else if (selectedOption.label.startsWith("City")) {
      updatedLocation.city = selectedOption.value;
    } else if (selectedOption.label.startsWith("State")) {
      updatedLocation.state = selectedOption.value;
    } else if (selectedOption.label.startsWith("Pincode")) {
      updatedLocation.pincode = selectedOption.value;
    }

    setFormData({
      ...formData,
      ...updatedLocation,
    });
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
      biddingValue: selectedOption.value === "true",
    });
  };

  const handleNumberChange = (e, field) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value,
      biddingValue: value,
    });
  };

  const handleHeadlinesChange = (selectedOptions) => {
    if (selectedOptions.some(option => option.value === "select_all")) {
      setFormData({
        ...formData,
        headlines: formData.headlinesOptions || [],
      });
    } else {
      setFormData({
        ...formData,
        headlines: selectedOptions,
      });
    }
  };

  const handleDescriptionsChange = (selectedOptions) => {
    if (selectedOptions.some(option => option.value === "select_all")) {
      setFormData({
        ...formData,
        descriptions: formData.descriptionsOptions || [],
      });
    } else {
      setFormData({
        ...formData,
        descriptions: selectedOptions,
      });
    }
  };


  const preparePayload = () => {
    let finalBiddingStrategy = formData.biddingStrategy;

    if (formData.biddingStrategy === "manual_cpc") {
      finalBiddingStrategy = `manual_cpc`;
    }
    if (formData.biddingStrategy === "maximize_clicks") {
      finalBiddingStrategy = `maximize_clicks`;
    }
    if (formData.biddingStrategy === "target_impression_share") {
      finalBiddingStrategy = `target_impression_share`;
    }

    const { headlinesOptions, descriptionsOptions, keywordsOptions, ...rest } =
      formData;

    const transformedHeadlines = formData.headlines.map(
      (headline) => headline.value
    );
    const transformedDescriptions = formData.descriptions.map(
      (description) => description.value
    );

    const transformedKeywords = formData.keywords.map(
      (keyword) => keyword.value
    );

    return {
      ...rest,
      biddingStrategy: finalBiddingStrategy,
      headlines: transformedHeadlines,
      descriptions: transformedDescriptions,
      keywords: transformedKeywords,
    };
  };

  const calculateDailyBudget = () => {
    const { totalBudget, campaignStartDate, campaignEndDate } = formData;
    if (totalBudget && campaignStartDate && campaignEndDate) {
      const start = new Date(campaignStartDate);
      const end = new Date(campaignEndDate);
      const days = Math.max((end - start) / (1000 * 60 * 60 * 24) + 1, 1);
      var dailyBudgetValue = (parseFloat(totalBudget) / days).toFixed(2);
      setDailyBudget(dailyBudgetValue);
    }
    return "";
  };

  useEffect(() => {
    calculateDailyBudget();
  }, [formData.totalBudget, formData.campaignStartDate, formData.campaignEndDate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      loggedInUser = sessionStorage.getItem("user_id"),
      campaignId = JSON.parse(sessionStorage.getItem("selectedCampaign"))?.campaignId,
      clientName = formData.clientName,
      campaignName = formData.campaignName,
      campaignStartDate,
      campaignEndDate,
      platform,
      biddingStrategy,
      biddingValue,
      isTargetGoogleSearch,
      isTargetSearchNetwork,
      isTargetContentNetwork,
      isTargetPartnerSearchNetwork,
      landingPageUrl,
      adName,
      headlines,
      descriptions,
      latitude,
      longitude,
      radius,
      radiusUnit,
      state,
      city,
      pincode,
      objective,
      keywords,
      matchType,
      dailyBudget = dailyBudgetState,
    } = formData;

    const payload = {
      loggedInUser,
      campaignId,
      clientName,
      campaignName,
      campaignStartDate,
      campaignEndDate,
      platform,
      biddingStrategy,
      biddingValue,
      isTargetGoogleSearch,
      isTargetSearchNetwork,
      isTargetContentNetwork,
      isTargetPartnerSearchNetwork,
      landingPageUrl,
      adName,
      headlines: headlines.map((item) => item.value),
      descriptions: descriptions.map((item) => item.value),
      latitude,
      longitude,
      radius,
      radiusUnit,
      state,
      city,
      pincode,
      objective,
      // keywords: keywords.map((item) => item.value),
      keywords: Array.isArray(keywords) ? keywords.map((item) => item.value) : [],
      matchType,
      dailyBudget,
    };

    if (!formData.keywords || formData.keywords.length === 0) {
      Swal.fire({
          title: "Validation Error",
          text: "Please select at least one keyword.",
          icon: "warning",
          confirmButtonText: "OK",
      });
      return;
  }

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


    const preparedPayload = preparePayload();
    console.log("Prepared Payload:", preparedPayload);

    setFormData({
      ...formData,
      biddingValue: "",
    });

    console.log("Form Data Submitted:", payload);

    try {
      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=createNewCampaign`,
        payload
      );

      if (response.status === 200 && response.data) {
        const data = response.data;
        console.log("API Response:", data);

        if (data.result === "success") {
          Swal.fire({
            title: "Success!",
            text: "Campaign Created Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/coe/dashboard";
            }
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message || "Something went wrong.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "";
            }
          });
        }
      } else {
        throw new Error(response.statusText || "Failed to submit form.");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to submit the form.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
              placeholder="Enter Client Name"
            />
          </div>
          {
            formData.clientComment ?
              <div className="form_element">
                <label>Client Comment</label>
                <input
                  type="text"
                  name="clientComment"
                  value={formData.clientComment}
                  onChange={handleChange}
                  placeholder="Enter Client Comment"
                  readOnly
                />
              </div> : ""
          }

          <div className="form_element">
            <label>Campaign Name</label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              placeholder="Enter Campaign Name"
            />
          </div>
          <div className="form_element">
            <label>Start date</label>
            <input
              type="date"
              name="campaignStartDate"
              value={formData.campaignStartDate}
              onChange={handleChange}
              placeholder="Enter Start Date"
            />
          </div>
          <div className="form_element">
            <label>End date</label>
            <input
              type="date"
              name="campaignEndDate"
              value={formData.campaignEndDate}
              onChange={handleChange}
              placeholder="Enter End Date"
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
            <label>Call Ads Phone number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.adPhoneNumber}
              onChange={handleChange}
              placeholder="Enter Call Ads Phone number"
            />
          </div>

          {/* <div className="form_element">
            <label>Landing page URL</label>
            <input
              type="text"
              name="landingUrl"
              value={formData.landingUrl}
              onChange={handleChange}
              placeholder="Enter Landing Page URL"
            />
          </div> */}

          <div className="form_element">
            <label>Match Type</label>
            <Select
              options={matchTypeOptions}
              value={matchTypeOptions.find(
                (option) => option.value === formData.matchType
              )}
              onChange={(selectedOption) =>
                setFormData({ ...formData, matchType: selectedOption.value })
              }
              placeholder="Select Match Type"
              required
            />
          </div>
          <div className="form_element">
            <label>Network</label>
            <Select
              options={networkOptions}
              isMulti
              value={selectedNetworkOptions}
              onChange={handleNetworkChange}
              placeholder="Select Network"
              closeMenuOnSelect={false}
              required
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
              required
            />
          </div>

          {formData.biddingStrategy === "manual_cpc" && (
            <div className="form_element">
              <label>Enhanced CPC (True/False) </label>
              <Select
                options={manualCpcOptions}
                value={manualCpcOptions.find(
                  (option) =>
                    option.value === (formData.biddingValue ? "true" : "false")
                )}
                onChange={handleManualCpcChange}
                placeholder="Select True or False"
                required
              />
            </div>
          )}

          {(formData.biddingStrategy === "maximize_clicks" ||
            formData.biddingStrategy === "target_impression_share") && (
              <div className="form_element">
                <label>
                  {formData.biddingStrategy === "maximize_clicks"
                    ? "Max CPC Bid Limit"
                    : "Target Impression Share"}
                </label>
                <input
                  type="number"
                  value={
                    formData.biddingStrategy === "maximize_clicks"
                      ? formData.biddingValue
                      : formData.biddingValue
                  }
                  onChange={(e) =>
                    handleNumberChange(
                      e,
                      formData.biddingStrategy === "maximize_clicks"
                        ? "maximizeClicksNumber"
                        : "targetImpressionShareNumber"
                    )
                  }
                  placeholder="Enter Number"
                  required
                />
              </div>
            )}


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
              required
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
              required
            />
          </div>

          <div className="form_element">
            <label>Final URL</label>
            <input
              type="text"
              name="landingPageUrl"
              value={formData.landingPageUrl}
              onChange={handleChange}
              placeholder="Enter Final URL"
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
              readOnly
            />
          </div>

          <div className="form_element">
            <label>Daily Campaign Budget</label>
            <input
              type="text"
              name="dailyBudget"
              value={dailyBudgetState}
              onChange={handleChange}
              placeholder="Enter Daily Budget"
              readOnly
            />
          </div>

          <div className="form_element">
            <label>Keywords</label>
            {/* <Select
              options={[
                { value: "select_all", label: "Select All" },
                ...(formData.keywordsOptions || []),
              ]}
              isMulti
              value={formData.keywords}
              onChange={(selectedOptions) => {
                if (selectedOptions.some(option => option.value === "select_all")) {
                  setFormData({
                    ...formData,
                    keywords: formData.keywordsOptions || [],
                  });
                } else {
                  setFormData({
                    ...formData,
                    keywords: selectedOptions,
                  });
                }
              }}
              placeholder="Select Keywords"
              required
            /> */}

            <CustomMultiSelect
              options={[
                ...(formData.keywordsOptions || []),
              ]}
              value={formData.keywords}
              onChange={(selectedOptions) => {
                setFormData({
                  ...formData,
                  keywords: selectedOptions,
                });
              }}
              placeholder="Select Keywords"
            />

          </div>

          <div className="form_element">
            <label>Headlines</label>
            <Select
              options={[
                { value: "select_all", label: "Select All" },
                ...(formData.headlinesOptions || []),
              ]}
              isMulti
              value={formData.headlines}
              onChange={handleHeadlinesChange}
              placeholder="Select Headlines"
              required

            />
          </div>

          <div className="form_element">
            <label>Descriptions</label>
            <Select
              options={[
                { value: "select_all", label: "Select All" },
                ...(formData.descriptionsOptions || []),
              ]}
              isMulti
              value={formData.descriptions}
              onChange={handleDescriptionsChange}
              placeholder="Select Descriptions"
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
"use client";

import React, { useEffect , useState } from "react";
import axios from "axios";

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
    headlines: "",
    descriptions: "",
    clientComment: "",
    totalBudget: "",
    dailyBudget: "",
  });

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
            landingUrl: campaignData.caliperClientDataSetup?.landingPageUrl || "",
            biddingStrategy: campaignData.biddingStrategy || "Manual CPC",
            network: campaignData.network || "Search Network",
            industry: campaignData.caliperClientDataSetup?.industry || "",
            subIndustry: campaignData.caliperClientDataSetup?.subIndustry || "",
            adsLocation: campaignData.adsLocation || "",
            keywords: campaignData.keywords.map(k => k.keyword).join(", ") || "",
            adName: campaignData.adName || "",
            finalUrl: campaignData.caliperGoogleResponsiveAdList.find(ad => ad.type === "FINAL_URL")?.value || "",
            headlines: campaignData.caliperGoogleResponsiveAdList.filter(ad => ad.type === "HEADLINE").map(ad => ad.value).join(", "),
            descriptions: campaignData.caliperGoogleResponsiveAdList.filter(ad => ad.type === "DESCRIPTION").map(ad => ad.value).join(", "),
            clientComment: campaignData.clientComment || "",
            totalBudget: campaignData.totalBudget || "",
            dailyBudget: (campaignData.totalBudget / 5).toFixed(2) || "", // Example calculation
            adPhoneNumber: campaignData.caliperClientDataSetup?.adPhoneNumber || "",
          });
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

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Campaign Setup</h3>
      <div className="form_block">
        <form className="form_elements">
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
            <input
              type="text"
              name="biddingStrategy"
              value={formData.biddingStrategy}
              onChange={handleChange}
              placeholder="Enter Bidding Strategy"
            />
          </div>
          <div className="form_element">
            <label>Network</label>
            <input
              type="text"
              name="network"
              value={formData.network}
              onChange={handleChange}
              placeholder="Enter Network"
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
            <input
              type="text"
              name="adsLocation"
              value={formData.adsLocation}
              onChange={handleChange}
              placeholder="Enter Ads Location"
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
            <input
              type="text"
              name="headlines"
              value={formData.headlines}
              onChange={handleChange}
              placeholder="Enter Headlines"
            />
          </div>

          <div className="form_element">
            <label>Descriptions</label>
            <input
              type="text"
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
              placeholder="Enter Descriptions"
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

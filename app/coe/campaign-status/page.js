"use client";

import React, { useRef, useEffect } from "react";

const Page = () => {
  //   const formRef = useRef(null);

  //   const handleSubmit = async (event) => {
  //     event.preventDefault();

  //     const formData = new FormData(formRef.current);

  //     formData.append("userId", "hitesh.gohil");
  //     formData.append("userRole", "caliperAdmin");
  //     formData.append("action", "");

  //     try {
  //       const response = await fetch("", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Response received:", data);
  //         alert("Form submitted successfully!");
  //       } else {
  //         console.error("Failed to submit form:", response.statusText);
  //         alert("Failed to submit the form.");
  //       }
  //     } catch (error) {
  //       console.error("Error submitting form:", error);
  //       alert("An error occurred while submitting the form.");
  //     }
  //   };

  return (
    <div className="container mt-2">
      <h3 className="mb-2">Campaign Setup</h3>
      <div className="form_block">
        {/* <form ref={formRef} onSubmit={handleSubmit} className={styles.form_container}> */}
        <form className="form_elements">
          <div className="form_element">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Enter Client Name (required + display field)"
            />
          </div>
          <div className="form_element">
            <label>Campaign Name</label>
            <input
              type="text"
              name="CampaignName"
              placeholder="Enter Campaign Name (required + display field)"
            />
          </div>
          <div className="form_element">
            <label>Start date</label>
            <input type="text" name="startDate" placeholder="" />
          </div>
          <div className="form_element">
            <label>End date</label>
            <input type="text" name="endDate" placeholder="" />
          </div>
          <div className="form_element">
            <label>Platform</label>
            <input
              type="text"
              name="platform"
              placeholder="Enter Platform (required + display field)"
            />
          </div>
          <div className="form_element">
            <label>Call Ads Phone number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter Call Ads (required + display field)"
            />
          </div>

          <div className="form_element">
            <label>Landing page URL.</label>
            <input
              type="text"
              name="landingUrl"
              placeholder="Enter LP Url (required + display field)"
            />
          </div>

          <div className="form_element">
            <label>Bidding Strategy</label>
            <input type="text" name="biddingStrategy" placeholder="" />
          </div>
          <div className="form_element">
            <label>Network</label>
            <input type="text" name="Network" placeholder="" />
          </div>

          <div className="form_element">
            <label>Industry</label>
            <input type="text" name="industry" placeholder="" />
          </div>
          <div className="form_element">
            <label>Sub-Industry</label>
            <input type="text" name="subIndustry" placeholder="" />
          </div>

          <div className="form_element">
            <label>Ads Location</label>
            <input type="text" name="adsLocation" placeholder="" />
          </div>

          <div className="form_element">
            <label>Keywords</label>
            <input type="text" name="keywords" placeholder="" />
          </div>

          <div className="form_element">
            <label>Ad Name</label>
            <input type="text" name="adName" placeholder="" />
          </div>
          <div className="form_element">
            <label>Final URL</label>
            <input type="text" name="finalUrl" placeholder="" />
          </div>

          <div className="form_element">
            <label>Headlines</label>
            <input type="text" name="headlines" placeholder="" />
          </div>

          <div className="form_element">
            <label>Descriptions</label>
            <input type="text" name="descriptions" placeholder="" />
          </div>
          <div className="form_element">
            <label>Client Comment</label>
            <input type="text" name="Comment" placeholder="" />
          </div>

          <div className="form_element">
            <label>Total Campaign Budget</label>
            <input type="text" name="totalBudget" placeholder="" />
          </div>

          <div className="form_element">
            <label>Daily Campaign Budget</label>
            <input type="text" name="dailyBudget" placeholder="" />
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

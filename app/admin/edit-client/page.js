"use client";

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from 'sweetalert2';
import { useSearchParams } from "next/navigation";

const Page = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;




  const searchParams = useSearchParams(); 
  const clientName = searchParams.get("clientName"); 
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    if (clientName) {
      console.log("Editing Client:", clientName); 

    }
  }, [clientName]);

  
  return (
    <div className="container mt-2">
      <h3 className="mb-2">Create New Client</h3>
      <div className="form_block">
        <form className="form_elements">
          <div className="form_element">
            <label>Client Business Name</label>
            <input type="text" name="clientName" placeholder="Business name (required)" value={clientName} required />
          </div>
          <div className="form_element select_form_element">
            <label>Select Industry</label>

          </div>

          <div className="form_element select_form_element">
            <label>Select Sub Industry</label>

          </div>
          <div className="form_element">
            <label>Client Email</label>
            <input type="email" name="clientEmail" placeholder="Email id (required)" required />
          </div>
          <div className="form_element">
            <label>Client Phone No.</label>
            <input
              type="tel"
              name="phoneNumber"
              value=""
            
              maxLength={10}
              placeholder="Phone no. (required)"
            />

          </div>
      
          <div className="form_element select_form_element">
            <label>Select City</label>
   
          </div>
          <div className="form_element">
            <label>Street Address 1</label>
            <input type="text" name="streetAddress1" placeholder="Address (optional)" />
          </div>
          <div className="form_element">
            <label>Street Address 2</label>
            <input type="text" name="streetAddress2" placeholder="Address (optional)" />
          </div>
          <div className="form_element">
            <label>Pincode</label>

          </div>
          <div className="form_element">
            <label>Client Location Exclusion (optional)</label>
            <input
              type="text"
              name="locationExclusion"
              placeholder="Location Exclusion"
            />
          </div>
          <div className="form_element">
            <label>Call Ads Phone Number</label>
          
          </div>
          <div className="form_element">
            <label>Landing Page URL</label>
            <input type="text" name="landingPageUrl" placeholder="Landing Page URL (required)" required />
          </div>

          <div className="form_element">
            <label>Latitude</label>
            <input type="number" step="any" name="latitude" placeholder="Latitude in decimal (required)" min="0" required />
          </div>
          <div className="form_element">
            <label>Longitude</label>
            <input type="number" step="any" name="longitude" placeholder="Longitude in decimal (required)" min="0"  required />
          </div>
          <div className="form_element">
            <label>Radius</label>
            <input type="number" name="radius" placeholder="Please add (required)" required min="0" />
          </div>

          <div className="form_element submit_btn_element">
            <button type="submit" className="btn p-button p-component">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

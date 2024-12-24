"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/styles/dashboad.module.css";
import Swal from "sweetalert2";
// import { useRoleCheck } from "@/app/utils/userRoleCheck";

export default function Page() {

  const role = localStorage.getItem('role');
  console.log("Client Dashboard Role", role);
  if(role !== "client") {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    localStorage.removeItem("role");
    window.location.href = "/unauthorized";
  }


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = 10;
  const [first, setFirst] = useState(0);
  const [status,setStatus] = "";



  useEffect(() => {
    const fetchCampaigns = async () => {
      const storedUserId = sessionStorage.getItem("user_id");
      try {
        const payload = {
          loggedInUser: storedUserId,
        };

        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewExistingCampaigns`,
          payload
        );

        setCampaigns(response.data.viewCaliperExistingCampaignsResponseList);
        console.log("response", response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);


  const Approval = async (rowData) => {
    console.log("Approval Clicked");
    console.log("Row Data", rowData);

    const storedUserId = sessionStorage.getItem("user_id");
    try {
      const payload = {
        "loggedInUser": storedUserId,
        "campaignId": rowData.campaignId,
      };

      console.log("Payload Approve", payload);

      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=approveCaliperCampaign`,
        payload
      );
      console.log("response accept click", response.data);
      if (response.data.result == "success") {
        Swal.fire({
          title: "Success!",
          text: "Campaign Approved Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/client/dashboard";
          }
        });
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }

  const Reject = async (rowData) => {
    console.log("Reject Clicked");
    console.log("Row Data", rowData.campaignId);
  
    const storedUserId = sessionStorage.getItem("user_id");
  
    // Show SweetAlert to input a comment
    const { value: comment } = await Swal.fire({
      title: 'Add a comment',
      input: 'textarea',
      inputPlaceholder: 'Enter your comment here...',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Submit',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });
  
    if (comment) {
      try {
        const payload = {
          "loggedInUser": storedUserId,
          "campaignId": rowData.campaignId,
          "comment": comment,  // Add the comment here
        };
  
        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=rejectCaliperCampaign`,
          payload
        );
  
        console.log("response", response);
        if (response.data.result === "success") {
          Swal.fire({
            title: "Success!",
            text: "Campaign Rejected Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/client/dashboard";
            }
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "There was an issue rejecting the campaign.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error rejecting campaign:", error);
        Swal.fire({
          title: "Error",
          text: "There was an issue processing your request.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  

  const Pause = async (rowData) => {
    console.log("Pause Clicked");
    console.log("Row Data", rowData.campaignId);

    const storedUserId = sessionStorage.getItem("user_id");
    try {
      const payload = {
        "loggedInUser": storedUserId,
        "campaignId": rowData.campaignId
      };

      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=pauseCaliperCampaign`,
        payload
      );

      console.log("response", response);
      if (response.data.result == "success") {
        Swal.fire({
          title: "Success!",
          text: "Campaign Paused Successfully!!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/client/dashboard";
          }
        });
      }

    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }


  const getActionButtons = (status, rowData) => {
    switch (status) {
      case "drafted":
        return null; // Don't show any buttons
      case "pending":
        return (
          <>
            <button className="btn success" onClick={() => Approval(rowData)}>
              Approve
            </button>
            <button className="btn primary reject" onClick={() => Reject(rowData)}>
              Reject
            </button>
          </>
        );
      case "approved":
        return null; // Don't show any buttons
      case "rejected":
        return null; // Don't show any buttons
      case "live":
        return (
          <button className="btn primary pause" onClick={() => Pause(rowData)}>
            Pause
          </button>
        );
      case "paused":
        return (
          <button className="btn success" onClick={() => Approval(rowData)}>
            Approve
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`container ${styles.dashboard}`}>
      <div className={styles.dashboard_block}>
        <h2>Campaign List</h2>
        <Link href="/client/campaign-creation">
          <Button className="btn primary">Create Campaign</Button>
        </Link>
      </div>
      <DataTable
        value={campaigns}
        stripedRows
        rows={rows}
        first={first}
        onPage={(e) => setFirst(e.first)}
        className="p-datatable-customers custom-table"
        showGridlines
        dataKey="campaignId" // Unique identifier
        emptyMessage="No campaigns found."
        loading={loading}
      >
        <Column field="campaignName" header="Campaign Name" sortable />
        <Column field="startDate" header="Start Date" />
        <Column field="endDate" header="End Date" />
        <Column field="totalBudget" header="Total Budget" sortable />
        <Column field="status" header="Status" 
                  body={(rowData) => (
                    <span className={rowData.status}> {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}</span>
                  )}
        />
        <Column field="comment" header="Rejection Comment" />
        {/* <Column
          header="Approval"
          body={(rowData) => (
            <div className="action-buttons">
              {!isDrafted(rowData.status) && (
                <button className="btn success" onClick={() => Approval(rowData)}>
                  Approve
                </button>
              )}
            </div>
          )}
          bodyClassName="text-center"
        />
        <Column
          header="Reject"
          body={(rowData) => (
            <div className="action-buttons">
               {!isDrafted(rowData.status) && (
                <button className="btn reject" onClick={() => Reject(rowData)}>
                  Approve
                </button>
              )}

            </div>
          )}
          bodyClassName="text-center"
        />
        <Column
          header="Pause"
          body={(rowData) => (
            <div className="action-buttons">
              {!isDrafted(rowData.status) && (
                <button className="btn pause" onClick={() => Pause(rowData)}>
                  Approve
                </button>
              )}
            </div>
          )}
          bodyClassName="text-center"
        /> */}
         <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              {getActionButtons(rowData.status, rowData)}
            </div>
          )}
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
}

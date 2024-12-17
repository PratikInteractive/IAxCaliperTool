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

  // // Role Check Start
  // const { isAuthorized } = useRoleCheck("client");
  // if (!isAuthorized) {
  //   window.location.href = "/unauthorized"
  //   return null; // Or redirect if needed
  // }
  // // Role Check End
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = 10;
  const [first, setFirst] = useState(0);



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
    console.log("Row Data", rowData.campaignId);

    // const storedUserId = sessionStorage.getItem("user_id");
    try {
      const payload = {
        "loggedInUser": rowData.loggedInUser,
        "campaignId": rowData.campaignId
      };

      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=approveCaliperCampaign`,
        payload
      );
      console.log("response", response);
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

    try {
      const payload = {
        "loggedInUser": rowData.loggedInUser,
        "campaignId": rowData.campaignId
      };

      const response = await axios.post(
        `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=rejectCaliperCampaign`,
        payload
      );

      console.log("response", response);
      if (response.data.result == "success") {
        Swal.fire({
          title: "Success!",
          text: "Campaign Reject Successfully!!",
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

  const Pause = async (rowData) => {
    console.log("Pause Clicked");
    console.log("Row Data", rowData.campaignId);

    try {
      const payload = {
        "loggedInUser": rowData.loggedInUser,
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
        <Column field="dailyBudget" header="Total Budget" sortable />
        <Column field="status" header="Status" />
        <Column
          header="Approval"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn primary sm"
                onClick={() => Approval(rowData)}
              >
                Approve
              </button>
            </div>
          )}
          bodyClassName="text-center"
        />
        <Column
          header="Reject"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn primary sm"
                onClick={() => Reject(rowData)}
              >
                Reject
              </button>
            </div>
          )}
          bodyClassName="text-center"
        />
        <Column
          header="Pause"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn primary sm"
                onClick={() => Pause(rowData)}
              >
                Pause
              </button>
            </div>
          )}
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
}

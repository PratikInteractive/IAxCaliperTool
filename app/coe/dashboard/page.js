"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/styles/dashboad.module.css";

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = 10;
  const [first, setFirst] = useState(0);


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const storedUserId = sessionStorage.getItem("user_id");
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

  const handleCreate = (rowData) => {
    // Store rowData in session storage or pass as query params
    sessionStorage.setItem("selectedCampaign", JSON.stringify(rowData));
    window.location.href = "/coe/campaign-status";
  };

  return (
    <div className={`container ${styles.dashboard}`}>
      <div className={styles.dashboard_block}>
        <h2>Campaign List</h2>
        {/* <Link href="/client/campaign-creation">
          <Button className="btn primary">Create Campaign</Button>
        </Link> */}
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
         <Column field="campaignId" header="Campaign Id" sortable />
        <Column field="campaignName" header="Campaign Name" sortable />
        <Column field="startDate" header="Start Date" />
        <Column field="endDate" header="End Date" />
        <Column field="dailyBudget" header="Daily Budget" sortable />
        <Column field="status" header="Status" />
        <Column field="comment" header="Comments" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn secondary"
                onClick={() => handleCreate(rowData)}
              >
                Create
              </button>
            </div>
          )}
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
}

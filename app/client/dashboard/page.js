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

  const storedUserId = sessionStorage.getItem("user_id");
  useEffect(() => {
    const fetchCampaigns = async () => {
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
        <Column field="dailyBudget" header="Daily Budget" sortable />
        <Column field="status" header="Status" />
        <Column field="comment" header="Comments" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="icon-button edit-btn p-button"
                onClick={() =>
                  alert(`Editing campaign: ${rowData.campaignName}`)
                }
              >
                <i className="pi pi-pencil"></i>
              </button>
              {/* <button
          className="icon-button delete-btn p-button"
          onClick={() => alert(`Deleting campaign: ${rowData.campaignName}`)}
        >
          <i className="pi pi-trash"></i>
        </button> */}
            </div>
          )}
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
}

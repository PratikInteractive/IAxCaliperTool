"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/styles/dashboad.module.css";
import editIcon from "@/app/assets/edit.svg";
import Image from "next/image";

export default function Page() {

  const role = localStorage.getItem('role');
  console.log("Client Dashboard Role", role);
  if(role !== "coe") {
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

  const handleEdit = (rowData) => {
    // Store rowData in session storage or pass as query params

    console.log("rowData", rowData)
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
        <Column field="totalBudget" header="Total Budget" sortable />
        <Column field="status" header="Status"
          body={(rowData) => (
            <span className={rowData.status}> {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}</span>
          )}
        />
        <Column field="comment" header="Comments" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn secondary icon"
                onClick={() => handleEdit(rowData)}
              >
                <Image src={editIcon} width={20} height={20} alt="Edit" />
              </button>
            </div>
          )}
          bodyClassName="text-center"
        />
      </DataTable>
    </div>
  );
}

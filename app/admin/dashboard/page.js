"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/styles/dashboad.module.css"


export default function Page() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = 10;
  const [first, setFirst] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const loggedInUser = sessionStorage.getItem("user_id");
        if (!loggedInUser) {
          alert("Please Login");
          return;
        }
        const payload = {
          loggedInUser: loggedInUser,
        };
        const response = await axios.post(
          `${apiUrl}caliper/digitalEntrant/caliperSelfServeApi.jsp?action=viewCaliperClients`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data) {
          setClients(response.data.viewCaliperClientResponseList || []);
          console.log("response.data.viewCaliperClientResponseList =>>>", response.data.viewCaliperClientResponseList)
        } else {
          console.error("API response error:", response.data ? response.data.error : "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching clients:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClients();
  }, []);


  return (
    <div className={`container ${styles.dashboard}`}>
      <div className={styles.dashboard_block}>
        <h2>Client List</h2>
        <Link href="/admin/client-creation">
          <Button className="btn primary">Create Client</Button>
        </Link>
      </div>
      <DataTable
        value={clients}
        stripedRows
        rows={rows}
        first={first}
        onPage={(e) => setFirst(e.first)}
        className="p-datatable-customers custom-table"
        showGridlines
        dataKey="clientName" 
        emptyMessage="No Client found."
        loading={loading}
      >
        {/* Define the columns to display */}
        <Column field="clientName" header="Client Name" sortable />
        <Column field="clientEmail" header="Client Email" sortable />
        <Column field="clientType" header="Client Type" sortable />
        <Column field="googleAccountId" header="Google Account ID" sortable />
        {/* <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="icon-button edit-btn p-button"
                onClick={() => alert(`Editing Client: ${rowData.clientName}`)}
              >
                <i className="pi pi-pencil"></i>
              </button>
              <button
                className="icon-button delete-btn p-button"
                onClick={() => alert(`Deleting Client: ${rowData.clientName}`)}
              >
                <i className="pi pi-trash"></i>
              </button>
            </div>
          )}
          bodyClassName="text-center"
        /> */}
      </DataTable>
    </div>
  );
}
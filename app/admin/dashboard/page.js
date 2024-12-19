"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/styles/dashboad.module.css"
import { useRouter } from "next/navigation";
import editIcon from "@/app/assets/edit.svg";
import Image from "next/image";

export default function Page() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = 10;
  const [first, setFirst] = useState(0);

  const router = useRouter()

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
  
  // Edit Functionality
  const handleEditClient = (clientName) => {
    // console.log("Editing Client:", clientName); 
    // router.push(`/admin/edit-client?clientName=${encodeURIComponent(clientName)}`); 

    sessionStorage.setItem('clientName',clientName);
    window.location.href = "/admin/edit-client";
  };

  return (
    <div className={`container ${styles.dashboard}`}>
      <div className={`${styles.dashboard_block}`}>
        <h2>Edit Client</h2>
        <div className={styles.two_buttons}>
        <Link href="/admin/client-user-creation">
          <Button className="btn primary">Create User</Button>
        </Link>
        <Link href="/admin/client-creation">
          <Button className="btn primary">Client Setup</Button>
        </Link>
        </div>
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
        <Column field="userId" header="User ID" sortable />
          <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <button
                className="btn primary icon"
                onClick={() => handleEditClient(rowData.clientName)}
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
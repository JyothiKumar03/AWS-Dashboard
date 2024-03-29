import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import {
  listHostedZones,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
} from "../APIs/dnsAPIs"; // Import API functions
import { UserPlusIcon } from "@heroicons/react/24/solid";
import CreateDNSRecord from "./createDNSpopup";
import UpdateDNSRecord from "./updateDNSpopup";
import { ToastContainer } from "react-toastify";

const TABLE_HEAD = ["Domain Name", "Type", "Value", ""];

function Dashboard() {
  const [dnsRecords, setDNSRecords] = useState([]);
  const [isCreateOrUpdateDNSRecordOpen, setIsCreateOrUpdateDNSRecordOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const filteredDNSRecords = dnsRecords.filter((record) =>
    record.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    fetchDNSRecords();
  }, []);

  const fetchDNSRecords = async () => {
    try {
      const data = await listHostedZones();
      setDNSRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdateDNSRecord = async (recordData, ttl) => {
    try {
      if (recordToUpdate) {
        await updateDNSRecord(recordToUpdate.id, recordData, ttl);
      } else {
        await createDNSRecord(recordData);
      }
      fetchDNSRecords();
      setIsCreateOrUpdateDNSRecordOpen(false); // Close the popup after successful creation or update
      setRecordToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleUpdateDNSRecord = (record) => {
    setRecordToUpdate(record);
    setIsCreateOrUpdateDNSRecordOpen(true);
  };
  
  const handleDeleteDNSRecord = async (record) => {
    try {
      await deleteDNSRecord(record.id, record);
      fetchDNSRecords(); // Refresh DNS records after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
   
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between mb-4 ">
          <div className="w-1/3">
          <Button
            className="flex items-center gap-3"
            size="sm"
            onClick={() => setIsCreateOrUpdateDNSRecordOpen(true)}
          >
            <UserPlusIcon strokeWidth={2} className="h-4 " />
            Create Record
          </Button>
          </div>
          <div className="w-2/3">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-2/3" />}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll px-0">
        
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"></th>{" "}
              
            </tr>
          </thead>
          <tbody>
            {dnsRecords.length > 0 ? (
              (console.log(dnsRecords),
              dnsRecords.map((record, index) => (
                <tr key={index}>
                  <td className="p-4">{record.Name}</td>
                  <td className="p-4">{record.Type}</td>
                  <td className="p-4">{record.ResourceRecords[0].Value}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateDNSRecord(record)}
                        size="sm"
                        className="bg-blue-500"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDeleteDNSRecord(record)}
                        size="sm"
                        color="red"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )))
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length + 1} className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    No DNS records available.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      {/* Render the CreateDNSRecord component as a popup */}
      {isCreateOrUpdateDNSRecordOpen && (
        <CreateDNSRecord
          onSubmit={handleCreateOrUpdateDNSRecord}
          onClose={() => setIsCreateOrUpdateDNSRecordOpen(false)}
        />
      )}

      {/* Render the UpdateDNSRecord component as a popup */}
      {recordToUpdate && (
        <UpdateDNSRecord
          initialDomainName={recordToUpdate.Name}
          initialRecordType={recordToUpdate.Type}
          initialRecordValue={recordToUpdate.ResourceRecords[0].Value}
          initialTTL={recordToUpdate.TTL}
          onSubmit={handleCreateOrUpdateDNSRecord}
          onClose={() => {
            setIsCreateOrUpdateDNSRecordOpen(false);
            setRecordToUpdate(null);
          }}
        />
      )}

    </Card>
    
    </>
  );
}

export default Dashboard;

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

import { UserPlusIcon } from "@heroicons/react/24/solid";
import CreateDomain from "./CreateDomainpopup";
import UpdateDNSRecord from "./updateDNSpopup";
import { ToastContainer } from "react-toastify";
import { listDomains, createDomain , deleteDomain } from "../APIs/domainAPIs";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["Name", "ResourceRecordSetCount"];

function HostingZoneDashboard() {
  const [domainEntries, setdomainEntries] = useState([]);
  const [isCreateOrUpdateDNSRecordOpen, setIsCreateOrUpdateDNSRecordOpen] =
    useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // const filtereddomainEntries = domainEntries.filter((record) =>
  //   record.Name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const data = await listDomains();
      setdomainEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdateDomain = async (recordData, ttl) => {
    try {
      if (recordToUpdate) {
        await updateDomain(recordToUpdate.id, recordData, ttl);
      } else {
        console.log(recordData);
        await createDomain(recordData);
      }
      fetchDomains();
      setIsCreateOrUpdateDNSRecordOpen(false); // Close the popup after successful creation or update
      setRecordToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDomain = (record) => {
    setRecordToUpdate(record);
    setIsCreateOrUpdateDNSRecordOpen(true);
  };

  const handleDeleteDomain = async (domainId) => {
    try {
      const hostedZoneId = domainId.split("/").pop();
      await deleteDomain(hostedZoneId);
      fetchDomains(); // Refresh Domains after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const handleviewRecords = (hostedZoneId,domainName) => {
    console.log(hostedZoneId);
    const domainId = hostedZoneId.split("/").pop(); // Extract the domain ID
    navigate(`/records?code=${encodeURIComponent(domainId)}`,{ state: { title: domainName } });
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
                Create Domain
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
              {domainEntries?.length > 0 ? (
                (console.log(domainEntries),
                domainEntries.map((record, index) => (
                  <tr key={index}>
                    <td className="p-4">{record.Name}</td>
                    <td className="p-4">{record.ResourceRecordSetCount}</td>
                    {/* <td className="p-4">{record.ResourceRecords[0].Value}</td> */}
                    <td className="flex gap-2 p-4">
                      {record.ResourceRecordSetCount <= 2 ? (
                        <div className="mt-4 gap-2">
                          <Button
                            onClick={() => handleUpdateDNSRecord(record)}
                            size="sm"
                            className="bg-blue-500 mr-3"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => handleDeleteDomain(record.Id)}
                            size="sm"
                            color="red"
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <h2 className="mt-4 gap-2">
                          You can delete Zone only after deleting all records
                        </h2>
                      )}
                      <div className="p-4">
                        {console.log(record.Id)}
                        <Button
                          onClick={() => handleviewRecords(record.Id,record.Name)}
                          size="sm"
                          color="red"
                        >
                          View Records
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
          <CreateDomain
            onSubmit={handleCreateOrUpdateDomain}
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

export default HostingZoneDashboard;

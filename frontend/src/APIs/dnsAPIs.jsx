import axios from "axios";

const DNSAPIs = axios.create({
  // baseURL: "http://localhost:8080/api/dns",
  baseURL : `https://aws-dashboard.onrender.com/api/dns`
});

export async function listHostedZones() {
  try {
    const response = await DNSAPIs.get("/hostedZones");
    return response.data;
  } catch (error) {
    console.error(error.message);
   
  }
}

export async function createDNSRecord(dnsRecordData) {
  try {
    const response = await DNSAPIs.post("/dns", dnsRecordData);
     
    return response.data;
  } catch (error) {
    console.error(error.message);
     
  }
}

export async function updateDNSRecord(id, dnsRecordData, ttl) {
  try {
    if (ttl) {
      dnsRecordData.TTL = ttl;
    }
    console.log('DNS - ',dnsRecordData,ttl)
    const response = await DNSAPIs.put(`/dns/${id}`, dnsRecordData);
    return response.data;
  } catch (error) {
    console.error(error.message);
    
  }
}

export async function deleteDNSRecord(id, record) {
  try {
    const response = await DNSAPIs.delete(`/dns/${id}`, { data: record });
     
    return response.data;
  } catch (error) {
    console.error(error.message);
   
  }
}

import axios from "axios";

const DNSAPIs = axios.create({
  // baseURL: "http://localhost:8080/api/dns",
  baseURL : `https://aws-dashboard.onrender.com/api/dns`
});

export async function listHostedZones(code) {
  try {
    const hostedZoneId = code
    const response = await DNSAPIs.get(`/hostedZones/${hostedZoneId}`);
    return response.data;
  } catch (error) {
    console.error(error.message);
   
  }
}

export async function createDNSRecord(dnsRecordData, code) {
  try {
    const response = await DNSAPIs.post("/dns", {dnsRecordData,code});
     
    return response.data;
  } catch (error) {
    console.error(error.message);
     
  }
}

export async function updateDNSRecord(id, dnsRecordData, ttl, code) {
  try {
    if (ttl) {
      dnsRecordData.TTL = ttl;
    }
    console.log('DNS - ',dnsRecordData,ttl)
    const response = await DNSAPIs.put(`/dns/${id}`, {dnsRecordData,code});
    return response.data;
  } catch (error) {
    console.error(error.message);
    
  }
}

export async function deleteDNSRecord(id, record, code) {
  try {
    const response = await DNSAPIs.delete(`/dns/${id}?code=${code}`, { data: record });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}


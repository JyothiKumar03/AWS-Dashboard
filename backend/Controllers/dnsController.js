// controllers/dnsController.js

import Route53 from "aws-sdk/clients/route53.js";
import 'dotenv/config';
import AWS from 'aws-sdk';


AWS.config.update({
  accessKeyId: process.env.AccessID,
  secretAccessKey: process.env.AccessKey,
  region: process.env.region,
});
// Create a new Route53 object
const route53 = new Route53();

// Controller to list hosted zones
// export const listHostedZones = async (req, res) => {
//   try {
//     const data = await route53.listHostedZones().promise();
//     res.json(data.HostedZones);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const listHostedZones = async (req, res) => {
  try {
    const {hostedZoneId} =  req.params;
    console.log(hostedZoneId);
    const { HostedZones } = await route53.listHostedZones().promise();
    // const hostedZoneId = HostedZones[0].Id; 
    
    const params = {
      HostedZoneId: hostedZoneId
    };

    const data = await route53.listResourceRecordSets(params).promise();
    const records = data.ResourceRecordSets;

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to create a new DNS record
export const createDNSRecord = async (req,res) => {
  try {
    const {dnsRecordData, code} = req.body;
    const {domainName, recordType, recordValue} = dnsRecordData
    console.log('rq-body - ',req.body);
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: domainName,
              Type: recordType,
              TTL: 300, // TTL in seconds
              ResourceRecords: [{ Value: recordValue }],
            },
          },
        ],
      },
      HostedZoneId: code
    };

    const data = await route53.changeResourceRecordSets(params).promise();

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to create DNS record');
  }
};

// Controller to update a DNS record
export const updateDNSRecord = async (req, res) => {
  try {
    const {dnsRecordData, code} = req.body;
    console.log('update - ',req.body)
    if (dnsRecordData.recordType !== 'SOA') {
      const params = {
        HostedZoneId: req.body.code, // Replace with your hosted zone ID
        ChangeBatch: {
          Changes: [
            {
              Action: 'UPSERT',
              ResourceRecordSet: {
                Name: dnsRecordData.Name,
                Type: dnsRecordData.Type,
                TTL: dnsRecordData.ttl, 
                ResourceRecords: [
                  {
                    Value: dnsRecordData.Value,
                  },
                ],
              },
            },
          ],
        },
      };
      await route53.changeResourceRecordSets(params).promise();
      res.json({ message: "DNS record updated successfully" });
    } else {
      res.status(400).json({ message: "Cannot update SOA record" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller to delete a DNS record
export const deleteDNSRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Type, ResourceRecords, TTL } = req.body;
    const { code } = req.query; // Extract code from URL query parameters
    console.log('del - ', req.body)
    console.log('del - ', req.query, req.params);
    // Check if the record type is not SOA before proceeding with deletion
    if (Type !== 'SOA') {
      const params = {
        HostedZoneId: code,
        ChangeBatch: {
          Changes: [
            {
              Action: 'DELETE',
              ResourceRecordSet: req.body
            },
          ],
        },
      };

      
      await route53.changeResourceRecordSets(params).promise();

      
      res.json({ message: "DNS record deleted successfully" });
    } else {
      // If trying to delete a SOA record, send a message indicating it's not allowed
      res.status(400).json({ message: "Cannot delete the SOA record. Hosted zone must contain exactly one SOA record." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


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
    const { HostedZones } = await route53.listHostedZones().promise();
    const hostedZoneId = HostedZones[0].Id; // Assuming you have only one hosted zone
    
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
    const {domainName, recordType, recordValue} = req.body;
    console.log('rq-body - ',req.body);
    // Construct parameters for the change resource record sets request
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
      HostedZoneId: 'Z091167816II1GE10RJ8M' // The hosted zone ID for your domain
    };

    // Send the change resource record sets request to create the DNS record
    const data = await route53.changeResourceRecordSets(params).promise();

    console.log(data);

    return data; // Return the response from the AWS API
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to create DNS record');
  }
};

// Controller to update a DNS record
export const updateDNSRecord = async (req, res) => {
  try {
    // Implement logic to update DNS record
    const record = req.body;
    console.log('update - ',req.body)
    if (record.recordType !== 'SOA') {
      const params = {
        HostedZoneId: 'Z091167816II1GE10RJ8M', // Replace with your hosted zone ID
        ChangeBatch: {
          Changes: [
            {
              Action: 'UPSERT',
              ResourceRecordSet: {
                Name: req.body.domainName,
                Type: req.body.recordType,
                TTL: 300, 
                ResourceRecords: [
                  {
                    Value: req.body.recordValue,
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
    console.log('del - ', req.body);
    // Check if the record type is not SOA before proceeding with deletion
    if (Type !== 'SOA') {
      const params = {
        HostedZoneId: 'Z091167816II1GE10RJ8M',
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


import AWS from 'aws-sdk';
import Route53 from "aws-sdk/clients/route53.js";
import 'dotenv/config';

AWS.config.update({
  accessKeyId: process.env.AccessID,
  secretAccessKey: process.env.AccessKey,
  region: process.env.region,
});

const route53 = new Route53();

export const listDomains = async(req,res) => {
    try {
      const result = await route53.listHostedZones().promise();
    //   console.log('call received - ', result)
      return res.status(200).json({"hostedZones":result.HostedZones});
    } catch (error) {
      console.error('Error listing hosted zones:', error);
      throw error;
    }
  }

export const createHostedZone = async (req,res)=>{
    try {
      const {domainName,description} = req.body;
      console.log(req.body)
      if (!domainName){
        return res.status(400).json("Domain name is required");
        }

        const params = {
            CallerReference: `${Date.now()}`,
            Name: domainName,
            HostedZoneConfig: {
              Comment: description // Use HostedZoneConfig.Comment instead of Description
            }
          };
          
  
      const result = await route53.createHostedZone(params).promise();
      return res.status(201).json(result.HostedZone.Id)
    } catch (error) {
      console.error('Error creating hosted zone:', error);
      return res.status(500).json('Error deleting hosted zone:', error);
      
    }
  }
  
  export const deleteHostedZone = async (req,res) => {
    try {
      const {hostedZoneId} = req.params
      console.log('id- ',req.params)
      const params = {
        Id: hostedZoneId, // The ID of the hosted zone to be deleted
      };
      const result = await route53.deleteHostedZone(params).promise();
      console.log('Hosted zone deleted:', hostedZoneId);
      return res.status(200).json("Successfully Deleted the Record")
    } catch (error) {
      return  res.status(500).json('Error deleting hosted zone:', error);
    }
  }
  
  
// routes/dnsRoutes.js

import express from "express";
import {
  listHostedZones,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
} from "../Controllers/dnsController.js"
import Route53 from "aws-sdk/clients/route53.js";

const router = express.Router();

router.get("/hostedZones/:hostedZoneId", listHostedZones);
router.post("/dns", createDNSRecord);
router.put("/dns/:id", updateDNSRecord);
router.delete("/dns/:id", deleteDNSRecord);

export default router;

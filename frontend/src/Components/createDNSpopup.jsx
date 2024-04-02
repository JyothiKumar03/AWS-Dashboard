import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useLocation , useParams} from "react-router-dom";

const CreateDNSRecord = ({onSubmit, onClose }) => {
  // const [domainName, setDomainName] = useState("");
  const [recordType, setRecordType] = useState("");
  const [recordValue, setRecordValue] = useState("");
  const location = useLocation();
  const { title } = location.state || {};
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const handleRecordTypeChange = (event) => {
    const selectedType = event.target.value;
    setRecordType(selectedType);
    switch (selectedType) {
      case "A":
        setRecordValue("192.0.2.1");
        break;
      case "AAAA":
        setRecordValue("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        break;
      case "CNAME":
        setRecordValue("example.com");
        break;
      case "MX":
        setRecordValue("10 mail.example.com");
        break;
      case "NS":
        setRecordValue("ns1.example.com");
        break;
      case "PTR":
        setRecordValue("example.com");
        break;
      case "SOA":
        setRecordValue("ns1.example.com hostmaster.example.com 2022032801 7200 3600 1209600 3600");
        break;
      case "SRV":
        setRecordValue("0 5 5269 xmpp-server.example.com");
        break;
      case "TXT":
        setRecordValue("sample text");
        break;
      case "DNSSEC":
        setRecordValue("true");
        break;
      default:
        setRecordValue("");
    }
  };
  

  const handleSubmit = () => {
    const newDNSRecord = {
      domainName:title,
      recordType,
      recordValue,
    };

    onSubmit(newDNSRecord);
  };

  return (
    <Popover
      open={true} // Assuming this component is always open when called
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 4 }}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Create DNS Record
        </Typography>
        <Typography variant="body1" gutterBottom>
          Domain Name
        </Typography>
        <TextField
          fullWidth
          id="domain-name"
          value={title}
          disabled
          // onChange={(e) => setDomainName(e.target.value)}
        />
        <Typography variant="body1" gutterBottom>
          Record Type
        </Typography>
        <Select
          value={recordType}
          onChange={handleRecordTypeChange}
          fullWidth
          id="record-type"
        >
          <MenuItem value="A">A (Address)</MenuItem>
          <MenuItem value="AAAA">AAAA (IPv6 Address)</MenuItem>
          <MenuItem value="CNAME">CNAME (Canonical Name)</MenuItem>
          <MenuItem value="MX">MX (Mail Exchange) Record</MenuItem>
          <MenuItem value="NS">NS (Name Server) Record</MenuItem>
          <MenuItem value="PTR">PTR (Pointer) Record</MenuItem>
          <MenuItem value="SOA">SOA (Start of Authority) Record</MenuItem>
          <MenuItem value="SRV">SRV (Service) Record</MenuItem>
          <MenuItem value="TXT">TXT (Text) Record</MenuItem>
        <MenuItem value="DNSSEC">DNSSEC</MenuItem>
        </Select>
        <Typography variant="body1" gutterBottom>
          Record Value
        </Typography>
        <TextField
          fullWidth
          id="record-value"
          value={recordValue}
          onChange={(e) => setRecordValue(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Create DNS Record
        </Button>
      </Box>
    </Popover>
  );
};

export default CreateDNSRecord;

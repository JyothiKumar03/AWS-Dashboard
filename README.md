# DNS Manager

## Overview

DNS Manager is a web application designed to provide a central dashboard for automating the management of domains and DNS records in bulk on AWS Route 53.

## Features

- Standardizes on the MERN stack for frontend, backend, and infrastructure layers.
- Seamless integration with AWS Route 53.
- User-friendly dashboard for uploading/viewing  domains and DNS records.
- Supports various DNS record types including A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, TXT, and DNSSEC.
- Forms and modals for adding, editing, and deleting DNS record entries.
- Filters and search options for easy bulk data navigation.
- Graphical charts and metrics for domain and record type distribution.
- Integration of CSV or JSON bulk uploads for domain/records data.
- Backend API endpoints for CRUD operations on DNS records.
- Secure user authentication and authorization.

## Setup

##Clone the repository:

```bash
git clone https://github.com/JyothiKumar03/AWS-Dashboard

```

Install dependencies:

```bash
npm install
```

ENV FILE IN BACKEND - 

``` bash
export AWS_ACCESS_KEY_ID=<Your AWS Access Key ID>
export AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>
export AWS_REGION=<Your AWS Region>
```

Start the development server:

``` bash
npm start
```

## ScreenShots

<img width="957" alt="image" src="https://github.com/JyothiKumar03/AWS-Dashboard/assets/88045362/d39f20bc-3ed6-4865-9b4a-0dbc2363ce36">

<img width="952" alt="image" src="https://github.com/JyothiKumar03/AWS-Dashboard/assets/88045362/e190c3cd-1748-4a9b-91de-37a2fed27941">


## Enhancements
Implement dynamic creation of multiple IAM users through code.

## Resources
AWS Route 53 Documentation  [https://aws.amazon.com/route53/]

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



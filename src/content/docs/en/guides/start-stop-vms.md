---
title: "Automatically Start or Stop Azure VMs by Tag"
description: "Step-by-step tutorial on implementing an Azure Automation runbook that starts or stops virtual machines based on tag values."
pubDate: "2025-05-28"
tags: ["Azure", "Runbook", "Automation", "DevOps"]
---

> This article is a **how-to guide**. If you're looking for theoretical background or architectural context, check out the [reference article on Azure Automation Runbooks](/docs/en/reference/azure-runbooks).

## Goal

Learn how to automate starting or stopping Azure virtual machines using Python and Azure Automation, based on VM tags such as `availability: bizhours`.

---

## Prerequisites

- Azure subscription
- At least one VM with a tag like `availability: bizhours`
- Azure Automation Account
- Managed Identity (System-Assigned or User-Assigned)
- Contributor or scoped permissions to control VMs and read the Networks (this runbook identifies VMs by tag, but verifies IPs for report)

---

## Step-by-Step Guide

### 1. Create or Use an Automation Account

Go to the Azure portal:
- Navigate to **Automation Accounts**
- Create a new account or select an existing one
- Assign a **Managed Identity** in the "Identity" section
- Assign RBAC roles to that identity for VM management (e.g. “Virtual Machine Contributor”)

---

### 2. Import Required Modules

In the **Modules gallery** of the Automation Account, ensure these python modules are present and updated:
- `Az.Accounts`
- `Az.Compute`
- `Az.Resources`

> You can search and import them on https://pypi.org/project/azure/ if not already present.
> Note: Only module files with ".whl" extension can be uploaded to Azure.

---

### 3. Create the Python 3 Runbook

- Go to **Runbooks** → **Create a runbook**
- Name: `start-stop-vms-by-tag`
- Runtime: Python 3
- Paste the script from this [GitHub repo](https://github.com/IriW/azure-automation-runbooks/blob/main/start-stop-vms/start-stop-vms-by-tag.py)

---

### 4. Test and Publish

- Use the “Test pane” to try it with parameters like:
  - `--tag_name=availability`
  - `--tag_value=bizhours`
  - `--shutdown=True`
  - `--email_list=emai2@addres.com;email1@addres.com`
- Review the logs
- Publish the runbook

---

### 5. Schedule the Runbook

Create two schedules:
- Morning schedule (e.g., 08:00): `startVMs`
- Evening schedule (e.g., 18:00): `stopVMs`

Both shchedules must provide parameters:
  - `--tag_name=availability`
  - `--tag_value=bizhours`
  - `--shutdown=False` for morning startup schedule 
  and
  - `--shutdown=True` for evening stopping schedule which will trigger VM shutdown -> Stopped(Deallocated) state.

Optionally, add email address(es) for shutdown/startup report:
  - `--email_list=emai2@addres.com;email1@addres.com`

Link parameters to the runbook via the **Parameters and Run Settings**.
Once attached, schedule parameters can not be changed. To change those detach schedule and add it again with desired parameters.

---

## Next Steps

- Add more tags for different teams or resource groups
- Explore error handling and notification via Log Analytics or email
- You can also convert this to PowerShell or extend it to other Azure resources

---

## Learn More

See the [reference article for theory and deeper understanding](/en/reference/azure-runbooks).

---
title: "Understanding Azure Automation Runbooks"
description: "A conceptual overview of Azure Automation Runbooks, supported languages, modules, and execution flow."
pubDate: "2025-05-28"
tags: ["Azure", "Automation", "Infrastructure", "Runbooks"]
---

> This is a **reference** article. If you’re looking to implement a runbook in practice, check out the [step-by-step guide on start-stop VMs by tag](/en/guides/start-stop-vms).

## What is Azure Automation?

Azure Automation provides an environment to automate processes across Azure and on-premises. It allows you to:
- Run scheduled tasks (start/stop VMs, clean resources)
- Use Python, PowerShell, or graphical workflows
- Centralize control logic for infrastructure

---

## Supported Languages

You can write Runbooks in:
- **PowerShell** (preferred for broader module support)
- **Python 2 or 3** (Python 3 recommended but sandboxed)
- **Graphical** or **Hybrid Workers**

---

## Identity and Access

Runbooks authenticate to Azure using:
- **Managed Identity** (Recommended)
- **Run As Accounts** (Deprecated)

The identity must have permissions to the resources being managed. For VM control:
- Assign `Virtual Machine Contributor` at resource group or subscription level.
- Assign the `Network Contributor` role if you are using the feature to send a report via email with the list of virtual machines and IPs on which operations were performed.

---

## Dependencies: Modules

Azure modules must be explicitly added to the Automation Account.

Common required modules:
- `Az.Accounts` – Authentication
- `Az.Compute` – VM operations
- `Az.Resources` – Tag and resource group filtering

Use the **Modules Gallery** to import/update these.

> You can search and import them on https://pypi.org/project/azure/ if not already present.
> Note: Only module files with ".whl" extension can be uploaded to Azure.

---

## Sample Flow from a Python Runbook

This is the logic behind the guide [start-stop-vms](/en/guides/start-stop-vms) by tag:

1. Authenticate using the managed identity
2. Filter VMs based on a tag (`availability: bizhours`)
3. Loop through filtered VMs
   - If `shutdown == false`, start them
   - If `shutdown == true`, stop them
4. Log the action result
5. Email the result

The [Python script is on GitHub](https://github.com/IriW/azure-automation-runbooks/blob/main/start-stop-vms/start-stop-vms-by-tag.py)

---

## Best Practices and Alternatives

- Prefer using PowerShell for richer module and error-handling support
- Consider Azure Functions for serverless automation
- Implement tagging governance with Azure Policy
- Use Log Analytics to collect runbook logs

---

## Further Reading

- [Microsoft Docs: Azure Automation](https://learn.microsoft.com/en-us/azure/automation/)
- [Diátaxis documentation framework](https://diataxis.fr/)

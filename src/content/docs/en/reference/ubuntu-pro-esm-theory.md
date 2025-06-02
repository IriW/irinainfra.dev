---

title: "Ubuntu PRO and ESM: Concepts and Practical Considerations"
description: "Reference guide for understanding Ubuntu PRO, Canonical ESM, and associated system management practices."
pubDate: "2025-05-20"
tags: ["Ubuntu", "ESM", "Patching", "Security", "Infrastructure"]
------------------------------------------------------------------

> For hands-on instructions, visit the [Ubuntu PRO Implementation Guide](/en/guides/ubuntu-pro-esm-guide).

---

## What is Ubuntu PRO?

Ubuntu PRO is a paid version of Ubuntu offered by Canonical. It extends the security coverage of the OS, covering:

* Universe and Main repositories
* Kernel and system components
* FIPS-compliant cryptographic modules
* Compliance reporting and hardening tools

It is ideal for production environments where patching and compliance are critical.

---

## What is ESM (Extended Security Maintenance)?

Canonical ESM allows you to receive security updates for critical packages after the 5-year standard support ends.

### Available Services:

* `esm-infra`: Security updates for infrastructure components (init, systemd, etc.)
* `esm-apps`: Security patches for application packages in the universe repository
* `livepatch`: Kernel patching without reboot (only on LTS kernels)

---

## How ESM Integrates With Ubuntu

Once activated, ESM adds its own APT source lists (e.g. `/etc/apt/sources.list.d/ubuntu-esm-*.list`) and modifies `apt.conf` to enable hook-based updates.

The `ubuntu-advantage-tools` package (CLI: `ua` or `pro`) is used to manage the subscription.

---

## Ubuntu PRO on Azure

VMs can be provisioned with Ubuntu PRO images directly from Azure Marketplace, or existing Ubuntu VMs can be updated by setting `--license-type UBUNTU_PRO`.

Azure-native Ubuntu PRO offers:

* Auto-attach feature via `pro auto-attach`
* No manual token configuration needed
* Compatible with standard patch automation workflows
* Pay-as-you-go model - the license is billed per hours used: no payment for VMs with Stopped (Deallocated) status. If you remove entire VM - no previous license detachment needed.

---

## Managing Package Versions

Use the following mechanisms:

### 1. `apt-mark hold`

Prevents a package from being upgraded during `apt upgrade`.

```bash
sudo apt-mark hold mysql-server
```

### 2. APT Pinning

Create files in `/etc/apt/preferences.d/` to control versions:

```text
Package: mysql-server
Pin: version 5.7*
Pin-Priority: 1001
```

Pinning protects packages during dependency resolution (e.g., upgrades affecting mysql-client).

---

## Security Updates vs. Full Upgrades

* `apt upgrade` installs only upgrades that do not remove/install additional packages.
* `apt full-upgrade` (or `dist-upgrade`) allows more aggressive dependency changes.

When using `apt-mark hold`, security updates **within the held version** can still apply unless blocked by pinning.

---

## Common Pitfalls and Mitigations

| Issue                      | Description                              | Mitigation                                 |
| -------------------------- | ---------------------------------------- | ------------------------------------------ |
| Broken upgrades            | MySQL upgraded to 8.0, breaking 5.7 apps | Use `apt-mark hold` and APT pinning        |
| Kernel version mismatch    | New kernel installed but not booted      | Reboot VM or use `canonical-livepatch`     |
| ESM not delivering patches | ESM services not enabled                 | Check `pro status`, enable esm-\* manually |
| Repo signature errors      | GPG key issues with custom MySQL repo    | Use `apt-key` or disable problematic repos |

---

## Key CLI Tools

| Command                  | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `pro status`             | View current ESM service status           |
| `ua attach <token>`      | Attach to a paid subscription             |
| `pro auto-attach`        | Auto-attach in Azure                      |
| `apt-mark showhold`      | Show held packages                        |
| `apt-cache policy <pkg>` | Show version priorities                   |
| `needrestart`            | Check if reboot is required after upgrade |

---

## Further Reading

* [Canonical ESM Documentation](https://ubuntu.com/security/esm)
* [Azure Ubuntu Pro Docs](https://learn.microsoft.com/en-us/azure/virtual-machines/workloads/canonical/ubuntu-pro-in-place-upgrade)
* [Ubuntu PRO Implementation Guide](/en/guides/ubuntu-pro-esm-guide)

---

*Last updated: 2025-06-02*

---

title: "Enable Ubuntu PRO, Patch Securely, and Preserve MySQL 5.7"
description: "Step-by-step guide for enabling Ubuntu PRO (Canonical or Azure), configuring package pinning and apt-mark hold for legacy services, and safely automating security patching."
pubDate: "2025-06-01"
tags: ["Ubuntu", "Ubuntu PRO", "ESM", "MySQL", "Apache", "Security"]
---

> This is a **how-to guide**. For theory and background on Ubuntu ESM, apt pinning, and patch safety, see the [reference article](/en/reference/ubuntu-pro-esm-theory).

---

## Prerequisites

* OS: Ubuntu 18.04 or 20.04
* Services: Apache2 (proxy), MySQL (5.7 or 8.0)
* Optional (if using Azure IaaS): Azure VM access (CLI)

---

## Step 1: System State and Backup

```bash
lsb_release -a
uname -r
apache2 -v
mysql --version
apache2ctl -S
```

Backup critical files:

```bash
sudo cp -a /etc/apache2 /var/backups/apache2_$(date +%F)
sudo mysqldump -u root -p --all-databases > /var/backups/db_backup_$(date +%F).sql
```

---

## Step 2: Lock MySQL 5.7 (Optional)

If you use mysql 5.7 on Ubuntu 20, upgrade without mysql packages hold may force upgrade to MySQL8. To avoid this, hold the version 5.7. Check your packages and lock the ones, that are installed in your case:

```bash
dpkg -l |grep mysql
sudo apt-mark hold libmysqlclient20 \
  mysql-client-5.7 mysql-client-core-5.7 \
  mysql-common mysql-server-5.7 mysql-server-core-5.7
```

Create pinning file:

```bash
sudo vim /etc/apt/preferences.d/mysql
```

```text
Package: mysql-server-5.7
Pin: version 5.7*
Pin-Priority: 1001

Package: mysql-common
Pin: version 5.8+1.0.4
Pin-Priority: 1001
```

Validate:

```bash
apt-mark showhold
apt-cache policy mysql-server
```

---

## Step 3: Enable Ubuntu PRO / ESM

### Canonical Token

```bash
sudo apt install ubuntu-advantage-tools
sudo pro attach <your--canonical-token>
sudo pro enable esm-infra
sudo pro enable esm-apps
sudo pro enable livepatch
```

### Azure-native Ubuntu PRO

In Azure CLI log in to your subscription with `az login`, choose your subscription and run the following command:

```bash
az vm update -g <rg> -n <vm> --license-type UBUNTU_PRO
```

On the VM itself run:

```bash
sudo apt install ubuntu-advantage-tools
sudo pro auto-attach
```

Check status:

```bash
pro status
```

---

## Step 4: Patch with Automation

```bash
sudo apt update
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

Dry run:

```bash
sudo unattended-upgrade -d --dry-run
```

Full patch (interactive):

```bash
sudo apt upgrade -y
```

---

## Step 5: Reboot Consideration

Livepatch may avoid reboots for kernel CVEs, but not for kernel **version** updates:

```bash
uname -r
```

If newer kernel pending:

```bash
sudo reboot
```

---

## Post-Patch Checks

```bash
systemctl status mysql
systemctl status apache2
journalctl -xe
```

---

## Next Steps

* Monitor logs: `/var/log/mysql`, `/var/log/apache2`, `journalctl`.
* Remove pin/hold MySQL 5.7 when migration to MySQL 8 is complete.
* See [reference article](/en/reference/ubuntu-pro-esm-theory) for full technical explanation.

---
title: "Automatyczne uruchamianie i wyłączanie maszyn wirtualnych Azure na podstawie tagów"
description: "Przewodnik krok po kroku, jak wdrożyć runbook Azure Automation, który uruchamia lub zatrzymuje maszyny wirtualne na podstawie wartości tagów."
pubDate: "2025-05-28"
tags: ["Azure", "Runbook", "Automatyzacja", "DevOps"]
---

> Ten artykuł to **praktyczny przewodnik**. Jeśli szukasz kontekstu teoretycznego lub architektonicznego, zajrzyj do [artykułu referencyjnego o Azure Automation Runbooks](/pl/reference/azure-runbooks).

## Cel

Nauczysz się, jak zautomatyzować uruchamianie lub zatrzymywanie maszyn wirtualnych Azure z użyciem Pythona i Azure Automation, na podstawie tagów typu `availability: bizhours`.

---

## Wymagania wstępne

- Subskrypcja Azure
- Przynajmniej jedna maszyna z tagiem np. `availability: bizhours`
- Konto Azure Automation
- Tożsamość zarządzana / Managed Identity (systemowa lub przypisana przez użytkownika)
- Uprawnienia typu "Contributor" lub dostęp o zakresie umożliwiającym zarządzanie VM i odczyt sieci (runbook identyfikuje maszyny po tagach, ale weryfikuje IP dla raportu)

---

## Krok po kroku

### 1. Utwórz (lub wybierz) konto Automation

W Azure Portal:
- Przejdź do **Automation Accounts**
- Utwórz nowe konto lub wybierz istniejące
- W zakładce **Identity** przypisz **Managed Identity**
- Przydziel rolę RBAC dla zarządzania VM (np. „Virtual Machine Contributor”)

---

### 2. Zaimportuj wymagane moduły

W Automation Account - **Modules gallery** upewnij się, że są dostępne i zaktualizowane następujące moduły Pythona:
- `Az.Accounts`
- `Az.Compute`
- `Az.Resources`

> Jeśli ich nie ma, możesz je znaleźć i zaimportować z https://pypi.org/project/azure/  
> Uwaga: Tylko pliki z rozszerzeniem `.whl` mogą być przesyłane do Azure.

---

### 3. Utwórz runbook w Python 3

- Przejdź do zakładki **Runbooks** → **Create a runbook**
- Nazwa: `start-stop-vms-by-tag`
- Środowisko uruchomieniowe: Python 3
- Wklej kod z tego [repozytorium GitHub](https://github.com/IriW/azure-automation-runbooks/blob/main/start-stop-vms/start-stop-vms-by-tag.py)

---

### 4. Przetestuj i opublikuj

- Użyj zakładki “Test pane”, aby przetestować z parametrami:
  - `--tag_name=availability`
  - `--tag_value=bizhours`
  - `--shutdown=True`
  - `--email_list=email2@adres.com;email1@adres.com`
- Sprawdź logi wykonania
- Opublikuj runbook

---

### 5. Zaplanuj harmonogram uruchomień

Utwórz dwa harmonogramy (Schedules):
- Rano (np. 08:00): `startVMs`
- Wieczorem (np. 18:00): `stopVMs`

Każdy harmonogram musi zawierać parametry:
- `--tag_name=availability`
- `--tag_value=bizhours`
- `--shutdown=False` (dla porannego uruchamiania)
- `--shutdown=True` (dla wieczornego wyłączania — przełącza VM w stan *Stopped (Deallocated)*)

Opcjonalnie: dodaj adres(y) e-mail do raportu:
- `--email_list=email2@adres.com;email1@adres.com`

Powiąż parametry z runbookiem przez **Parameters and Run Settings**.  
Po przypięciu harmonogramu jego parametry są zablokowane – aby je zmienić, odepnij harmonogram i przypnij ponownie z nowymi parametrami.

---

## Co dalej?

- Dodaj więcej tagów dla innych zespołów lub grup zasobów
- Dodaj obsługę błędów i powiadomień przez Log Analytics lub e-mail
- Możesz też przepisać runbook do PowerShell lub rozszerzyć go na inne zasoby Azure

---

## Więcej informacji

Zobacz [artykuł referencyjny dla kontekstu i teorii](/pl/reference/azure-runbooks).

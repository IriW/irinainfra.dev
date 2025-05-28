---
title: "Zrozumienie runbooków Azure Automation"
description: "Przegląd koncepcyjny runbooków Azure Automation, obsługiwanych języków, modułów i logiki działania."
pubDate: "2025-05-28"
tags: ["Azure", "Automatyzacja", "Infrastruktura", "Runbooki"]
---

> To jest artykuł typu **reference** (odniesienie). Jeśli chcesz przejść od razu do implementacji, zobacz [przewodnik krok po kroku o uruchamianiu i zatrzymywaniu maszyn wirtualnych na podstawie tagów](/pl/guides/start-stop-vms).

## Czym jest Azure Automation?

Azure Automation to środowisko do automatyzacji procesów w chmurze Azure oraz w środowiskach lokalnych. Umożliwia:
- Uruchamianie zadań zgodnie z harmonogramem (np. start/stop VM, czyszczenie zasobów)
- Pisanie runbooków w Pythonie, PowerShellu lub w postaci graficznych przepływów pracy
- Centralizację logiki sterowania infrastrukturą

---

## Obsługiwane języki

Runbooki mogą być tworzone w:
- **PowerShell** (preferowany ze względu na szerokie wsparcie modułów)
- **Python 3** (zalecany Python 3, ale działa w piaskownicy z ograniczeniami)
- **Graficzny** lub z użyciem **Hybrid Workers**

---

## Tożsamość i dostęp

Runbooki uwierzytelniają się do zasobów Azure za pomocą **Managed Identity** (zalecane)

Tożsamość musi mieć odpowiednie uprawnienia do zarządzanych zasobów. W przypadku maszyn wirtualnych:
- Przydziel rolę `Virtual Machine Contributor` na poziomie grupy zasobów lub subskrypcji, by móc wykonywać operacje na maszynach wirtualnych.
- Przydziel rolę `Network Contributor`, jeśli korzystasz z funkcji wysłania raportu na e-mail z listą wirtualnych maszyn i IP, na których wykonano operacje.

---

## Zależności: Moduły

Moduły Azure muszą być ręcznie dodane do konta Automation.

Najczęściej wymagane moduły to:
- `Az.Accounts` – uwierzytelnianie
- `Az.Compute` – operacje na maszynach wirtualnych
- `Az.Resources` – filtrowanie tagów i grup zasobów

Użyj **Galerii modułów**, aby je zaimportować lub zaktualizować.

---

## Przykładowy przebieg runbooka w Pythonie

Poniżej opisano logikę stojącą za przewodnikiem [start-stop-vms](/pl/guides/start-stop-vms):

1. Uwierzytelnienie przy użyciu managed identity
2. Filtrowanie maszyn wirtualnych na podstawie tagu (`availability: bizhours`)
3. Iteracja po przefiltrowanych maszynach:
   - Jeśli `shutdown == false`, uruchom maszynę
   - Jeśli `shutdown == true`, zatrzymaj maszynę
4. Zaloguj wynik działania
5. Wyślij e-mail


Zobacz [skrypt Python na GitHubie](https://github.com/IriW/azure-automation-runbooks/blob/main/start-stop-vms/start-stop-vms-by-tag.py)

---

## Dobre praktyki i alternatywy

- Preferuj PowerShell ze względu na lepsze wsparcie modułów i obsługę błędów
- Rozważ użycie Azure Functions do automatyzacji bezserwerowej
- Wprowadź politykę tagowania z użyciem Azure Policy
- Zbieraj logi z runbooków przy użyciu Log Analytics

---

## Dalsza lektura

- [Dokumentacja Microsoft: Azure Automation](https://learn.microsoft.com/pl-pl/azure/automation/)
- [Model dokumentacyjny Diátaxis](https://diataxis.fr/)

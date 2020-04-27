# PatientPortal

Cross platform patient portal for UK-based general practitioners

## Background

Patients at Nuffield healthcare center do not have online access to book, cancel, or reschedule appointments nor can they easily order prescriptions or look at past diagnoses and treatments, check their attendance and ask simple questions about their health.

## Aims and objectives

The software development of a web-based patient portal available to registered patients. The main objectives of this software is to provide the patient with the ability to book, reschedule or cancel appointments, view and order prescriptions, check the history of past diagnosis and any treatment received, be reminded to attend appointments via email or notifications and ask their GP's simple questions about their health. The software system will also provide clinicians an online platform to help their patients directly by answering the questions they ask, and having a schedule of booked appointments with the ability to report absences and reschedule patient’s around if they are unavailable. Administrators will be able to register clinicians, delete patients, clinicians, and delete patient data and or clinician data when requested directly.

## Design choices

- nodejs web application => cross platform client-side and server-side / can be integrated with mobile + desktop frameworks such as electron / react native etc

- MVC architecture       => Separation of concern / TDD / Fits the scenario

- Mongo database         => Object oriented / JSON (preferably) / Easy CRUD

- JWT authentication     => Easy way to authenticate API calls / can store any amount of data + cryptographically signed with server's key

- Docker       => One-click deploy on the cloud / easy local dev environment setup / very convenient

## Prerequisites

- Docker version 19.03.8+

- Docker-compose version 1.25.4+

## How to run

If you want automated updates from github then use install script otherwise use docker-compose manually.

### Run manually
```bash
docker-compose -f "docker-compose.yml" up -d --build
```

### Run the install script
```bash
./install.sh
```
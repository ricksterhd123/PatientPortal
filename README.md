# PatientPortal ![Node.js CI](https://github.com/ricksterhd123/PatientPortal/workflows/Node.js%20CI/badge.svg) [![DeepScan grade](https://deepscan.io/api/teams/9227/projects/11524/branches/172550/badge/grade.svg?token=a1fa0980263b30233c0ddf1e9c3ed778290db2ee)](https://deepscan.io/dashboard#view=project&tid=9227&pid=11524&bid=172550)

A cross platform patient portal for UK-based general practitioners

## Background

Patients at Nuffield healthcare center do not have online access to book, cancel, or reschedule appointments nor can they easily order prescriptions or look at past diagnoses and treatments, check their attendance and ask simple questions about their health.

## Aims and objectives

The software development of a web-based patient portal is available only to registered patients. The main objectives of this software is to provide the patient with the ability to book, reschedule or cancel appointments and communicate with their health providers. Enabling clinicians to use the online platform to communicate directly with their patients with text messaging (within the system) and allowing them to view, reschedule or cancel their appointments. Basic administrator functionality, e.g, changing user roles. Simple user account management, e.g. changing password. Containerised, cross platform, noSQL, MERN stack. 

## Design choices

- nodejs web application => cross platform client-side and server-side / can be integrated with mobile + desktop frameworks such as electron / react native etc

- MVC architecture       => Separation of concern / TDD / Fits the scenario

- Mongo database         => Object oriented / JSON (preferably) / Easy CRUD

- JWT authentication     => Easy way to authenticate API calls / can store any amount of data + cryptographically signed with server's key

- Docker       => One-click deploy on the cloud / easy local dev environment setup / very convenient

## Prerequisites

- Docker version 19.03.8+

- Docker-compose version 1.25.4+

## Notes

Warning: Do not deploy before setting up.

## Installation

The installation script automatically installs the patient portal within a docker container and sets up a cronjob that pulls from github and updates the container.

### Run manually

```bash
docker-compose -f "docker-compose.yml" up -d --build
```

### Run the install script

```bash
chmod +x install.sh
./install.sh
```

### Post-install setup

The first user registered becomes admin. Before deploying, register at least one user account and ensure that the password is not generic and is never used more than once.

### Run in visual studio code

Note: must add 'C:\Program Files\Git\bin' to Path before 'C:\Windows\System32'.
Run the launch.json file.

### Try the demo

Please use at your own risk and do not use the same passwords twice!
https://ricksterhd123.studio

#### Accounts

Here are some of the user accounts available within the demo

##### Patient:

```
username: user
password: test123
```
##### Clinician

```
username: doctor
password: test123
```
##### Admin:

```
username: admin
password: test123
```
